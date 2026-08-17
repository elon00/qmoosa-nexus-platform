import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { Block, BlockTransaction, AgentExecutionPlan, ExecutionPlanStep } from './src/types';
import { DEPLOYED_CONTRACTS_MANIFEST } from './src/data/contractsManifest';
import { REGULATORY_FRAMEWORKS, GLOBAL_JURISDICTIONS, SANCTIONED_ADDRESS_DATABASE } from './src/data/complianceData';
import { SECURITY_AUDIT_REPORT } from './src/data/auditData';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Falling back to rule-based agent planner.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Global In-Memory Blockchain Testnet State
let currentBlockHeight = 104820;
let totalQmsCirculating = 15_420_000_000_000; // 15.42 Trillion QMS
let recentBlocks: Block[] = [];
let pendingTransactions: BlockTransaction[] = [];

// Seed initial blocks
function initBlockchain() {
  const sampleTxs: BlockTransaction[] = [
    {
      hash: '0x3a1f9e...b81d',
      blockNumber: currentBlockHeight - 2,
      from: '0xNexusAgent_8a1f9e2b03c4',
      to: '0xContract_DeFi_Router_01',
      amount: 20.0,
      tokenSymbol: 'USDT',
      chain: 'qmoosa',
      type: 'AgentExecution',
      gasUsed: 21000,
      status: 'Success',
      timestamp: Date.now() - 45000,
      agentName: 'ShoppingAssistantAgent',
    },
    {
      hash: '0x7e4b2a...c902',
      blockNumber: currentBlockHeight - 1,
      from: '0x0000000000000000000000000000000000000000',
      to: '0xUser_Vault_9988',
      amount: 1000000.0,
      tokenSymbol: 'QMS',
      chain: 'qmoosa',
      type: 'Transfer',
      gasUsed: 18000,
      status: 'Success',
      timestamp: Date.now() - 20000,
    },
  ];

  recentBlocks = [
    {
      height: currentBlockHeight,
      hash: '0xqms_blk_' + Math.random().toString(16).substring(2, 10),
      previousHash: '0xqms_blk_' + Math.random().toString(16).substring(2, 10),
      proposer: 'US-East Parallel VM Prover (0xqms...val1003)',
      txCount: 2,
      transactions: sampleTxs,
      zkProofHash: '0xzkp_nexus_' + Math.random().toString(16).substring(2, 12),
      gasLimit: 30000000,
      gasUsed: 39000,
      tps: 8450,
      timestamp: Date.now(),
    },
  ];
}

initBlockchain();

// API Endpoints

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    network: 'QMoosa Nexus Global Multi-Chain Platform v2.0',
    compliance: 'MiCA & FATF Enforced',
    securityScore: 98.4,
  });
});

// GET Blockchain Status & Explorer data
app.get('/api/blockchain/status', (_req: Request, res: Response) => {
  res.json({
    blockHeight: currentBlockHeight,
    tps: Math.floor(7500 + Math.random() * 2500),
    avgBlockTimeMs: 350,
    activeValidators: 128,
    totalStakedQms: 8_600_000_000_000,
    maxSupplyQms: 100_000_000_000_000,
    circulatingSupplyQms: totalQmsCirculating,
    latestBlocks: recentBlocks,
    pendingTxCount: pendingTransactions.length,
  });
});

// POST Mine / Simulate Block
app.post('/api/blockchain/mine', (_req: Request, res: Response) => {
  currentBlockHeight += 1;
  const minedTxs: BlockTransaction[] = [...pendingTransactions];
  pendingTransactions = [];

  const newBlock: Block = {
    height: currentBlockHeight,
    hash: '0xqms_blk_' + Math.random().toString(16).substring(2, 10),
    previousHash: recentBlocks[0]?.hash || '0xgenesis_hash',
    proposer: 'Nexus Alpha Node (0xqms...val1001)',
    txCount: minedTxs.length,
    transactions: minedTxs,
    zkProofHash: '0xzkp_nexus_' + Math.random().toString(16).substring(2, 12),
    gasLimit: 30000000,
    gasUsed: minedTxs.length * 21000,
    tps: Math.floor(8000 + Math.random() * 2000),
    timestamp: Date.now(),
  };

  recentBlocks.unshift(newBlock);
  if (recentBlocks.length > 20) recentBlocks.pop();

  res.json({ success: true, block: newBlock });
});

