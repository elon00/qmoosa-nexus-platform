import React, { useState } from 'react';
import { Cpu, Send, ShieldAlert, ShieldCheck, CheckCircle2, ArrowRight, Zap, Play, Lock, AlertCircle, RefreshCw, Layers, Sparkles, Server, Terminal } from 'lucide-react';
import { AgentExecutionPlan, AgentWallet, AIModelId } from '../types';
import { AI_MODELS } from '../data/genesis';

interface AgentStudioProps {
  activeWallet: AgentWallet;
  onExecuteTx: (plan: AgentExecutionPlan) => void;
}

export const AgentStudio: React.FC<AgentStudioProps> = ({ activeWallet, onExecuteTx }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModelId>('auto');
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<AgentExecutionPlan | null>(null);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedSuccessHash, setExecutedSuccessHash] = useState<string | null>(null);

  const samplePrompts = [
    'Find best USDT yield on Solana and allocate 20 USDT with max 0.1% slippage',
    'Execute cross-chain swap 50 USDT from Ethereum to QMoosa L1 with ZK proof',
    'Pay 15 USDT for cloud AI compute using Smart Account with spending limit check',
    'Deploy autonomous shopping agent with $100/day spending limit and auto-pause',
  ];

  const handleGeneratePlan = async (queryPrompt?: string) => {
    const promptToUse = queryPrompt || prompt;
    if (!promptToUse.trim()) return;

    setLoading(true);
    setExecutedSuccessHash(null);
    setExecutionLog([]);

    try {
      const response = await fetch('/api/agent/plan-execution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          walletPolicy: activeWallet.policy,
          agentName: activeWallet.name,
          modelId: selectedModel,
        }),
      });

      const plan: AgentExecutionPlan = await response.json();
      setCurrentPlan(plan);
    } catch (err) {
      console.error('Failed to plan execution:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndExecute = async () => {
    if (!currentPlan || !currentPlan.policyApproved) return;

    setIsExecuting(true);
    setExecutionLog([
      ` [${currentPlan.resolvedModelName}] Outputted structured tool call plan...`,
      ' [Policy Guardian] Verifying daily spending limit remaining ($' +
        (activeWallet.policy.maxDailySpendingUsdt - activeWallet.policy.usedTodayUsdt).toFixed(2) +
        ' USDT)...',
      ' [Parallel VM] Simulating state transitions across ' + currentPlan.steps.length + ' execution steps...',
      ' [ZK Prover] Generating Succinct Proof hash...',
      ' [Network] Committing payload to QMoosa Testnet mempool...',
    ]);

    try {
      const targetStep = currentPlan.steps[0];
      const res = await fetch('/api/agent/execute-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: currentPlan.id,
          userAddress: activeWallet.address,
          agentName: activeWallet.name,
          amountUsdt: currentPlan.totalUsdtCost,
          targetChain: targetStep?.targetChain || 'qmoosa',
        }),
      });

      const data = await res.json();
      setTimeout(() => {
        setIsExecuting(false);
        setExecutedSuccessHash(data.txHash);
        onExecuteTx(currentPlan);
      }, 1500);
    } catch (err) {
      console.error('Execution failed:', err);
      setIsExecuting(false);
    }
  };

  const remainingDailyUsdt = activeWallet.policy.maxDailySpendingUsdt - activeWallet.policy.usedTodayUsdt;
  const currentModelOption = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
                Multi-Model Agent Architecture
              </span>
              <span className="text-xs text-slate-400 font-medium">Gemini • Claude • DeepSeek • Llama</span>
            </div>
            <h1 className="text-2xl font-bold text-white">AI Model Abstraction & Policy Engine</h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              QMoosa separates AI reasoning models from financial execution authority. Choose your preferred AI model; Policy Guardian safely enforces daily spending limits and security boundaries.
            </p>
          </div>

          {/* Active Wallet Policy Quick Status */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-w-[260px] space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Active Account:</span>
              <span className="text-cyan-400 font-medium">{activeWallet.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Daily Limit:</span>
              <span className="text-slate-200 font-mono font-semibold">${activeWallet.policy.maxDailySpendingUsdt} USDT</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Spent: ${activeWallet.policy.usedTodayUsdt} USDT</span>
                <span className="text-emerald-400">Available: ${remainingDailyUsdt.toFixed(1)} USDT</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (activeWallet.policy.usedTodayUsdt / activeWallet.policy.maxDailySpendingUsdt) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Model Abstraction Layer Architecture Flow */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Agent Execution Pipeline</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            Model Agnostic • Security Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold text-[11px]">1. User Intent</div>
            <div className="text-slate-200 font-semibold truncate">Natural Language Prompt</div>
            <p className="text-[10px] text-slate-400">Financial prompt</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-indigo-400 font-bold text-[11px]">2. Model Router</div>
            <div className="text-slate-200 font-semibold truncate">{currentModelOption.name}</div>
            <p className="text-[10px] text-slate-400">{currentModelOption.provider}</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-purple-400 font-bold text-[11px]">3. Tool Calling</div>
            <div className="text-slate-200 font-semibold truncate">get_balance / simulate</div>
            <p className="text-[10px] text-slate-400">Structured JSON schema</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-1.5">
            <div className="text-emerald-400 font-bold text-[11px]">4. Policy Guardian</div>
            <div className="text-slate-200 font-semibold truncate">Policy Rules</div>
            <p className="text-[10px] text-slate-400">Limits & risk checks</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold text-[11px]">5. Blockchain</div>
            <div className="text-slate-200 font-semibold truncate">Smart Account Execution</div>
            <p className="text-[10px] text-slate-400">Fast multi-chain tx</p>
          </div>
        </div>
      </div>

      {/* AI Model Selector & Prompt Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        {/* Model Chooser Selector Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Select AI Reasoning Engine (Model Router)
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              Switch AI models without modifying smart account or contract code
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AI_MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500/80 shadow-lg shadow-cyan-500/10 text-white'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200 truncate">{model.name}</span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${model.badgeColor}`}>
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{model.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>Latency: ~{model.avgLatencyMs}ms</span>
                    <span>Provider: {model.provider}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Input Area */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Command your Agent (Natural Language Intention)
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Find best USDT yield on Solana and allocate 20 USDT with max 0.1% slippage..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 h-28 resize-none"
            />
            <button
              onClick={() => handleGeneratePlan()}
              disabled={loading || !prompt.trim()}
              className="absolute right-3 bottom-3 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reasoning with {currentModelOption.name}...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Plan Execution ({currentModelOption.name})</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Sample Prompts */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-medium">Try Sample Agent Commands:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p);
                    handleGeneratePlan(p);
                  }}
                  className="text-left text-xs bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 p-2.5 rounded-lg text-slate-300 hover:text-cyan-300 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-2">{p}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Agent Execution Plan */}
      {currentPlan && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white text-base">Model Execution Plan</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {currentPlan.resolvedModelName}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latency: {currentPlan.modelLatencyMs}ms • Tokens: ~{currentPlan.modelTokensUsed} • Tool Calls: {currentPlan.toolCallsCount}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                Confidence: {currentPlan.confidenceScore}%
              </span>
              {currentPlan.policyApproved ? (
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Policy Approved</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Policy Rejected</span>
                </span>
              )}
            </div>
          </div>

          {/* Reasoning Text */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
            <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
              <span>Agent Reasoning & Model Analysis:</span>
              <span className="font-mono text-[11px] text-slate-500">Sim Hash: {currentPlan.simulationHash}</span>
            </div>
            <p>{currentPlan.reasoningSummary}</p>
          </div>

          {/* Policy Violation Warnings if any */}
          {currentPlan.policyViolations.length > 0 && (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Policy Guardian Rejection Reasons (Deterministic Bounds Exceeded):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-rose-200/90 pl-1">
                {currentPlan.policyViolations.map((v, idx) => (
                  <li key={idx}>{v}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Execution Steps Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Multi-Step Tool Calling & Execution Pipeline</span>
              <span className="font-mono text-[11px] text-slate-500 lowercase">model -&gt; tool -&gt; policy -&gt; vm</span>
            </h4>
            <div className="space-y-2">
              {currentPlan.steps.map((step) => (
                <div
                  key={step.stepIndex}
                  className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0">
                      {step.stepIndex}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-slate-200">{step.action}</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {step.targetChain}
                        </span>
                        {step.toolCallExecuted && (
                          <span className="text-[10px] font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {step.toolCallExecuted}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{step.details}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div className="text-right">
                      <div className="text-slate-400">Fee</div>
                      <div className="text-cyan-400">${step.estimatedFeeUsd} USD ({step.estimatedFeeQms} QMS)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400">Risk Score</div>
                      <div className={step.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}>
                        {step.riskScore}/100
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Cost Totals & Confirm Button */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">Total Transaction Value</span>
                <span className="text-base font-bold text-white">${currentPlan.totalUsdtCost} USDT</span>
              </div>
              <div>
                <span className="text-slate-400 block">Gas & Network Fee</span>
                <span className="text-base font-bold text-cyan-400">{currentPlan.totalQmsFee} QMS</span>
              </div>
            </div>

            <button
              onClick={handleConfirmAndExecute}
              disabled={!currentPlan.policyApproved || isExecuting}
              className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                currentPlan.policyApproved
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Smart Account Transaction...</span>
                </>
              ) : currentPlan.policyApproved ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Smart Account Transaction</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Execution Blocked by Policy</span>
                </>
              )}
            </button>
          </div>

          {/* Live Execution Stream */}
          {executionLog.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
              <div className="text-cyan-400 font-bold flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5" />
                <span>On-Chain Realtime Execution Logs</span>
              </div>
              <div className="space-y-1 text-slate-300">
                {executionLog.map((log, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-slate-500">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execution Success Card */}
          {executedSuccessHash && (
            <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-5 text-xs space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Transaction Successfully Committed to QMoosa Testnet!</span>
              </div>
              <p className="text-emerald-200/90">
                The agent has executed the transaction via your Smart Account within specified spending limits using model reasoning from {currentPlan.resolvedModelName}.
              </p>
              <div className="flex items-center space-x-3 pt-1">
                <span className="text-slate-400">Transaction Hash:</span>
                <span className="font-mono text-cyan-300 bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  {executedSuccessHash}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
