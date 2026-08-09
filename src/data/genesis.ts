import { ChainConfig, TokenomicsAllocation, SDKExample, ValidatorNode, AgentWallet, AIModelOption } from '../types';

export const TOTAL_QMS_MAX_SUPPLY = 100_000_000_000_000; // 100 Trillion QMS

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
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    type: 'Cross-Chain',
    iconName: 'Layers',
    avgGasUsd: 1.25,
    finalityMs: 12000,
    usdtSupported: true,
    rpcEndpoint: 'https://eth-mainnet.g.alchemy.com/v2/demo',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    type: 'Cross-Chain',
    iconName: 'Zap',
    avgGasUsd: 0.00025,
    finalityMs: 400,
    usdtSupported: true,
    rpcEndpoint: 'https://api.mainnet-beta.solana.com',
  },
  {
    id: 'base',
    name: 'Base L2',
    symbol: 'ETH',
    type: 'L2',
    iconName: 'Shield',
    avgGasUsd: 0.005,
    finalityMs: 1500,
    usdtSupported: true,
    rpcEndpoint: 'https://mainnet.base.org',
  },
  {
    id: 'polygon',
    name: 'Polygon PoS',
    symbol: 'POL',
    type: 'Cross-Chain',
    iconName: 'Globe',
    avgGasUsd: 0.01,
    finalityMs: 2000,
    usdtSupported: true,
    rpcEndpoint: 'https://polygon-rpc.com',
  },
  {
    id: 'bnb',
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    type: 'Cross-Chain',
    iconName: 'Coins',
    avgGasUsd: 0.03,
    finalityMs: 3000,
    usdtSupported: true,
    rpcEndpoint: 'https://bsc-dataseed.binance.org',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    symbol: 'ETH',
    type: 'L2',
    iconName: 'TrendingUp',
    avgGasUsd: 0.02,
    finalityMs: 1000,
    usdtSupported: true,
    rpcEndpoint: 'https://arb1.arbitrum.io/rpc',
  },
];

export const TOKENOMICS_ALLOCATION: TokenomicsAllocation[] = [
  {
    category: 'Ecosystem & User Incentives',
    percentage: 35,
    amountQms: 35_000_000_000_000,
    description: 'Community grants, user dApp rewards, cross-chain liquidity mining & testnet rewards.',
    color: 'bg-emerald-500',
  },
  {
    category: 'Agentic AI Compute & Network Protocol',
    percentage: 25,
    amountQms: 25_000_000_000_000,
    description: 'Autonomous Agent execution subsidies, proof verification nodes, & AI model inference pools.',
    color: 'bg-cyan-500',
  },
  {
    category: 'Validator Staking & Consensus Security',
    percentage: 15,
    amountQms: 15_000_000_000_000,
    description: 'Block reward pool for PoS + BFT validators and ZK-rollups provers.',
    color: 'bg-purple-500',
  },
  {
    category: 'Developer Foundation & Core R&D',
    percentage: 10,
    amountQms: 10_000_000_000_000,
    description: 'Open-source SDKs, smart contract security audits, compiler tooling, and core node engineering.',
    color: 'bg-blue-500',
  },
  {
    category: 'Protocol Treasury',
    percentage: 10,
    amountQms: 10_000_000_000_000,
    description: 'DAO governed reserve for strategic multi-chain expansion and emergency liquidity.',
    color: 'bg-amber-500',
  },
  {
    category: 'Team & Early Contributors',
    percentage: 5,
    amountQms: 5_000_000_000_000,
    description: '4-year linear vesting with 1-year cliff for core builders.',
    color: 'bg-slate-500',
  },
];

export const DEFAULT_VALIDATORS: ValidatorNode[] = [
  {
    id: 'val-1',
    name: 'Nexus Alpha Node (Frankfurt)',
    address: '0xqms...val1001',
    region: 'EU-Central',
    stakedQms: 2_500_000_000_000,
    status: 'active',
    blocksProposed: 14820,
    uptimePercentage: 99.98,
  },
  {
    id: 'val-2',
    name: 'Singapore Agentic Sentinel',
    address: '0xqms...val1002',
    region: 'AP-Southeast',
    stakedQms: 1_800_000_000_000,
    status: 'active',
    blocksProposed: 12450,
    uptimePercentage: 99.95,
  },
  {
    id: 'val-3',
    name: 'US-East Parallel VM Prover',
    address: '0xqms...val1003',
    region: 'US-East',
    stakedQms: 3_100_000_000_000,
    status: 'active',
    blocksProposed: 19800,
    uptimePercentage: 100.0,
  },
  {
    id: 'val-4',
    name: 'Tokyo ZK Proof Validator',
    address: '0xqms...val1004',
    region: 'AP-Northeast',
    stakedQms: 1_200_000_000_000,
    status: 'active',
    blocksProposed: 9310,
    uptimePercentage: 99.91,
  },
];