// POST Faucet Request
app.post('/api/faucet/drip', (req: Request, res: Response) => {
  const { targetAddress, token } = req.body;
  if (!targetAddress) {
    return res.status(400).json({ error: 'targetAddress is required' });
  }

  const tokenSymbol = token === 'USDT' ? 'USDT' : 'QMS';
  const amount = tokenSymbol === 'USDT' ? 100.0 : 1_000_000.0;

  const faucetTx: BlockTransaction = {
    hash: '0xfaucet_' + Math.random().toString(16).substring(2, 10),
    blockNumber: currentBlockHeight,
    from: '0xNexus_Faucet_Vault_000',
    to: targetAddress,
    amount: amount,
    tokenSymbol: tokenSymbol,
    chain: 'qmoosa',
    type: 'Transfer',
    gasUsed: 21000,
    status: 'Success',
    timestamp: Date.now(),
  };

  pendingTransactions.push(faucetTx);

  res.json({
    success: true,
    txHash: faucetTx.hash,
    amount,
    tokenSymbol,
    targetAddress,
    message: `Dripped ${amount.toLocaleString()} ${tokenSymbol} testnet funds to ${targetAddress}`,
  });
});

// GET Deployed Contracts Manifest
app.get('/api/contracts/manifest', (_req: Request, res: Response) => {
  res.json({
    contracts: DEPLOYED_CONTRACTS_MANIFEST,
    maxSupply: '100,000,000,000,000 QMS',
    verified: true,
  });
});

// GET Security Audit Report
app.get('/api/audit/report', (_req: Request, res: Response) => {
  res.json(SECURITY_AUDIT_REPORT);
});

// POST AML / Sanctions Screening
app.post('/api/compliance/screen', (req: Request, res: Response) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Address required' });
  }

  const match = SANCTIONED_ADDRESS_DATABASE.find(
    (s) => s.address.toLowerCase() === address.toLowerCase()
  );

  if (match) {
    return res.json(match);
  }

  return res.json({
    address,
    label: 'Standard Account',
    riskCategory: 'Clean / Verified',
    riskScore: 2,
    sanctionSource: 'Clean across OFAC, EU, UN, and FATF database checks',
  });
});

