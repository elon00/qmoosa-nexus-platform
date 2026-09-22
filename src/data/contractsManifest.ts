export interface DeployedContract {
  name: string;
  symbol?: string;
  chain: string;
  network: string;
  chainId: number | string;
  address: string;
  explorerUrl: string;
  standard: string;
  verified: boolean;
  deploymentTimestamp: number;
  evidenceStatus: 'UNVERIFIED_CANDIDATE' | 'VERIFIED_EXTERNAL_EVIDENCE';
}

const UNVERIFIED = 'UNVERIFIED_CANDIDATE' as const;

/**
 * Candidate/testnet metadata.
 *
 * These records are NOT treated as verified deployments until transaction,
 * block, bytecode/source and commit evidence is recorded and independently
 * reproducible from the target chain explorer/RPC.
 */
export const DEPLOYED_CONTRACTS_MANIFEST: DeployedContract[] = [
  {
    name: 'QMoosa Nexus Token',
    symbol: 'QMS',
    chain: 'Ethereum Sepolia',
    network: 'ethereum-sepolia',
    chainId: 11155111,
    address: '0x71C8360d5bA8a4674D6E02598711e9f1D89d7001',
    explorerUrl: 'https://sepolia.etherscan.io/address/0x71C8360d5bA8a4674D6E02598711e9f1D89d7001',
    standard: 'ERC-20 / EIP-2612 research contract',
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED,
  },
  {
    name: 'Policy Guardian',
    chain: 'Ethereum Sepolia',
    network: 'ethereum-sepolia',
    chainId: 11155111,
    address: '0x49B5c269Da9101b0fB274d6C8A60eE475Ec63e77',
    explorerUrl: 'https://sepolia.etherscan.io/address/0x49B5c269Da9101b0fB274d6C8A60eE475Ec63e77',
    standard: 'Policy-control research contract',
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED,
  },
  {
    name: 'QMoosa Smart Account',
    chain: 'Base Sepolia',
    network: 'base-sepolia',
    chainId: 84532,
    address: '0x83B33075d9e504c5598AcCE4D5174092b77a0631',
    explorerUrl: 'https://sepolia.basescan.org/address/0x83B33075d9e504c5598AcCE4D5174092b77a0631',
    standard: 'ERC-4337 research contract',
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED,
  },
  {
    name: 'QMoosa Paymaster',
    chain: 'Base Sepolia',
    network: 'base-sepolia',
    chainId: 84532,
    address: '0x22F439d5A64C2E9f753C49dF0bE87A4eDDeF1108',
    explorerUrl: 'https://sepolia.basescan.org/address/0x22F439d5A64C2E9f753C49dF0bE87A4eDDeF1108',
    standard: 'ERC-4337 paymaster research contract',
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED,
  },
  {
    name: 'QMoosa Guardian Program',
    chain: 'Solana Devnet',
    network: 'solana-devnet',
    chainId: 'devnet',
    address: 'QMoosAGuardian11111111111111111111111111111',
    explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
    standard: 'Solana program research metadata',
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED,
  },
  {
    name: 'Cross-Chain Relayer',
    chain: 'Polygon Amoy',
    network: 'polygon-amoy',
    chainId: 80002,
    address: '0x55B229a4aEcE1c29fB5B49dF0bE87A4eDDeF9921',
    explorerUrl: 'https://amoy.polygonscan.com/address/0x55B229a4aEcE1c29fB5B49dF0bE87A4eDDeF9921',
    standard: 'Cross-chain relayer research contract',
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED,
  },
];

export const CONTRACT_ABIS = {
  QMoosaToken: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function MAX_SUPPLY() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function transferFrom(address from, address to, uint256 amount) returns (bool)',
    'function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
  ],
  PolicyGuardian: [
    'function setPolicy(address account, uint256 maxDailySpendingUsdt, uint256 maxPerTxUsdt, uint256 requireHumanApprovalAboveUsdt, uint8 riskScoreThreshold)',
    'function registerSessionKey(address account, address agentSigner, uint256 validDurationSeconds, uint256 dailyAllowanceUsdt)',
    'function revokeSessionKey(address account, address agentSigner)',
    'function toggleEmergencyPause(address account, bool isPaused)',
    'function validateAndRecordExecution(address account, address agentSigner, uint256 amountUsdt, address targetContract, uint8 estimatedRiskScore, uint256 targetChainId) returns (bool)',
  ],
  QMoosaSmartAccount: [
    'function execute(address dest, uint256 value, bytes calldata func) returns (bytes memory)',
    'function executeAgentTransaction(address agentSigner, address dest, uint256 value, bytes calldata func, uint256 estimatedUsdtCost, uint8 riskScore) returns (bytes memory)',
    'function policyGuardian() view returns (address)',
    'function owner() view returns (address)',
  ],
};
