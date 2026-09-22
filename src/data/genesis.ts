import { ChainConfig, TokenomicsAllocation, SDKExample, ValidatorNode, AgentWallet, AIModelOption } from '../types';

export const TOTAL_QMS_MAX_SUPPLY = 1_000_000_000_000_000; // 1,000 Trillion (1 Quadrillion) QMS

export const AI_MODELS: AIModelOption[] = [
  {
    id: 'auto',
    name: 'Smart Model Router (Auto)',
    provider: 'QMoosa Native',
    avgLatencyMs: 0,
    costPerMTokensUsd: 0,
    description: 'Prototype router. Only explicitly configured providers are live; other routes are simulation adapters.',
    badge: 'Recommended',
    badgeColor: 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white',
    supportsNativeToolCalling: true,
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Configured Gemini Model',
    provider: 'Google',
    avgLatencyMs: 0,
    costPerMTokensUsd: 0,
    description: 'Uses the server-configured GEMINI_MODEL when GEMINI_API_KEY and GEMINI_MODEL are set.',
    badge: 'Configured',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    supportsNativeToolCalling: true,
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude-style Demo Adapter',
    provider: 'Anthropic',
    avgLatencyMs: 0,
    costPerMTokensUsd: 0,
    description: 'Simulation adapter only; no Anthropic provider call is implemented in this repository.',
    badge: 'Demo',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    supportsNativeToolCalling: true,
  },
  {
    id: 'deepseek-r1-local',
    name: 'Local-Model Demo Adapter',
    provider: 'DeepSeek',
    avgLatencyMs: 0,
    costPerMTokensUsd: 0.0,
    description: 'Simulation adapter only; no verified local WASM/enclave model runtime is implemented here.',
    badge: 'Demo',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    supportsNativeToolCalling: true,
  },
  {
    id: 'llama3-70b-local',
    name: 'Llama-style Demo Adapter',
    provider: 'Meta Open-Source',
    avgLatencyMs: 0,
    costPerMTokensUsd: 0.0,
    description: 'Simulation adapter only; no validator-node inference cluster is evidenced by this repository.',
    badge: 'Demo',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    supportsNativeToolCalling: true,
  },
  {
    id: 'qmoosa-agent-v1',
    name: 'QMoosa Demo Adapter',
    provider: 'QMoosa Native',
    avgLatencyMs: 0,
    costPerMTokensUsd: 0,
    description: 'Rule-based/simulated planning adapter for UI demonstrations; no fine-tuned production model is claimed.',
    badge: 'Demo',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    supportsNativeToolCalling: true,
  },
];

export const NETWORK_CHAINS: ChainConfig[] = [
  {
    id: 'qmoosa',
    name: 'QMoosa L1 Concept (Local Simulation)',
    symbol: 'QMS',
    type: 'L1',
    iconName: 'Cpu',
    avgGasUsd: 0.00005,
    finalityMs: 350,
    usdtSupported: true,
    rpcEndpoint: 'local-simulation',
  },
  {
    id: 'ethereum',
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    type: 'Cross-Chain',
    iconName: 'Layers',
    avgGasUsd: 1.25,
    finalityMs: 12000,
    usdtSupported: true,
    rpcEndpoint: 'https://rpc.sepolia.org',
  },
  {
    id: 'solana',
    name: 'Solana Devnet',
    symbol: 'SOL',
    type: 'Cross-Chain',
    iconName: 'Zap',
    avgGasUsd: 0.00025,
    finalityMs: 400,
    usdtSupported: true,
    rpcEndpoint: 'https://api.devnet.solana.com',
  },
  {
    id: 'base',
    name: 'Base Sepolia',
    symbol: 'ETH',
    type: 'L2',
    iconName: 'Shield',
    avgGasUsd: 0.001,
    finalityMs: 2000,
    usdtSupported: true,
    rpcEndpoint: 'https://sepolia.base.org',
  },
  {
    id: 'polygon',
    name: 'Polygon Amoy',
    symbol: 'POL',
    type: 'L2',
    iconName: 'Activity',
    avgGasUsd: 0.005,
    finalityMs: 2000,
    usdtSupported: true,
    rpcEndpoint: 'https://rpc-amoy.polygon.technology',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum Sepolia',
    symbol: 'ETH',
    type: 'L2',
    iconName: 'RefreshCw',
    avgGasUsd: 0.002,
    finalityMs: 1500,
    usdtSupported: true,
    rpcEndpoint: 'https://sepolia-rollup.arbitrum.io/rpc',
  },
  {
    id: 'bnb',
    name: 'BNB Smart Chain Testnet',
    symbol: 'BNB',
    type: 'Cross-Chain',
    iconName: 'Droplet',
    avgGasUsd: 0.02,
    finalityMs: 3000,
    usdtSupported: true,
    rpcEndpoint: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  },
];

