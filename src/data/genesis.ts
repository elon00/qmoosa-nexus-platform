import { ChainConfig, TokenomicsAllocation, SDKExample, ValidatorNode, AgentWallet, AIModelOption } from '../types';

export const TOTAL_QMS_MAX_SUPPLY = 1_000_000_000_000_000; // 1,000 Trillion (1 Quadrillion) QMS

export const AI_MODELS: AIModelOption[] = [
  {
    id: 'auto',
    name: 'Smart Model Router (Auto)',
    provider: 'QMoosa Native',
    avgLatencyMs: 280,
    costPerMTokensUsd: 0.15,
    description: 'Dynamically routes intent to the best model (Gemini, Claude, or Local LLM) based on task complexity, speed, & cost.',
    badge: 'Recommended',
    badgeColor: 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white',
    supportsNativeToolCalling: true,
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    provider: 'Google',
    avgLatencyMs: 180,
    costPerMTokensUsd: 0.075,
    description: 'Ultra-fast multimodal reasoning with native structured tool-calling schema validation.',
    badge: 'Fastest',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    supportsNativeToolCalling: true,
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    avgLatencyMs: 420,
    costPerMTokensUsd: 3.0,
    description: 'Deep mathematical & multi-chain arbitrage reasoning with complex state tree analysis.',
    badge: 'Deep Reasoning',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    supportsNativeToolCalling: true,
  },
  {
    id: 'deepseek-r1-local',
    name: 'DeepSeek-R1 (Local WASM)',
    provider: 'DeepSeek',
    avgLatencyMs: 310,
    costPerMTokensUsd: 0.0,
    description: 'Zero-cost open-weights reasoning model running in confidential enclave / local WASM container.',
    badge: 'Open Weights',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    supportsNativeToolCalling: true,
  },
  {
    id: 'llama3-70b-local',
    name: 'Llama 3 70B (Open-Source)',
    provider: 'Meta Open-Source',
    avgLatencyMs: 290,
    costPerMTokensUsd: 0.0,
    description: 'Self-hosted open-source model running on QMoosa validator node inference clusters.',
    badge: 'Self-Hosted',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    supportsNativeToolCalling: true,
  },
  {
    id: 'qmoosa-agent-v1',
    name: 'QMoosa Special Agent v1',
    provider: 'QMoosa Native',
    avgLatencyMs: 120,
    costPerMTokensUsd: 0.01,
    description: 'Specialized Web4 micro-model fine-tuned specifically for sub-second DEX swaps and Policy checks.',
    badge: 'Fine-Tuned',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    supportsNativeToolCalling: true,
  },
];

export const NETWORK_CHAINS: ChainConfig[] = [
  {
    id: 'qmoosa',
    name: 'QMoosa Nexus L1',
    symbol: 'QMS',
    type: 'L1',
    iconName: 'Cpu',
    avgGasUsd: 0.00005,
    finalityMs: 350,
    usdtSupported: true,
    rpcEndpoint: 'https://rpc.testnet.qmoosa.nexus',
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
    category: 'Public Liquidity & Global Market Making',
    percentage: 15.0,
    amountQms: 150_000_000_000_000,
    description: 'Initial DEX/CEX liquidity pools paired against USDT, USDC, ETH, and SOL across global Tier-1 exchanges.',
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
    category: 'Strategic Global Institutional Backing',
    percentage: 5.0,
    amountQms: 50_000_000_000_000,
    description: 'Long-term strategic ecosystem partners and sovereign infrastructure funds with 36-month lockups.',
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
    id: 'val-01',
    name: 'US-East Parallel GPU Prover (NVIDIA H100)',
    address: '0xqms...val1001',
    region: 'North America (Virginia)',
    stakedQms: 250_000_000_000,
    status: 'active',
    blocksProposed: 14820,
    uptimePercentage: 99.99,
  },
  {
    id: 'val-02',
    name: 'EU-Central ZK Inference Cluster',
    address: '0xqms...val1002',
    region: 'Europe (Frankfurt)',
    stakedQms: 180_000_000_000,
    status: 'active',
    blocksProposed: 12450,
    uptimePercentage: 99.98,
  },
  {
    id: 'val-03',
    name: 'Asia-East Quantum Relay Sentinel',
    address: '0xqms...val1003',
    region: 'Asia-Pacific (Tokyo)',
    stakedQms: 195_000_000_000,
    status: 'active',
    blocksProposed: 13910,
    uptimePercentage: 100.0,
  },
  {
    id: 'val-04',
    name: 'MEA Middle East Sovereign Node',
    address: '0xqms...val1004',
    region: 'Middle East (Dubai VARA Hub)',
    stakedQms: 120_000_000_000,
    status: 'active',
    blocksProposed: 9840,
    uptimePercentage: 99.95,
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