export const DEFAULT_AGENT_WALLETS: AgentWallet[] = [
  {
    id: 'ag-wallet-1',
    name: 'Shopping & Yield Agent Wallet',
    address: '0xNexusAgent_8a1f9e2b03c4',
    qmsBalance: 50_000_000,
    usdtBalance: 1_250.0,
    smartAccountType: 'Nexus-Native',
    policy: {
      maxDailySpendingUsdt: 100.0,
      usedTodayUsdt: 24.5,
      maxPerTxUsdt: 50.0,
      allowedChains: ['qmoosa', 'solana', 'ethereum', 'base', 'polygon'],
      allowedContracts: [
        '0xContract_DeFi_Router_01',
        '0xContract_USDT_Bridge_02',
        '0xContract_Shopping_Escrow',
      ],
      requireHumanApprovalAboveUsdt: 75.0,
      riskScoreThreshold: 35,
      timeLimitWindowMinutes: 60,
      emergencyPauseActive: false,
    },
    createdTimestamp: Date.now() - 86400000 * 3,
  },
  {
    id: 'ag-wallet-2',
    name: 'Cross-Chain Arbitrage Bot',
    address: '0xNexusAgent_3c9d7e1f4a5b',
    qmsBalance: 250_000_000,
    usdtBalance: 5_000.0,
    smartAccountType: 'ERC-4337',
    policy: {
      maxDailySpendingUsdt: 500.0,
      usedTodayUsdt: 120.0,
      maxPerTxUsdt: 200.0,
      allowedChains: ['qmoosa', 'arbitrum', 'polygon', 'bnb'],
      allowedContracts: ['0xDex_Router_Aggregator', '0xBridge_Vault_01'],
      requireHumanApprovalAboveUsdt: 300.0,
      riskScoreThreshold: 50,
      timeLimitWindowMinutes: 120,
      emergencyPauseActive: false,
    },
    createdTimestamp: Date.now() - 86400000 * 7,
  },
];

export const SDK_EXAMPLES: SDKExample[] = [
  {
    id: 'ts-agent-create',
    title: 'TypeScript: Create Agent & Spending Limits',
    language: 'typescript',
    description: 'Initialize a autonomous AI Agent with strict spending controls and Smart Account permissions.',
    code: `import { QMoosaSDK } from '@qmoosa/nexus-sdk';

const sdk = new QMoosaSDK({
  network: 'testnet',
  rpcUrl: 'https://rpc.testnet.qmoosa.nexus'
});

// 1. Define Agent Spending Policy
const policy = sdk.createPolicy({
  maxDailySpendingUsdt: 100.0,
  maxPerTxUsdt: 50.0,
  allowedTokens: ['USDT', 'QMS'],
  allowedChains: ['qmoosa', 'solana', 'ethereum'],
  requireHumanApprovalAboveUsdt: 75.0,
  emergencyPause: false
});

// 2. Spawn Smart Account Agent Wallet
const agent = await sdk.createAgent({
  name: "ShoppingAssistantAgent",
  policy: policy,
  accountType: "Nexus-Native"
});

console.log("Agent Address:", agent.address);
console.log("Daily Limit Remaining:", agent.getRemainingAllowance());
`,
  },
  {
    id: 'py-agent-task',
    title: 'Python: Natural Language On-Chain Task',
    language: 'python',
    description: 'Execute natural language tasks through QMoosa AI reasoning engine with automatic transaction simulation.',
    code: `from qmoosa import QMoosaClient, AgentPolicy

client = QMoosaClient(network="testnet")

# Initialize agent with policy
agent = client.get_agent(name="ShoppingAssistantAgent")

# Execute reasoning and plan
plan = agent.plan_execution(
    prompt="Find best route to swap 20 USDT for QMS on QMoosa L1 with lowest slippage"
)

print(f"Confidence Score: {plan.confidence}%")
print(f"Risk Score: {plan.risk_score}/100")

if plan.policy_approved:
    receipt = agent.execute_plan(plan)
    print("Execution Success! Tx Hash:", receipt.tx_hash)
else:
    print("Policy Rejected:", plan.violations)
`,
  },
  {
    id: 'rust-cross-chain',
    title: 'Rust: Cross-Chain USDT Bridge & Verification',
    language: 'rust',
    description: 'Perform ZK-proof verified cross-chain transfers between QMoosa L1, Ethereum, and Solana.',
    code: `use qmoosa_nexus_sdk::{QMoosaClient, ChainId, CrossChainRequest};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = QMoosaClient::new("https://rpc.testnet.qmoosa.nexus");

    let bridge_tx = CrossChainRequest {
        source_chain: ChainId::Ethereum,
        destination_chain: ChainId::QMoosaL1,
        amount_usdt: 100.0,
        recipient_agent: "0xNexusAgent_8a1f9e2b03c4",
        include_zk_proof: true,
    };

    let quote = client.get_bridge_quote(&bridge_tx).await?;
    println!("Estimated Gas Fee: \${:.4}", quote.estimated_gas_usd);

    let result = client.execute_cross_chain(bridge_tx, quote).await?;
    println!("Bridge Success! ZK Proof Hash: {}", result.zk_proof_hash);

    Ok(())
}
`,
  },
];