export const TOKENOMICS_ALLOCATION: TokenomicsAllocation[] = [
  {
    category: 'Ecosystem & Autonomous Agent Economy',
    percentage: 35.0,
    amountQms: 350_000_000_000_000,
    description: 'Funding AI agent developers, on-chain autonomous liquidity bots, and autonomous Web 4.0 applications.',
    color: 'bg-cyan-500',
  },
  {
    category: 'Proof-of-Useful-Compute Staking Rewards',
    percentage: 25.0,
    amountQms: 250_000_000_000_000,
    description: 'Continuous block rewards for high-performance GPU validator nodes executing AI inference and state proofs.',
    color: 'bg-emerald-500',
  },
  {
    category: 'Liquidity / market allocation concept',
    percentage: 15.0,
    amountQms: 150_000_000_000_000,
    description: 'Design allocation only. No exchange listing, locked liquidity, market-making agreement, or liquidity guarantee is claimed.',
    color: 'bg-purple-500',
  },
  {
    category: 'Community Fair Launchpad & Airdrop Quests',
    percentage: 10.0,
    amountQms: 100_000_000_000_000,
    description: 'Community airdrops, hackathon grants, viral referral quests, and early testnet ecosystem participants.',
    color: 'bg-amber-500',
  },
  {
    category: 'Core Protocol Engineering & Security Reserve',
    percentage: 10.0,
    amountQms: 100_000_000_000_000,
    description: '48-month linear vesting for core cryptographic researchers, formal verification bounties, and emergency fund.',
    color: 'bg-blue-500',
  },
  {
    category: 'Strategic ecosystem allocation concept',
    percentage: 5.0,
    amountQms: 50_000_000_000_000,
    description: 'Design allocation only. No institutional commitment or funding partnership is claimed without external evidence.',
    color: 'bg-rose-500',
  },
];

export const DEFAULT_AGENT_WALLETS: AgentWallet[] = [
  {
    id: 'wallet-01',
    name: 'Shopping & Travel Agent',
    address: '0xNexusAgent_8a1f9e2b03c4',
    qmsBalance: 15_000_000.0,
    usdtBalance: 75.5,
    smartAccountType: 'ERC-4337',
    policy: {
      maxDailySpendingUsdt: 100.0,
      usedTodayUsdt: 24.5,
      maxPerTxUsdt: 50.0,
      allowedChains: ['qmoosa', 'solana', 'ethereum', 'base', 'polygon'],
      allowedContracts: ['0xContract_DeFi_Router_01', '0xContract_Shop_Merchant'],
      requireHumanApprovalAboveUsdt: 75.0,
      riskScoreThreshold: 35,
      timeLimitWindowMinutes: 1440,
      emergencyPauseActive: false,
    },
    createdTimestamp: Date.now() - 86400000 * 3,
  },
  {
    id: 'wallet-02',
    name: 'Multi-Chain DeFi Arbitrageur',
    address: '0xNexusAgent_4b2c1f9e8a00',
    qmsBalance: 500_000_000.0,
    usdtBalance: 500.0,
    smartAccountType: 'ERC-4337',
    policy: {
      maxDailySpendingUsdt: 1000.0,
      usedTodayUsdt: 120.0,
      maxPerTxUsdt: 250.0,
      allowedChains: ['qmoosa', 'solana', 'ethereum', 'base', 'arbitrum'],
      allowedContracts: ['0xContract_UniSwap_V3', '0xContract_Raydium_Solana'],
      requireHumanApprovalAboveUsdt: 500.0,
      riskScoreThreshold: 60,
      timeLimitWindowMinutes: 1440,
      emergencyPauseActive: false,
    },
    createdTimestamp: Date.now() - 86400000 * 7,
  },
  {
    id: 'wallet-03',
    name: 'Quantum PQC Safe Vault',
    address: '0xNexusVault_pqc99881122',
    qmsBalance: 1_250_000_000.0,
    usdtBalance: 2500.0,
    smartAccountType: 'Nexus-Native',
    policy: {
      maxDailySpendingUsdt: 5000.0,
      usedTodayUsdt: 0.0,
      maxPerTxUsdt: 1000.0,
      allowedChains: ['qmoosa', 'ethereum', 'solana'],
      allowedContracts: ['0xZK_Prover_Vault'],
      requireHumanApprovalAboveUsdt: 1000.0,
      riskScoreThreshold: 20,
      timeLimitWindowMinutes: 1440,
      emergencyPauseActive: false,
    },
    createdTimestamp: Date.now() - 86400000 * 12,
  },
];

