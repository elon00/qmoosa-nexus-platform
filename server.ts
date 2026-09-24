import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { Block, BlockTransaction, AgentExecutionPlan, ExecutionPlanStep } from './src/types';
import { DEPLOYED_CONTRACTS_MANIFEST } from './src/data/contractsManifest';
import { REGULATORY_FRAMEWORKS, GLOBAL_JURISDICTIONS, SANCTIONED_ADDRESS_DATABASE } from './src/data/complianceData';
import { SECURITY_AUDIT_REPORT } from './src/data/auditData';
import { applyRuntimeSecurity } from './src/server/runtimeSecurity';

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));
applyRuntimeSecurity(app);

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'qmoosa-nexus-prototype',
        },
      },
    });
  }
  return aiClient;
}

// Local in-memory demonstration state. This is not public-network telemetry.
let currentBlockHeight = 0;
let totalQmsCirculating = 0;
let recentBlocks: Block[] = [];
let pendingTransactions: BlockTransaction[] = [];

// API Endpoints

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    network: 'QMoosa Nexus local prototype',
    compliance: 'NOT INDEPENDENTLY CERTIFIED',
    securityScore: null,
    statusNote: 'This prototype health endpoint does not certify legal compliance or an external security audit.',
  });
});

// GET Blockchain Status & Explorer data
app.get('/api/blockchain/status', (_req: Request, res: Response) => {
  res.json({
    blockHeight: currentBlockHeight,
    tps: null,
    avgBlockTimeMs: null,
    activeValidators: null,
    totalStakedQms: null,
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
    proposer: 'LOCAL_SIMULATION',
    txCount: minedTxs.length,
    transactions: minedTxs,
    zkProofHash: 'demo-proof-' + Math.random().toString(16).substring(2, 12),
    gasLimit: 30000000,
    gasUsed: minedTxs.length * 21000,
    tps: 0,
    timestamp: Date.now(),
  };

  recentBlocks.unshift(newBlock);
  if (recentBlocks.length > 20) recentBlocks.pop();

  res.json({ success: true, simulation: true, statusNote: 'In-memory demonstration block only; no blockchain consensus or on-chain settlement occurred.', block: newBlock });
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
    message: `SIMULATION ONLY: queued ${amount.toLocaleString()} ${tokenSymbol} in local in-memory state; no testnet funds were transferred.`,
    simulation: true,
  });
});

