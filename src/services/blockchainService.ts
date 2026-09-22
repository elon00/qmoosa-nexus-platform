import { NetworkChain } from '../types';

export interface ActiveNetworkConfig {
  id: string;
  name: string;
  chainType: 'evm' | 'solana' | 'qmoosa-native';
  chainIdHex?: string;
  chainIdDec?: number;
  rpcUrl: string;
  explorerBaseUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contracts?: {
    qmsToken?: string;
    policyGuardian?: string;
    smartAccountFactory?: string;
  };
}

export const LIVE_SUPPORTED_NETWORKS: Record<string, ActiveNetworkConfig> = {
  'qmoosa-l1': {
    id: 'qmoosa-l1',
    name: 'QMoosa L1 Concept (Local Simulation)',
    chainType: 'qmoosa-native',
    rpcUrl: 'local-simulation',
    explorerBaseUrl: '/explorer',
    nativeCurrency: { name: 'QMoosa Token', symbol: 'QMS', decimals: 18 },
  },
  'ethereum-sepolia': {
    id: 'ethereum-sepolia',
    name: 'Ethereum Sepolia Testnet',
    chainType: 'evm',
    chainIdHex: '0xaa36a7',
    chainIdDec: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    explorerBaseUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    contracts: {
      qmsToken: '0x71C8360d5bA8a4674D6E02598711e9f1D89d7001',
      policyGuardian: '0x49B5c269Da9101b0fB274d6C8A60eE475Ec63e77',
    },
  },
  'base-sepolia': {
    id: 'base-sepolia',
    name: 'Base Sepolia (L2)',
    chainType: 'evm',
    chainIdHex: '0x14a34',
    chainIdDec: 84532,
    rpcUrl: 'https://sepolia.base.org',
    explorerBaseUrl: 'https://sepolia.basescan.org',
    nativeCurrency: { name: 'Base Sepolia Ether', symbol: 'ETH', decimals: 18 },
    contracts: {
      smartAccountFactory: '0x83B33075d9e504c5598AcCE4D5174092b77a0631',
    },
  },
  'polygon-amoy': {
    id: 'polygon-amoy',
    name: 'Polygon Amoy Testnet',
    chainType: 'evm',
    chainIdHex: '0x13882',
    chainIdDec: 80002,
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerBaseUrl: 'https://amoy.polygonscan.com',
    nativeCurrency: { name: 'Polygon MATIC', symbol: 'POL', decimals: 18 },
  },
  'solana-devnet': {
    id: 'solana-devnet',
    name: 'Solana Devnet',
    chainType: 'solana',
    rpcUrl: 'https://api.devnet.solana.com',
    explorerBaseUrl: 'https://explorer.solana.com/?cluster=devnet',
    nativeCurrency: { name: 'Solana Devnet SOL', symbol: 'SOL', decimals: 9 },
  },
};

export class BlockchainService {
  /**
   * Request browser wallet network switch (EIP-3085 / EIP-3326)
   */
  static async switchEVMNetwork(networkKey: string): Promise<{ success: boolean; message: string }> {
    const config = LIVE_SUPPORTED_NETWORKS[networkKey];
    if (!config || config.chainType !== 'evm' || !config.chainIdHex) {
      return { success: true, message: `Switched active context to ${config?.name || networkKey}` };
    }

    const ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
    if (!ethereum) {
      return { success: false, message: 'Web3 browser wallet (MetaMask) not detected.' };
    }

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainIdHex }],
      });
      return { success: true, message: `Successfully connected to ${config.name}` };
    } catch (switchError: any) {
      // 4902 error code means network is not yet added to wallet
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: config.chainIdHex,
                chainName: config.name,
                rpcUrls: [config.rpcUrl],
                blockExplorerUrls: [config.explorerBaseUrl],
                nativeCurrency: config.nativeCurrency,
              },
            ],
          });
          return { success: true, message: `Added and connected to ${config.name}` };
        } catch (addError: any) {
          return { success: false, message: addError.message || 'Failed to add network to wallet' };
        }
      }
      return { success: false, message: switchError.message || 'Failed to switch network' };
    }
  }

  /**
   * Fetch real on-chain balance via RPC (with graceful fallback)
   */
  static async fetchLiveRpcBalance(
    address: string,
    networkKey: string
  ): Promise<{ balance: number; symbol: string; verified: boolean; error?: string }> {
    const config = LIVE_SUPPORTED_NETWORKS[networkKey];
    if (!config) {
      return { balance: 0, symbol: 'UNKNOWN', verified: false, error: 'unknown network' };
    }
    if (config.chainType === 'qmoosa-native') {
      return {
        balance: 0,
        symbol: config.nativeCurrency.symbol,
        verified: false,
        error: 'QMoosa native network is a local simulation; no public RPC balance is available',
      };
    }

    try {
      if (config.chainType === 'evm') {
        const response = await fetch(config.rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [address, 'latest'],
            id: 1,
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) {
          return {
            balance: 0,
            symbol: config.nativeCurrency.symbol,
            verified: false,
            error: `RPC HTTP ${response.status}`,
          };
        }
        const data = await response.json();
        if (typeof data.result === 'string') {
          const wei = BigInt(data.result);
          const eth = Number(wei) / 1e18;
          return {
            balance: Number(eth.toFixed(6)),
            symbol: config.nativeCurrency.symbol,
            verified: true,
          };
        }
        return {
          balance: 0,
          symbol: config.nativeCurrency.symbol,
          verified: false,
          error: 'RPC response did not contain a balance result',
        };
      }
      return {
        balance: 0,
        symbol: config.nativeCurrency.symbol,
        verified: false,
        error: 'live Solana balance adapter not implemented',
      };
    } catch (error: any) {
      return {
        balance: 0,
        symbol: config.nativeCurrency.symbol,
        verified: false,
        error: error?.message || 'RPC request failed',
      };
    }
  }

  /**
   * Broadcast transaction or generate simulated on-chain block commitment
   */
  static async broadcastTransaction(payload: {
    from: string;
    to: string;
    amount: number;
    tokenSymbol: string;
    networkKey: string;
  }): Promise<{ success: boolean; txHash: string; explorerUrl: string; error?: string }> {
    const config = LIVE_SUPPORTED_NETWORKS[payload.networkKey];
    if (!config) {
      return { success: false, txHash: '', explorerUrl: '', error: 'unknown network' };
    }

    // This repository does not hold user signing keys and does not implement a
    // production transaction broadcaster. Never fabricate a chain tx hash.
    return {
      success: false,
      txHash: '',
      explorerUrl: config.explorerBaseUrl,
      error: 'transaction broadcast is not implemented; prepare/sign with an authorized wallet provider',
    };
  }
}