export const DEFAULT_VALIDATORS: ValidatorNode[] = [
  {
    id: 'demo-val-01',
    name: 'Demo Validator Fixture A',
    address: 'demo-validator-a',
    region: 'Synthetic fixture',
    stakedQms: 0,
    status: 'syncing',
    blocksProposed: 0,
    uptimePercentage: 0,
  },
  {
    id: 'demo-val-02',
    name: 'Demo Validator Fixture B',
    address: 'demo-validator-b',
    region: 'Synthetic fixture',
    stakedQms: 0,
    status: 'syncing',
    blocksProposed: 0,
    uptimePercentage: 0,
  },
];

export const SDK_EXAMPLES: SDKExample[] = [
  {
    id: 'ts-agent-deploy',
    title: 'Deploy Autonomous Agent with Policy Limits',
    language: 'typescript',
    description: 'Initialize an AI Agent with smart account session keys and spending guardian rules.',
    code: `import { QMoosaAgent, PolicyGuardian, Network } from '@qmoosa/nexus-sdk';

async function main() {
  // 1. Initialize QMoosa Nexus client
  const client = new QMoosaAgent({
    network: Network.TESTNET,
    rpcUrl: 'https://rpc.testnet.qmoosa.nexus',
    aiModel: 'auto', // Google Gemini + DeepSeek Hybrid
  });

  // 2. Configure deterministic Spending Policy Guardian
  const policy = await PolicyGuardian.create({
    maxDailySpendUsdt: 100.0,
    maxPerTxUsdt: 50.0,
    allowedChains: ['qmoosa', 'ethereum', 'solana', 'base'],
    requireHumanApprovalAboveUsdt: 75.0,
    riskThreshold: 35, // 0-100 max acceptable risk
    emergencyPause: false,
  });

  console.log('✅ Agent Smart Account Active:', policy.accountAddress);

  // 3. Prompt Agent for Autonomous Execution
  const plan = await client.planAndExecute({
    prompt: 'Find best USDT yield on Solana and allocate 20 USDT with max 0.1% slippage',
    policy,
  });

  console.log('🚀 Transaction Hash:', plan.txHash);
}

main().catch(console.error);`,
  },
  {
    id: 'py-arbitrage-bot',
    title: 'Python Multi-Chain ZK Arbitrageur',
    language: 'python',
    description: 'Monitor cross-chain DEX price disparities with sub-second parallel simulation.',
    code: `from qmoosa import NexusClient, PolicyEngine, ChainTarget
import asyncio

async def run_arbitrage():
    client = NexusClient(rpc_url="https://rpc.testnet.qmoosa.nexus")
    
    # Subscribe to real-time price feeds across EVM & Solana
    prices = await client.get_cross_chain_liquidity(
        token_pair="USDT/QMS",
        chains=[ChainTarget.QMOOSA, ChainTarget.ETHEREUM, ChainTarget.SOLANA]
    )
    
    print(f"[*] Optimal Route Identified: {prices.best_route}")
    
    # Execute atomic cross-chain swap with ZK proof
    tx = await client.execute_atomic_swap(
        amount_usdt=50.0,
        source_chain=ChainTarget.ETHEREUM,
        dest_chain=ChainTarget.QMOOSA,
        zk_snark_proof=True
    )
    print(f"[+] ZK Proof Hash: {tx.zk_proof_hash}")

if __name__ == "__main__":
    asyncio.run(run_arbitrage())`,
  },
  {
    id: 'rust-pqc-guardian',
    title: 'Rust PQC Lattice-State Guardian',
    language: 'rust',
    description: 'Post-quantum ML-DSA / Kyber signature validation on Solana / QMoosa VM.',
    code: `use qmoosa_sdk::prelude::*;
use qmoosa_pqc::mldsa::{MlDsa65KeyPair, verify_signature};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = NexusClient::connect("https://rpc.testnet.qmoosa.nexus").await?;
    
    // Generate NIST FIPS 204 ML-DSA-65 Quantum-Safe Keypair
    let keypair = MlDsa65KeyPair::generate();
    println!("🔑 PQC Public Key: 0x{}", hex::encode(keypair.public_key_bytes()));
    
    // Sign payload with Post-Quantum Lattice Signature
    let payload = b"Transfer 1000 QMS to 0xUser_Vault_9988";
    let pqc_sig = keypair.sign(payload);
    
    let is_valid = verify_signature(&keypair.public_key_bytes(), payload, &pqc_sig);
    println!("🛡 PQC Verification Status: {}", is_valid);
    
    Ok(())
}`,
  },
];