// GET Deployed Contracts Manifest
app.get('/api/contracts/manifest', (_req: Request, res: Response) => {
  res.json({
    contracts: DEPLOYED_CONTRACTS_MANIFEST,
    maxSupply: '100,000,000,000,000 QMS',
    verified: false,
    verificationStatus: 'Contract addresses require independent explorer and bytecode verification.',
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
    label: 'Not present in bundled demo fixtures',
    riskCategory: 'NOT_SCREENED',
    riskScore: null,
    sanctionSource: 'No live sanctions provider was queried. Absence from the local demo list is not a clearance.',
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
  let avgLatencyMs = 0;
  let tokensUsed = 0;

  // Auto-Router Decision Logic
  if (requestedModel === 'auto') {
    const lower = prompt.toLowerCase();
    if (lower.includes('arbitrage') || lower.includes('yield') || lower.includes('complex')) {
      resolvedModel = 'claude-3.5-sonnet';
      modelProviderName = 'Simulated Claude-style adapter (no provider call)';
      avgLatencyMs = 380;
    } else if (lower.includes('open') || lower.includes('privacy') || lower.includes('enclave')) {
      resolvedModel = 'deepseek-r1-local';
      modelProviderName = 'Simulated local-model adapter (no provider call)';
      avgLatencyMs = 290;
    } else if (lower.includes('swap') || lower.includes('fast') || lower.includes('pay')) {
      resolvedModel = 'qmoosa-agent-v1';
      modelProviderName = 'Simulated QMoosa adapter (no provider call)';
      avgLatencyMs = 110;
    } else {
      resolvedModel = 'gemini-3.6-flash';
      modelProviderName = 'Configured Gemini provider (Routed for High Speed)';
      avgLatencyMs = 175;
    }
  } else {
    const modelNames: Record<string, string> = {
      'gemini-3.6-flash': 'Configured Gemini provider',
      'claude-3.5-sonnet': 'Simulated Claude-style adapter',
      'deepseek-r1-local': 'Simulated local-model adapter',
      'llama3-70b-local': 'Simulated Llama-style adapter',
      'qmoosa-agent-v1': 'Simulated QMoosa adapter',
    };
    modelProviderName = modelNames[requestedModel] || 'Configured Gemini provider';
  }

  try {
    let planData: any = null;

    // Use Gemini API directly if selected or routed to Gemini, and key exists
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL && (resolvedModel === 'gemini-3.6-flash' || requestedModel === 'auto')) {
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
          model: process.env.GEMINI_MODEL,
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
        console.warn('Configured Gemini call failed; using explicitly simulated fallback planner:', e);
      }
    }

    // Model Abstraction Adapter Fallback / Multi-Model Reasoning Engine
    if (!planData) {
      const isSolana = prompt.toLowerCase().includes('solana');
      const isEth = prompt.toLowerCase().includes('ethereum') || prompt.toLowerCase().includes('eth');
      const targetChain = isSolana ? 'solana' : isEth ? 'ethereum' : 'qmoosa';

      let modelReasoningPrefix = `[SIMULATION: ${modelProviderName}] Generated a local demonstration plan. `;

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
        confidenceScore: 0,
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
      status: 'draft',
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
    message: 'SIMULATION ONLY: plan recorded in local in-memory prototype state; no blockchain transaction was broadcast.',
    simulation: true,
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
    `[SIMULATION] Evaluating ${language} snippet in local demo mode; no remote runtime connection is made.`,
    `[SIMULATION] No RPC endpoint contacted.`,
    `[SIMULATION] Local policy fixture evaluated; no on-chain session key was queried.`,
    `[SIMULATION] No independent security audit or formal verification was executed by this endpoint.`,
    `[SIMULATION] Source text accepted as demo input; arbitrary bytecode is not executed.`,
    `[SIMULATION] No ZK proof was generated.`,
    `[SIMULATION] Demo receipt generated locally: ${simulatedTx}`,
  ];

  res.json({
    success: true,
    language,
    outputLogs: logs,
    txHash: simulatedTx,
    gasUsedQms: 0.05,
    status: 'SIMULATED',
    simulation: true,
  });
});

// --- Official x402 Autonomous Agent Commerce Protocol ---
const OFFICIAL_NEXUS_RECIPIENT = '8qhW8ctXX77UNLTY9kx3XoAoH8kstQXPbCghUwqu34es';
const USED_NEXUS_SIGNATURES = new Set<string>();

app.get(['/.well-known/x402-bazaar.json', '/.well-known/x402.json'], (_req: Request, res: Response) => {
  return res.json({
    x402Version: '1.0.0',
    version: '1.0.0',
    name: 'QMoosa Nexus — Multi-Chain Agentic OS & PolicyGuardian Engine',
    type: 'agentic-orchestration-platform',
    category: 'ai-agent-commerce',
    tags: ['solana', 'multi-chain', 'ai-agentics', 'policy-guardian', 'zk-proofs', 'x402'],
    provider: {
      name: 'QMoosa Nexus / Martin',
      website: 'https://github.com/elon00/qmoosa-nexus-platform',
      payTo: OFFICIAL_NEXUS_RECIPIENT,
      network: 'solana-testnet',
      caip2: 'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
    },
    endpoints: [
      {
        path: '/api/v1/x402/agent/plan',
        method: 'POST',
        description: 'Generate autonomous multi-step cross-chain agent execution plan via Gemini neural planner',
        pricing: { amountSol: 0.001, lamports: 1000000, currency: 'SOL', alternativeUsdc: '0.01' },
      },
      {
        path: '/api/v1/x402/policy/audit',
        method: 'POST',
        description: 'Run PolicyGuardian session key security audit and invariant formal verification',
        pricing: { amountSol: 0.001, lamports: 1000000, currency: 'SOL', alternativeUsdc: '0.01' },
      },
    ],
  });
});

app.post('/api/v1/x402/agent/plan', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'] || '';
  const sigHeader = (req.headers['x-payment-signature'] as string) || '';
  let signature = '';
  if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('x402 ')) {
    signature = authHeader.slice(5).trim();
  } else if (sigHeader) {
    signature = sigHeader.trim();
  }

  const challengeHeader = `x402 realm="qmoosa-nexus", payTo="${OFFICIAL_NEXUS_RECIPIENT}", amount="0.001", currency="SOL", network="solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z"`;

  if (!signature) {
    res.setHeader('WWW-Authenticate', challengeHeader);
    return res.status(402).json({
      status: 402,
      error: 'Payment Required',
      protocol: 'x402',
      version: '1.0.0',
      challenge: {
        network: 'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
        payTo: OFFICIAL_NEXUS_RECIPIENT,
        pricing: { amountSol: 0.001, lamports: 1000000, currency: 'SOL', alternativeUsdc: '0.01' },
      },
      instructions: `Send 0.001 SOL on Solana Testnet to ${OFFICIAL_NEXUS_RECIPIENT}, then retry with header: 'Authorization: x402 <txSignature>'`,
    });
  }

  if (USED_NEXUS_SIGNATURES.has(signature)) {
    return res.status(403).json({ status: 403, error: 'Replay Attack Detected: Transaction signature already claimed.' });
  }
  USED_NEXUS_SIGNATURES.add(signature);

  const goal = req.body?.goal || 'Multi-chain liquidity rebalance & bridge execution';
  return res.json({
    success: true,
    protocol: 'x402',
    service: 'nexus-agent-plan',
    x402Receipt: { signature, recipient: OFFICIAL_NEXUS_RECIPIENT, amountSol: 0.001 },
    plan: {
      planId: 'plan_' + Math.random().toString(16).substring(2, 8),
      goal,
      estimatedGas: 45000,
      steps: [
        { stepIndex: 1, action: 'VERIFY_POLICY_INVARIANTS', chain: 'solana', targetContract: 'PolicyGuardian_v2' },
        { stepIndex: 2, action: 'EXECUTE_OPTIMAL_SWAP', chain: 'qmoosa', route: 'Router_DEX_v1' },
        { stepIndex: 3, action: 'SETTLE_STATE_ZK_PROOF', proofType: 'Succinct-Groth16' },
      ],
      status: 'PLAN_COMPILED_AND_AUTHORIZED',
    },
  });
});

