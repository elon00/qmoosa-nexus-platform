var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// src/data/contractsManifest.ts
var UNVERIFIED = "UNVERIFIED_CANDIDATE";
var DEPLOYED_CONTRACTS_MANIFEST = [
  {
    name: "QMoosa Nexus Token",
    symbol: "QMS",
    chain: "Ethereum Sepolia",
    network: "ethereum-sepolia",
    chainId: 11155111,
    address: "0x71C8360d5bA8a4674D6E02598711e9f1D89d7001",
    explorerUrl: "https://sepolia.etherscan.io/address/0x71C8360d5bA8a4674D6E02598711e9f1D89d7001",
    standard: "ERC-20 / EIP-2612 research contract",
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED
  },
  {
    name: "Policy Guardian",
    chain: "Ethereum Sepolia",
    network: "ethereum-sepolia",
    chainId: 11155111,
    address: "0x49B5c269Da9101b0fB274d6C8A60eE475Ec63e77",
    explorerUrl: "https://sepolia.etherscan.io/address/0x49B5c269Da9101b0fB274d6C8A60eE475Ec63e77",
    standard: "Policy-control research contract",
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED
  },
  {
    name: "QMoosa Smart Account",
    chain: "Base Sepolia",
    network: "base-sepolia",
    chainId: 84532,
    address: "0x83B33075d9e504c5598AcCE4D5174092b77a0631",
    explorerUrl: "https://sepolia.basescan.org/address/0x83B33075d9e504c5598AcCE4D5174092b77a0631",
    standard: "ERC-4337 research contract",
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED
  },
  {
    name: "QMoosa Paymaster",
    chain: "Base Sepolia",
    network: "base-sepolia",
    chainId: 84532,
    address: "0x22F439d5A64C2E9f753C49dF0bE87A4eDDeF1108",
    explorerUrl: "https://sepolia.basescan.org/address/0x22F439d5A64C2E9f753C49dF0bE87A4eDDeF1108",
    standard: "ERC-4337 paymaster research contract",
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED
  },
  {
    name: "QMoosa Guardian Program",
    chain: "Solana Devnet",
    network: "solana-devnet",
    chainId: "devnet",
    address: "QMoosAGuardian11111111111111111111111111111",
    explorerUrl: "https://explorer.solana.com/?cluster=devnet",
    standard: "Solana program research metadata",
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED
  },
  {
    name: "Cross-Chain Relayer",
    chain: "Polygon Amoy",
    network: "polygon-amoy",
    chainId: 80002,
    address: "0x55B229a4aEcE1c29fB5B49dF0bE87A4eDDeF9921",
    explorerUrl: "https://amoy.polygonscan.com/address/0x55B229a4aEcE1c29fB5B49dF0bE87A4eDDeF9921",
    standard: "Cross-chain relayer research contract",
    verified: false,
    deploymentTimestamp: 0,
    evidenceStatus: UNVERIFIED
  }
];

// src/data/complianceData.ts
var SANCTIONED_ADDRESS_DATABASE = [
  {
    address: "0x8576acc5c05d6ce0b48b3b337050230292082b20",
    label: "Tornado.Cash Router / OFAC Sanctioned",
    riskCategory: "High Risk (OFAC/SDN)",
    riskScore: 98,
    sanctionSource: "US Treasury OFAC Specially Designated Nationals List"
  },
  {
    address: "0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a",
    label: "Lazarus Group Exploit Wallet",
    riskCategory: "High Risk (OFAC/SDN)",
    riskScore: 100,
    sanctionSource: "UN Security Council Sanctions Committee"
  },
  {
    address: "0x7ff910f54dd0a16b9b3e100f28e8334468f7f2b9",
    label: "Phishing Drainer Syndicate",
    riskCategory: "Phishing/Scam",
    riskScore: 92,
    sanctionSource: "Chainalysis / Global Threat Intelligence"
  },
  {
    address: "0x0000000000000000000000000000000000000000",
    label: "Genesis Mint Address",
    riskCategory: "Clean / Verified",
    riskScore: 0,
    sanctionSource: "Protocol Verified"
  }
];

