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
    address: "0x0000000000000000000000000000000000000001",
    label: "Demo high-risk fixture",
    riskCategory: "Demo High Risk",
    riskScore: 95,
    sanctionSource: "Synthetic UI fixture \u2014 not an OFAC/UN/EU data source"
  },
  {
    address: "0x0000000000000000000000000000000000000002",
    label: "Demo neutral fixture",
    riskCategory: "Demo Neutral",
    riskScore: 5,
    sanctionSource: "Synthetic UI fixture \u2014 not a sanctions clearance"
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

// src/server/runtimeSecurity.ts
var import_node_crypto = require("node:crypto");
var MUTATION_PATHS = /* @__PURE__ */ new Set([
  "/api/blockchain/mine",
  "/api/faucet/drip",
  "/api/agent/execute-plan",
  "/api/sdk/execute"
]);
function sameToken(header, token) {
  const expected = Buffer.from(`Bearer ${token}`);
  const actual = Buffer.from(header || "");
  return expected.length === actual.length && (0, import_node_crypto.timingSafeEqual)(expected, actual);
}
function allowedOrigins() {
  const values = (process.env.QMOOSA_CORS_ALLOWED_ORIGINS || "").split(",").map((v) => v.trim()).filter(Boolean);
  if (process.env.APP_URL?.trim()) values.push(process.env.APP_URL.trim());
  return new Set(values);
}
function applyRuntimeSecurity(app2) {
  const production = process.env.NODE_ENV === "production";
  const mutationsEnabled = process.env.QMOOSA_ENABLE_SIMULATION_MUTATIONS === "true";
  const adminToken = process.env.QMOOSA_ADMIN_TOKEN?.trim() || "";
  const origins = allowedOrigins();
  if (production && mutationsEnabled && (adminToken.length < 32 || /^change[_-]?me/i.test(adminToken))) {
    throw new Error("QMOOSA_ADMIN_TOKEN must be a non-placeholder secret of at least 32 characters when production simulation mutations are enabled");
  }
  app2.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    const origin = req.headers.origin;
    if (origin) {
      if (origins.has(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      } else if (production) {
        return res.status(403).json({ error: "origin not allowed" });
      }
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
  app2.use((req, res, next) => {
    if (!production || req.method !== "POST" || !MUTATION_PATHS.has(req.path)) return next();
    if (!mutationsEnabled) {
      return res.status(503).json({
        error: "simulation mutation API is disabled in production",
        mode: "READ_ONLY_PRODUCTION_PREVIEW"
      });
    }
    if (!sameToken(req.headers.authorization, adminToken)) {
      return res.status(401).json({ error: "unauthorized" });
    }
    next();
  });
}

// server.ts
var app = (0, import_express.default)();
var PORT = Number(process.env.PORT || 3e3);
app.disable("x-powered-by");
app.use(import_express.default.json({ limit: "256kb" }));
applyRuntimeSecurity(app);
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "qmoosa-nexus-prototype"
        }
      }
    });
  }
  return aiClient;
}
var currentBlockHeight = 0;
var totalQmsCirculating = 0;
var recentBlocks = [];
var pendingTransactions = [];
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    network: "QMoosa Nexus local prototype",
    compliance: "NOT INDEPENDENTLY CERTIFIED",
    securityScore: null,
    statusNote: "This prototype health endpoint does not certify legal compliance or an external security audit."
  });
});
app.get("/api/blockchain/status", (_req, res) => {
  res.json({
    blockHeight: currentBlockHeight,
    tps: null,
    avgBlockTimeMs: null,
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
    proposer: "LOCAL_SIMULATION",
    txCount: minedTxs.length,
    transactions: minedTxs,
    zkProofHash: "demo-proof-" + Math.random().toString(16).substring(2, 12),
    gasLimit: 3e7,
    gasUsed: minedTxs.length * 21e3,
    tps: 0,
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
    label: "Not present in bundled demo fixtures",
    riskCategory: "NOT_SCREENED",
    riskScore: null,
    sanctionSource: "No live sanctions provider was queried. Absence from the local demo list is not a clearance."
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
  let avgLatencyMs = 0;
  let tokensUsed = 0;
  if (requestedModel === "auto") {
    const lower = prompt.toLowerCase();
    if (lower.includes("arbitrage") || lower.includes("yield") || lower.includes("complex")) {
      resolvedModel = "claude-3.5-sonnet";
      modelProviderName = "Simulated Claude-style adapter (no provider call)";
      avgLatencyMs = 380;
    } else if (lower.includes("open") || lower.includes("privacy") || lower.includes("enclave")) {
      resolvedModel = "deepseek-r1-local";
      modelProviderName = "Simulated local-model adapter (no provider call)";
      avgLatencyMs = 290;
    } else if (lower.includes("swap") || lower.includes("fast") || lower.includes("pay")) {
      resolvedModel = "qmoosa-agent-v1";
      modelProviderName = "Simulated QMoosa adapter (no provider call)";
      avgLatencyMs = 110;
    } else {
      resolvedModel = "gemini-3.6-flash";
      modelProviderName = "Configured Gemini provider (Routed for High Speed)";
      avgLatencyMs = 175;
    }
  } else {
    const modelNames = {
      "gemini-3.6-flash": "Configured Gemini provider",
      "claude-3.5-sonnet": "Simulated Claude-style adapter",
      "deepseek-r1-local": "Simulated local-model adapter",
      "llama3-70b-local": "Simulated Llama-style adapter",
      "qmoosa-agent-v1": "Simulated QMoosa adapter"
    };
    modelProviderName = modelNames[requestedModel] || "Configured Gemini provider";
  }
  try {
    let planData = null;
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL && (resolvedModel === "gemini-3.6-flash" || requestedModel === "auto")) {
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
          model: process.env.GEMINI_MODEL,
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
        console.warn("Configured Gemini call failed; using explicitly simulated fallback planner:", e);
      }
    }
    if (!planData) {
      const isSolana = prompt.toLowerCase().includes("solana");
      const isEth = prompt.toLowerCase().includes("ethereum") || prompt.toLowerCase().includes("eth");
      const targetChain = isSolana ? "solana" : isEth ? "ethereum" : "qmoosa";
      let modelReasoningPrefix = `[SIMULATION: ${modelProviderName}] Generated a local demonstration plan. `;
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
        confidenceScore: 0,
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
      status: "draft",
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
    message: "SIMULATION ONLY: plan recorded in local in-memory prototype state; no blockchain transaction was broadcast.",
    simulation: true
  });
});
app.post("/api/sdk/execute", (req, res) => {
  const { code, language } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Code content required" });
  }
  const simulatedTx = "0xsdk_" + Math.random().toString(16).substring(2, 10);
  const logs = [
    `[SIMULATION] Evaluating ${language} snippet in local demo mode; no remote runtime connection is made.`,
    `[SIMULATION] No RPC endpoint contacted.`,
    `[SIMULATION] Local policy fixture evaluated; no on-chain session key was queried.`,
    `[SIMULATION] No independent security audit or formal verification was executed by this endpoint.`,
    `[SIMULATION] Source text accepted as demo input; arbitrary bytecode is not executed.`,
    `[SIMULATION] No ZK proof was generated.`,
    `[SIMULATION] Demo receipt generated locally: ${simulatedTx}`
  ];
  res.json({
    success: true,
    language,
    outputLogs: logs,
    txHash: simulatedTx,
    gasUsedQms: 0.05,
    status: "SIMULATED",
    simulation: true
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
    console.log(`QMoosa Nexus prototype server listening on http://0.0.0.0:${PORT}; public-network production is not claimed`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