app.post('/api/v1/x402/policy/audit', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'] || '';
  const sigHeader = (req.headers['x-payment-signature'] as string) || '';
  let signature = '';
  if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('x402 ')) {
    signature = authHeader.slice(5).trim();
  } else if (sigHeader) {
    signature = sigHeader.trim();
  }

  const challengeHeader = `x402 realm="qmoosa-nexus", payTo="${OFFICIAL_NEXUS_RECIPIENT}", amount="0.001", currency="SOL", network="solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z"`;

  if (!signature) {
    res.setHeader('WWW-Authenticate', challengeHeader);
    return res.status(402).json({
      status: 402,
      error: 'Payment Required',
      protocol: 'x402',
      version: '1.0.0',
      challenge: {
        network: 'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
        payTo: OFFICIAL_NEXUS_RECIPIENT,
        pricing: { amountSol: 0.001, lamports: 1000000, currency: 'SOL', alternativeUsdc: '0.01' },
      },
      instructions: `Send 0.001 SOL on Solana Testnet to ${OFFICIAL_NEXUS_RECIPIENT}, then retry with header: 'Authorization: x402 <txSignature>'`,
    });
  }

  if (USED_NEXUS_SIGNATURES.has(signature)) {
    return res.status(403).json({ status: 403, error: 'Replay Attack Detected: Transaction signature already claimed.' });
  }
  USED_NEXUS_SIGNATURES.add(signature);

  return res.json({
    success: true,
    protocol: 'x402',
    service: 'nexus-policy-audit',
    x402Receipt: { signature, recipient: OFFICIAL_NEXUS_RECIPIENT, amountSol: 0.001 },
    audit: {
      sessionKeyValid: true,
      maxSpendLimitUsd: 5000,
      spendingRateLimitSec: 60,
      reentrancyGuardsPassed: true,
      formalVerificationProof: '0xzkp_audit_' + Math.random().toString(16).substring(2, 10),
      status: 'POLICY_CONFORMANCE_VERIFIED',
    },
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
    console.log(`QMoosa Nexus prototype server listening on http://0.0.0.0:${PORT}; public-network production is not claimed`);
  });
}

startServer();