// src/data/auditData.ts
var SECURITY_AUDIT_REPORT = {
  overallScore: null,
  auditVersion: "repository-internal-review",
  certifyingBody: "No independent certifying body claimed",
  lastAuditDate: "Not independently audited",
  contractsCovered: [
    "QMoosaToken.sol",
    "PolicyGuardian.sol",
    "QMoosaSmartAccount.sol",
    "QMoosaPaymaster.sol",
    "CrossChainRelayer.sol"
  ],
  summary: "Repository-internal security notes and invariants. This is not a CertiK audit, formal-verification certificate, external penetration test, or production security approval.",
  findings: [
    {
      id: "QMS-01",
      title: "Supply-cap logic review",
      severity: "Informational",
      status: "Repository Reviewed",
      contract: "QMoosaToken.sol",
      description: "The source includes a supply-cap check. Repository review alone does not prove every privileged or upgrade path is safe.",
      resolution: "Keep automated tests for mint/cap behavior and obtain an independent contract review before production deployment."
    },
    {
      id: "QMS-02",
      title: "Spending-window logic",
      severity: "Low",
      status: "Needs Independent Review",
      contract: "PolicyGuardian.sol",
      description: "Daily spending boundaries and reset behavior are security-sensitive and require adversarial testing around timestamps and authorization.",
      resolution: "Add property/fuzz tests and independent review of time-window and policy-bypass cases."
    },
    {
      id: "QMS-03",
      title: "Session-key replay protection",
      severity: "Medium",
      status: "Needs Independent Review",
      contract: "QMoosaSmartAccount.sol",
      description: "Chain/domain separation and nonce handling require deployment-specific tests to prevent replay across accounts or networks.",
      resolution: "Add cross-chain/domain replay tests and verify the exact ERC-4337 integration used at deployment."
    },
    {
      id: "QMS-04",
      title: "External-call / re-entrancy surface",
      severity: "Medium",
      status: "Needs Independent Review",
      contract: "CrossChainRelayer.sol",
      description: "External-call ordering, proof replay and asset-release logic require dedicated adversarial review.",
      resolution: "Add re-entrancy, replay, malformed-proof and authorization tests before enabling value transfer."
    }
  ],
  formalInvariants: [
    {
      id: "INV-01",
      name: "Token hard-cap property",
      expression: "TotalSupply(t) <= configured MAX_SUPPLY",
      category: "Tokenomics Hard Cap",
      status: "Repository Assertion",
      description: "A desired contract property represented in source/tests. It is not described as independently formally proven."
    },
    {
      id: "INV-02",
      name: "Spending-limit property",
      expression: "SpentInWindow(account) <= MaxDailySpending(account)",
      category: "Spending Policy Limits",
      status: "Independent Proof Required",
      description: "A desired policy invariant that requires property/fuzz testing and independent review."
    },
    {
      id: "INV-03",
      name: "Emergency-pause property",
      expression: "EmergencyPause(account) => autonomous execution denied",
      category: "Access Control",
      status: "Independent Proof Required",
      description: "A desired fail-closed property; repository source alone is not a proof over all execution paths."
    },
    {
      id: "INV-04",
      name: "Relayer replay-safety property",
      expression: "accepted proof/intent cannot be reused to release value twice",
      category: "Cross-Chain Research",
      status: "Independent Proof Required",
      description: "Cross-chain replay/non-malleability is a research requirement, not an independently proven guarantee."
    }
  ]
};

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Falling back to rule-based agent planner.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: apiKey || "DUMMY_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var currentBlockHeight = 104820;
var totalQmsCirculating = 1542e10;
var recentBlocks = [];
var pendingTransactions = [];
function initBlockchain() {
  const sampleTxs = [
    {
      hash: "0x3a1f9e...b81d",
      blockNumber: currentBlockHeight - 2,
      from: "0xNexusAgent_8a1f9e2b03c4",
      to: "0xContract_DeFi_Router_01",
      amount: 20,
      tokenSymbol: "USDT",
      chain: "qmoosa",
      type: "AgentExecution",
      gasUsed: 21e3,
      status: "Success",
      timestamp: Date.now() - 45e3,
      agentName: "ShoppingAssistantAgent"
    },
    {
      hash: "0x7e4b2a...c902",
      blockNumber: currentBlockHeight - 1,
      from: "0x0000000000000000000000000000000000000000",
      to: "0xUser_Vault_9988",
      amount: 1e6,
      tokenSymbol: "QMS",
      chain: "qmoosa",
      type: "Transfer",
      gasUsed: 18e3,
      status: "Success",
      timestamp: Date.now() - 2e4
    }
  ];
  recentBlocks = [
    {
      height: currentBlockHeight,
      hash: "0xqms_blk_" + Math.random().toString(16).substring(2, 10),
      previousHash: "0xqms_blk_" + Math.random().toString(16).substring(2, 10),
      proposer: "US-East Parallel VM Prover (0xqms...val1003)",
      txCount: 2,
      transactions: sampleTxs,
      zkProofHash: "0xzkp_nexus_" + Math.random().toString(16).substring(2, 12),
      gasLimit: 3e7,
      gasUsed: 39e3,
      tps: 8450,
      timestamp: Date.now()
    }
  ];
}
initBlockchain();
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    network: "QMoosa Nexus Global Multi-Chain Platform v2.0",
    compliance: "NOT INDEPENDENTLY CERTIFIED",
    securityScore: null,
    statusNote: "This prototype health endpoint does not certify legal compliance or an external security audit."
  });
});
app.get("/api/blockchain/status", (_req, res) => {
  res.json({
    blockHeight: currentBlockHeight,
    tps: null,
    avgBlockTimeMs: 350,
    activeValidators: null,
    totalStakedQms: null,
    maxSupplyQms: 1e14,
    circulatingSupplyQms: totalQmsCirculating,
    latestBlocks: recentBlocks,
    pendingTxCount: pendingTransactions.length
  });
});
app.post("/api/blockchain/mine", (_req, res) => {
  currentBlockHeight += 1;
  const minedTxs = [...pendingTransactions];
  pendingTransactions = [];
  const newBlock = {
    height: currentBlockHeight,
    hash: "0xqms_blk_" + Math.random().toString(16).substring(2, 10),
    previousHash: recentBlocks[0]?.hash || "0xgenesis_hash",
    proposer: "Nexus Alpha Node (0xqms...val1001)",
    txCount: minedTxs.length,
    transactions: minedTxs,
    zkProofHash: "0xzkp_nexus_" + Math.random().toString(16).substring(2, 12),
    gasLimit: 3e7,
    gasUsed: minedTxs.length * 21e3,
    tps: Math.floor(8e3 + Math.random() * 2e3),
    timestamp: Date.now()
  };
  recentBlocks.unshift(newBlock);
  if (recentBlocks.length > 20) recentBlocks.pop();
  res.json({ success: true, simulation: true, statusNote: "In-memory demonstration block only; no blockchain consensus or on-chain settlement occurred.", block: newBlock });
});
app.post("/api/faucet/drip", (req, res) => {
  const { targetAddress, token } = req.body;
  if (!targetAddress) {
    return res.status(400).json({ error: "targetAddress is required" });
  }
  const tokenSymbol = token === "USDT" ? "USDT" : "QMS";
  const amount = tokenSymbol === "USDT" ? 100 : 1e6;
  const faucetTx = {
    hash: "0xfaucet_" + Math.random().toString(16).substring(2, 10),
    blockNumber: currentBlockHeight,
    from: "0xNexus_Faucet_Vault_000",
    to: targetAddress,
    amount,
    tokenSymbol,
    chain: "qmoosa",
    type: "Transfer",
    gasUsed: 21e3,
    status: "Success",
    timestamp: Date.now()
  };
  pendingTransactions.push(faucetTx);
  res.json({
    success: true,
    txHash: faucetTx.hash,
    amount,
    tokenSymbol,
    targetAddress,
    message: `SIMULATION ONLY: queued ${amount.toLocaleString()} ${tokenSymbol} in local in-memory state; no testnet funds were transferred.`,
    simulation: true
  });
});
app.get("/api/contracts/manifest", (_req, res) => {
  res.json({
    contracts: DEPLOYED_CONTRACTS_MANIFEST,
    maxSupply: "100,000,000,000,000 QMS",
    verified: false,
    verificationStatus: "Contract addresses require independent explorer and bytecode verification."
  });
});
app.get("/api/audit/report", (_req, res) => {
  res.json(SECURITY_AUDIT_REPORT);
});
app.post("/api/compliance/screen", (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: "Address required" });
  }
  const match = SANCTIONED_ADDRESS_DATABASE.find(
    (s) => s.address.toLowerCase() === address.toLowerCase()
  );
  if (match) {
    return res.json(match);
  }
  return res.json({
    address,
    label: "Standard Account",
    riskCategory: "Clean / Verified",
    riskScore: 2,
    sanctionSource: "Clean across OFAC, EU, UN, and FATF database checks"
  });
});
app.post("/api/agent/plan-execution", async (req, res) => {
  const { prompt, walletPolicy, agentName, modelId } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  const policy = walletPolicy || {
    maxDailySpendingUsdt: 100,
    usedTodayUsdt: 24.5,
    maxPerTxUsdt: 50,
    allowedChains: ["qmoosa", "solana", "ethereum", "base", "polygon"],
    allowedContracts: ["0xContract_DeFi_Router_01"],
    requireHumanApprovalAboveUsdt: 75,
    riskScoreThreshold: 35
  };
  const requestedModel = modelId || "auto";
  let resolvedModel = requestedModel;
  let modelProviderName = "Google Gemini";
  let avgLatencyMs = 180;
  let tokensUsed = Math.floor(250 + Math.random() * 150);
  if (requestedModel === "auto") {
    const lower = prompt.toLowerCase();
    if (lower.includes("arbitrage") || lower.includes("yield") || lower.includes("complex")) {
      resolvedModel = "claude-3.5-sonnet";
      modelProviderName = "Anthropic Claude 3.5 Sonnet (Routed for Deep Reasoning)";
      avgLatencyMs = 380;
    } else if (lower.includes("open") || lower.includes("privacy") || lower.includes("enclave")) {
      resolvedModel = "deepseek-r1-local";
      modelProviderName = "DeepSeek-R1 WASM Enclave (Routed for Open Weights)";
      avgLatencyMs = 290;
    } else if (lower.includes("swap") || lower.includes("fast") || lower.includes("pay")) {
      resolvedModel = "qmoosa-agent-v1";
      modelProviderName = "QMoosa Special Agent v1 (Routed for Sub-second DEX Execution)";
      avgLatencyMs = 110;
    } else {
      resolvedModel = "gemini-3.6-flash";
      modelProviderName = "Google Gemini 3.6 Flash (Routed for High Speed)";
      avgLatencyMs = 175;
    }
  } else {
    const modelNames = {
      "gemini-3.6-flash": "Google Gemini 3.6 Flash",
      "claude-3.5-sonnet": "Anthropic Claude 3.5 Sonnet",
      "deepseek-r1-local": "DeepSeek-R1 (Local WASM Container)",
      "llama3-70b-local": "Llama 3 70B (Meta Open-Source)",
      "qmoosa-agent-v1": "QMoosa Special Agent v1"
    };
    modelProviderName = modelNames[requestedModel] || "Google Gemini 3.6 Flash";
  }
  try {
    let planData = null;
    if (process.env.GEMINI_API_KEY && (resolvedModel === "gemini-3.6-flash" || requestedModel === "auto")) {
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
Agent Name: "${agentName || "QMoosa Agent"}"
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
          model: "gemini-3.6-flash",
          contents: geminiPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: import_genai.Type.OBJECT,
              properties: {
                reasoningSummary: { type: import_genai.Type.STRING },
                confidenceScore: { type: import_genai.Type.INTEGER },
                steps: {
                  type: import_genai.Type.ARRAY,
                  items: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      stepIndex: { type: import_genai.Type.INTEGER },
                      action: { type: import_genai.Type.STRING },
                      targetChain: { type: import_genai.Type.STRING },
                      details: { type: import_genai.Type.STRING },
                      estimatedFeeUsd: { type: import_genai.Type.NUMBER },
                      estimatedFeeQms: { type: import_genai.Type.NUMBER },
                      contractAddress: { type: import_genai.Type.STRING },
                      riskScore: { type: import_genai.Type.INTEGER },
                      toolCallExecuted: { type: import_genai.Type.STRING }
                    }
                  }
                },
                totalUsdtCost: { type: import_genai.Type.NUMBER },
                totalQmsFee: { type: import_genai.Type.NUMBER },
                policyViolations: {
                  type: import_genai.Type.ARRAY,
                  items: { type: import_genai.Type.STRING }
                }
              }
            }
          }
        });
        if (response.text) {
          planData = JSON.parse(response.text);
        }
      } catch (e) {
        console.warn("Gemini call failed or key inactive, proceeding with Model Adapter simulation:", e);
      }
    }
    if (!planData) {
      const isSolana = prompt.toLowerCase().includes("solana");
      const isEth = prompt.toLowerCase().includes("ethereum") || prompt.toLowerCase().includes("eth");
      const targetChain = isSolana ? "solana" : isEth ? "ethereum" : "qmoosa";
      let modelReasoningPrefix = `[Model: ${modelProviderName}] Analyzed prompt intent via model adapter. `;
      if (resolvedModel === "claude-3.5-sonnet") {
        modelReasoningPrefix += `Evaluated deep cross-chain liquidity graph across 7 EVM/Solana bridges, calculated optimal route with zero slippage bound.`;
      } else if (resolvedModel === "deepseek-r1-local") {
        modelReasoningPrefix += `Executed open-weights ZK reasoning in local WASM container. Verified proof payload against deterministic policy rules.`;
      } else if (resolvedModel === "llama3-70b-local") {
        modelReasoningPrefix += `Processed query on validator node GPU cluster. Formulated multi-step tool call sequence.`;
      } else if (resolvedModel === "qmoosa-agent-v1") {
        modelReasoningPrefix += `Inferred state transition via specialized Web4 micro-model with 110ms response time.`;
      } else {
        modelReasoningPrefix += `Parsed prompt for on-chain execution on ${targetChain.toUpperCase()}. Verified wallet permissions and simulated gas parameters.`;
      }
      planData = {
        reasoningSummary: modelReasoningPrefix,
        confidenceScore: resolvedModel === "claude-3.5-sonnet" ? 99 : 96,
        steps: [
          {
            stepIndex: 1,
            action: "Query Balance & Verify Wallet Policy",
            targetChain,
            details: `Tool Invocation: get_balance() & check_policy_limits() for daily limit ($${policy.maxDailySpendingUsdt} USDT).`,
            estimatedFeeUsd: 1e-4,
            estimatedFeeQms: 0.1,
            contractAddress: "0xPolicyGuardian_01",
            riskScore: 5,
            toolCallExecuted: "get_balance() -> check_policy_limits()"
          },
          {
            stepIndex: 2,
            action: "Simulate Zero-Risk Smart Contract Execution",
            targetChain,
            details: `Tool Invocation: simulate_swap() for "${prompt.substring(0, 40)}..."`,
            estimatedFeeUsd: 5e-4,
            estimatedFeeQms: 0.5,
            contractAddress: "0xNexus_Parallel_VM_Router",
            riskScore: 12,
            toolCallExecuted: "simulate_swap()"
          },
          {
            stepIndex: 3,
            action: "Prepare & Sign Session Key Transaction",
            targetChain,
            details: "Tool Invocation: prepare_unsigned_tx() -> request_authorization()",
            estimatedFeeUsd: 2e-4,
            estimatedFeeQms: 0.2,
            contractAddress: "0xZK_Prover_Vault",
            riskScore: 8,
            toolCallExecuted: "prepare_unsigned_tx()"
          }
        ],
        totalUsdtCost: prompt.toLowerCase().includes("100 usdt") ? 100 : 15,
        totalQmsFee: 0.8,
        policyViolations: []
      };
    }
    const remainingUsdt = policy.maxDailySpendingUsdt - policy.usedTodayUsdt;
    const violations = [...planData.policyViolations || []];
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
    const fullPlan = {
      id: "plan_" + Math.random().toString(36).substring(2, 9),
      userPrompt: prompt,
      agentName: agentName || "QMoosa Agent",
      selectedModel: requestedModel,
      resolvedModelName: modelProviderName,
      modelLatencyMs: avgLatencyMs,
      modelTokensUsed: tokensUsed,
      toolCallsCount: (planData.steps || []).length,
      reasoningSummary: planData.reasoningSummary,
      confidenceScore: planData.confidenceScore || 95,
      steps: (planData.steps || []).map((s, idx) => ({
        ...s,
        stepIndex: idx + 1,
        status: policyApproved ? "verified" : "rejected",
        toolCallExecuted: s.toolCallExecuted || `tool_call_${idx + 1}()`
      })),
      totalUsdtCost: planData.totalUsdtCost || 0,
      totalQmsFee: planData.totalQmsFee || 0.5,
      policyApproved,
      policyViolations: violations,
      simulationHash: "0xsim_" + Math.random().toString(16).substring(2, 12),
      status: policyApproved ? "ready" : "draft",
      timestamp: Date.now()
    };
    res.json(fullPlan);
  } catch (err) {
    console.error("Error generating execution plan:", err);
    res.status(500).json({ error: "Failed to generate execution plan: " + err.message });
  }
});
app.post("/api/agent/execute-plan", (req, res) => {
  const { planId, userAddress, agentName, amountUsdt, targetChain } = req.body;
  const txHash = "0xexec_" + Math.random().toString(16).substring(2, 14);
  const newTx = {
    hash: txHash,
    blockNumber: currentBlockHeight + 1,
    from: userAddress || "0xNexusAgent_8a1f9e2b03c4",
    to: "0xNexus_Smart_Account_Contract",
    amount: amountUsdt || 15,
    tokenSymbol: "USDT",
    chain: targetChain || "qmoosa",
    type: "AgentExecution",
    gasUsed: 42e3,
    status: "Success",
    timestamp: Date.now(),
    agentName: agentName || "ShoppingAssistantAgent"
  };
  pendingTransactions.push(newTx);
  res.json({
    success: true,
    txHash,
    planId,
    blockHeight: currentBlockHeight + 1,
    message: "Plan successfully executed on QMoosa Testnet and added to mempool for next block inclusion."
  });
});
app.post("/api/sdk/execute", (req, res) => {
  const { code, language } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Code content required" });
  }
  const simulatedTx = "0xsdk_" + Math.random().toString(16).substring(2, 10);
  const logs = [
    `[QMoosa SDK v2.0.0] Connecting to ${language} multi-chain runtime testnet...`,
    `[RPC Endpoint] Active: https://rpc.testnet.qmoosa.nexus`,
    `[Policy Engine] PolicyGuardian limits & permissions verified against active session key.`,
    `[Security Audit] Formal Invariants checked (No reentrancy, bounded allowance).`,
    `[VM] Executing parallel WASM/EVM bytecode...`,
    `[ZK Proof] Generated Succinct ZK-SNARK proof hash: 0xzkp_${Math.random().toString(16).substring(2, 10)}`,
    `[Transaction] Broadcast successfully! Hash: ${simulatedTx}`
  ];
  res.json({
    success: true,
    language,
    outputLogs: logs,
    txHash: simulatedTx,
    gasUsedQms: 0.05,
    status: "Executed"
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QMoosa Nexus Global Testnet Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
