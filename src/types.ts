export type NetworkChain = 'qmoosa' | 'ethereum' | 'solana' | 'base' | 'polygon' | 'bnb' | 'arbitrum';

export type AIModelId = 'auto' | 'gemini-3.6-flash' | 'claude-3.5-sonnet' | 'deepseek-r1-local' | 'llama3-70b-local' | 'qmoosa-agent-v1';

export interface AIModelOption {
  id: AIModelId;
  name: string;
  provider: 'Google' | 'Anthropic' | 'DeepSeek' | 'Meta Open-Source' | 'QMoosa Native';
  avgLatencyMs: number;
  costPerMTokensUsd: number;
  description: string;
  badge: string;
  badgeColor: string;
  supportsNativeToolCalling: boolean;
}

export interface ChainConfig {
  id: NetworkChain;
  name: string;
  symbol: string;
  type: 'L1' | 'L2' | 'Cross-Chain';
  iconName: string;
  avgGasUsd: number;
  finalityMs: number;
  usdtSupported: boolean;
  rpcEndpoint: string;
}

export interface AgentPolicy {
  maxDailySpendingUsdt: number;
  usedTodayUsdt: number;
  maxPerTxUsdt: number;
  allowedChains: NetworkChain[];
  allowedContracts: string[];
  requireHumanApprovalAboveUsdt: number;
  riskScoreThreshold: number; // 0 to 100
  timeLimitWindowMinutes: number;
  emergencyPauseActive: boolean;
}

export interface AgentWallet {
  id: string;
  name: string;
  address: string;
  qmsBalance: number;
  usdtBalance: number;
  smartAccountType: 'ERC-4337' | 'Sol-AA' | 'Nexus-Native';
  policy: AgentPolicy;
  createdTimestamp: number;
}

export interface ExecutionPlanStep {
  stepIndex: number;
  action: string;
  targetChain: NetworkChain;
  details: string;
  estimatedFeeUsd: number;
  estimatedFeeQms: number;
  contractAddress?: string;
  riskScore: number;
  status: 'pending' | 'simulating' | 'verified' | 'executed' | 'rejected';
  toolCallExecuted?: string;
}

export interface AgentExecutionPlan {
  id: string;
  userPrompt: string;
  agentName: string;
  selectedModel: AIModelId;
  resolvedModelName: string;
  modelLatencyMs: number;
  modelTokensUsed: number;
  toolCallsCount: number;
  reasoningSummary: string;
  confidenceScore: number;
  steps: ExecutionPlanStep[];
  totalUsdtCost: number;
  totalQmsFee: number;
  policyApproved: boolean;
  policyViolations: string[];
  simulationHash: string;
  status: 'draft' | 'ready' | 'executed' | 'failed';
  executedTxHash?: string;
  timestamp: number;
}

export interface BlockTransaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  amount: number;
  tokenSymbol: 'QMS' | 'USDT';
  chain: NetworkChain;
  type: 'Transfer' | 'AgentExecution' | 'CrossChainBridge' | 'ContractDeploy' | 'Staking';
  gasUsed: number;
  status: 'Success' | 'Pending' | 'Failed';
  timestamp: number;
  agentName?: string;
}

export interface Block {
  height: number;
  hash: string;
  previousHash: string;
  proposer: string;
  txCount: number;
  transactions: BlockTransaction[];
  zkProofHash: string;
  gasLimit: number;
  gasUsed: number;
  tps: number;
  timestamp: number;
}

export interface ValidatorNode {
  id: string;
  name: string;
  address: string;
  region: string;
  stakedQms: number;
  status: 'active' | 'syncing' | 'slashed';
  blocksProposed: number;
  uptimePercentage: number;
}

export interface TokenomicsAllocation {
  category: string;
  percentage: number;
  amountQms: number;
  description: string;
  color: string;
}

export interface SDKExample {
  id: string;
  title: string;
  language: 'typescript' | 'python' | 'rust';
  description: string;
  code: string;
}