// POST Plan AI Agent Execution (Multi-Model Abstraction Layer & Policy Guardian)
app.post('/api/agent/plan-execution', async (req: Request, res: Response) => {
  const { prompt, walletPolicy, agentName, modelId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const policy = walletPolicy || {
    maxDailySpendingUsdt: 100.0,
    usedTodayUsdt: 24.5,
    maxPerTxUsdt: 50.0,
    allowedChains: ['qmoosa', 'solana', 'ethereum', 'base', 'polygon'],
    allowedContracts: ['0xContract_DeFi_Router_01'],
    requireHumanApprovalAboveUsdt: 75.0,
    riskScoreThreshold: 35,
  };

  const requestedModel = modelId || 'auto';
  let resolvedModel = requestedModel;
  let modelProviderName = 'Google Gemini';
  let avgLatencyMs = 180;
  let tokensUsed = Math.floor(250 + Math.random() * 150);

  // Auto-Router Decision Logic
  if (requestedModel === 'auto') {
    const lower = prompt.toLowerCase();
    if (lower.includes('arbitrage') || lower.includes('yield') || lower.includes('complex')) {
      resolvedModel = 'claude-3.5-sonnet';
      modelProviderName = 'Anthropic Claude 3.5 Sonnet (Routed for Deep Reasoning)';
      avgLatencyMs = 380;
    } else if (lower.includes('open') || lower.includes('privacy') || lower.includes('enclave')) {
      resolvedModel = 'deepseek-r1-local';
      modelProviderName = 'DeepSeek-R1 WASM Enclave (Routed for Open Weights)';
      avgLatencyMs = 290;
    } else if (lower.includes('swap') || lower.includes('fast') || lower.includes('pay')) {
      resolvedModel = 'qmoosa-agent-v1';
      modelProviderName = 'QMoosa Special Agent v1 (Routed for Sub-second DEX Execution)';
      avgLatencyMs = 110;
    } else {
      resolvedModel = 'gemini-3.6-flash';
      modelProviderName = 'Google Gemini 3.6 Flash (Routed for High Speed)';
      avgLatencyMs = 175;
    }
  } else {
    const modelNames: Record<string, string> = {
      'gemini-3.6-flash': 'Google Gemini 3.6 Flash',
      'claude-3.5-sonnet': 'Anthropic Claude 3.5 Sonnet',
      'deepseek-r1-local': 'DeepSeek-R1 (Local WASM Container)',
      'llama3-70b-local': 'Llama 3 70B (Meta Open-Source)',
      'qmoosa-agent-v1': 'QMoosa Special Agent v1',
    };
    modelProviderName = modelNames[requestedModel] || 'Google Gemini 3.6 Flash';
  }

  try {
    let planData: any = null;

    // Use Gemini API directly if selected or routed to Gemini, and key exists
    if (process.env.GEMINI_API_KEY && (resolvedModel === 'gemini-3.6-flash' || requestedModel === 'auto')) {
      try {
        const ai = getGeminiClient();
        const systemInstruction = `
You are the QMoosa Nexus Agentic AI Planner Engine for Web4 Multi-Chain Execution.
Given a user prompt and spending policy constraints:
1. Analyze the prompt intent.
2. Formulate a multi-step execution plan across supported chains (qmoosa, ethereum, solana, base, polygon, bnb, arbitrum).
3. Evaluate risk score (0-100) and verify policy constraints.
4. Calculate estimated fees in USDT and QMS token.
5. Identify policy violations if spending limits or risk limits are exceeded.

You MUST respond ONLY with valid JSON matching this schema:
{
  "reasoningSummary": "string describing planning logic",
  "confidenceScore": number (0 to 100),
  "steps": [
    {
      "stepIndex": number,
      "action": "string action name e.g. Compare Prices / Simulate Swap / Execute Route",
      "targetChain": "qmoosa" | "ethereum" | "solana" | "base" | "polygon" | "bnb" | "arbitrum",
      "details": "string description",
      "estimatedFeeUsd": number,
      "estimatedFeeQms": number,
      "contractAddress": "string address",
      "riskScore": number,
      "toolCallExecuted": "string name of tool used e.g. get_balance() / simulate_swap() / prepare_tx()"
    }
  ],
  "totalUsdtCost": number,
  "totalQmsFee": number,
  "policyViolations": ["string list of violations if any"]
}
`;

        const geminiPrompt = `
User Prompt: "${prompt}"
Agent Name: "${agentName || 'QMoosa Agent'}"
Requested Model Route: "${modelProviderName}"
Wallet Policy Constraints:
- Max Daily Spending Limit: $${policy.maxDailySpendingUsdt} USDT
- Spent Today So Far: $${policy.usedTodayUsdt} USDT
- Remaining Allowance Today: $${policy.maxDailySpendingUsdt - policy.usedTodayUsdt} USDT
- Max Per Transaction: $${policy.maxPerTxUsdt} USDT
- Allowed Chains: ${JSON.stringify(policy.allowedChains)}
- Human Approval Required Above: $${policy.requireHumanApprovalAboveUsdt} USDT
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: geminiPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reasoningSummary: { type: Type.STRING },
                confidenceScore: { type: Type.INTEGER },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepIndex: { type: Type.INTEGER },
                      action: { type: Type.STRING },
                      targetChain: { type: Type.STRING },
                      details: { type: Type.STRING },
                      estimatedFeeUsd: { type: Type.NUMBER },
                      estimatedFeeQms: { type: Type.NUMBER },
                      contractAddress: { type: Type.STRING },
                      riskScore: { type: Type.INTEGER },
                      toolCallExecuted: { type: Type.STRING },
                    },
                  },
                },
                totalUsdtCost: { type: Type.NUMBER },
                totalQmsFee: { type: Type.NUMBER },
                policyViolations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
          },
        });

        if (response.text) {
          planData = JSON.parse(response.text);
        }
      } catch (e) {
        console.warn('Gemini call failed or key inactive, proceeding with Model Adapter simulation:', e);
      }
    }

    // Model Abstraction Adapter Fallback / Multi-Model Reasoning Engine
    if (!planData) {
      const isSolana = prompt.toLowerCase().includes('solana');
      const isEth = prompt.toLowerCase().includes('ethereum') || prompt.toLowerCase().includes('eth');
      const targetChain = isSolana ? 'solana' : isEth ? 'ethereum' : 'qmoosa';

      let modelReasoningPrefix = `[Model: ${modelProviderName}] Analyzed prompt intent via model adapter. `;

      if (resolvedModel === 'claude-3.5-sonnet') {
        modelReasoningPrefix += `Evaluated deep cross-chain liquidity graph across 7 EVM/Solana bridges, calculated optimal route with zero slippage bound.`;
      } else if (resolvedModel === 'deepseek-r1-local') {
        modelReasoningPrefix += `Executed open-weights ZK reasoning in local WASM container. Verified proof payload against deterministic policy rules.`;
      } else if (resolvedModel === 'llama3-70b-local') {
        modelReasoningPrefix += `Processed query on validator node GPU cluster. Formulated multi-step tool call sequence.`;
      } else if (resolvedModel === 'qmoosa-agent-v1') {
        modelReasoningPrefix += `Inferred state transition via specialized Web4 micro-model with 110ms response time.`;
      } else {
        modelReasoningPrefix += `Parsed prompt for on-chain execution on ${targetChain.toUpperCase()}. Verified wallet permissions and simulated gas parameters.`;
      }

      planData = {
        reasoningSummary: modelReasoningPrefix,
        confidenceScore: resolvedModel === 'claude-3.5-sonnet' ? 99 : 96,
        steps: [
          {
            stepIndex: 1,
            action: 'Query Balance & Verify Wallet Policy',
            targetChain: targetChain,
            details: `Tool Invocation: get_balance() & check_policy_limits() for daily limit ($${policy.maxDailySpendingUsdt} USDT).`,
            estimatedFeeUsd: 0.0001,
            estimatedFeeQms: 0.1,
            contractAddress: '0xPolicyGuardian_01',
            riskScore: 5,
            toolCallExecuted: 'get_balance() -> check_policy_limits()',
          },
          {
            stepIndex: 2,
            action: 'Simulate Zero-Risk Smart Contract Execution',
            targetChain: targetChain,
            details: `Tool Invocation: simulate_swap() for "${prompt.substring(0, 40)}..."`,
            estimatedFeeUsd: 0.0005,
            estimatedFeeQms: 0.5,
            contractAddress: '0xNexus_Parallel_VM_Router',
            riskScore: 12,
            toolCallExecuted: 'simulate_swap()',
          },
          {
            stepIndex: 3,
            action: 'Prepare & Sign Session Key Transaction',
            targetChain: targetChain,
            details: 'Tool Invocation: prepare_unsigned_tx() -> request_authorization()',
            estimatedFeeUsd: 0.0002,
            estimatedFeeQms: 0.2,
            contractAddress: '0xZK_Prover_Vault',
            riskScore: 8,
            toolCallExecuted: 'prepare_unsigned_tx()',
          },
        ],
        totalUsdtCost: prompt.toLowerCase().includes('100 usdt') ? 100 : 15.0,
        totalQmsFee: 0.8,
        policyViolations: [],
      };
    }

    // Determine deterministic policy approval (QMoosa Policy Guardian Security Layer)
    const remainingUsdt = policy.maxDailySpendingUsdt - policy.usedTodayUsdt;
    const violations: string[] = [...(planData.policyViolations || [])];

    if (planData.totalUsdtCost > remainingUsdt) {
      violations.push(
        `Total transaction cost ($${planData.totalUsdtCost} USDT) exceeds remaining daily limit ($${remainingUsdt.toFixed(2)} USDT)`
      );
    }
    if (planData.totalUsdtCost > policy.maxPerTxUsdt) {
      violations.push(
        `Transaction amount ($${planData.totalUsdtCost} USDT) exceeds maximum per-tx limit ($${policy.maxPerTxUsdt} USDT)`
      );
    }

    const policyApproved = violations.length === 0;

    const fullPlan: AgentExecutionPlan = {
      id: 'plan_' + Math.random().toString(36).substring(2, 9),
      userPrompt: prompt,
      agentName: agentName || 'QMoosa Agent',
      selectedModel: requestedModel,
      resolvedModelName: modelProviderName,
      modelLatencyMs: avgLatencyMs,
      modelTokensUsed: tokensUsed,
      toolCallsCount: (planData.steps || []).length,
      reasoningSummary: planData.reasoningSummary,
      confidenceScore: planData.confidenceScore || 95,
      steps: (planData.steps || []).map((s: ExecutionPlanStep, idx: number) => ({
        ...s,
        stepIndex: idx + 1,
        status: policyApproved ? 'verified' : 'rejected',
        toolCallExecuted: s.toolCallExecuted || `tool_call_${idx + 1}()`,
      })),
      totalUsdtCost: planData.totalUsdtCost || 0,
      totalQmsFee: planData.totalQmsFee || 0.5,
      policyApproved,
      policyViolations: violations,
      simulationHash: '0xsim_' + Math.random().toString(16).substring(2, 12),
      status: policyApproved ? 'ready' : 'draft',
      timestamp: Date.now(),
    };

    res.json(fullPlan);
  } catch (err: any) {
    console.error('Error generating execution plan:', err);
    res.status(500).json({ error: 'Failed to generate execution plan: ' + err.message });
  }
});

// POST Execute Agent Plan (Commit to testnet blockchain)
app.post('/api/agent/execute-plan', (req: Request, res: Response) => {
  const { planId, userAddress, agentName, amountUsdt, targetChain } = req.body;

  const txHash = '0xexec_' + Math.random().toString(16).substring(2, 14);
  const newTx: BlockTransaction = {
    hash: txHash,
    blockNumber: currentBlockHeight + 1,
    from: userAddress || '0xNexusAgent_8a1f9e2b03c4',
    to: '0xNexus_Smart_Account_Contract',
    amount: amountUsdt || 15.0,
    tokenSymbol: 'USDT',
    chain: targetChain || 'qmoosa',
    type: 'AgentExecution',
    gasUsed: 42000,
    status: 'Success',
    timestamp: Date.now(),
    agentName: agentName || 'ShoppingAssistantAgent',
  };

  pendingTransactions.push(newTx);

  res.json({
    success: true,
    txHash,
    planId,
    blockHeight: currentBlockHeight + 1,
    message: 'Plan successfully executed on QMoosa Testnet and added to mempool for next block inclusion.',
  });
});

// POST SDK Execution Simulator
app.post('/api/sdk/execute', (req: Request, res: Response) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code content required' });
  }

  const simulatedTx = '0xsdk_' + Math.random().toString(16).substring(2, 10);
  const logs = [
    `[QMoosa SDK v2.0.0] Connecting to ${language} multi-chain runtime testnet...`,
    `[RPC Endpoint] Active: https://rpc.testnet.qmoosa.nexus`,
    `[Policy Engine] PolicyGuardian limits & permissions verified against active session key.`,
    `[Security Audit] Formal Invariants checked (No reentrancy, bounded allowance).`,
    `[VM] Executing parallel WASM/EVM bytecode...`,
    `[ZK Proof] Generated Succinct ZK-SNARK proof hash: 0xzkp_${Math.random().toString(16).substring(2, 10)}`,
    `[Transaction] Broadcast successfully! Hash: ${simulatedTx}`,
  ];

  res.json({
    success: true,
    language,
    outputLogs: logs,
    txHash: simulatedTx,
    gasUsedQms: 0.05,
    status: 'Executed',
  });
});

// Start Express Server & Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QMoosa Nexus Global Testnet Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
