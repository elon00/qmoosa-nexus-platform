import React, { useState } from 'react';
import { Workflow, Play, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck, Zap, Layers, Plus, Settings2, Sparkles, Server } from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  trigger: string;
  guardCheck: string;
  aiAction: string;
  settlementChain: string;
  frequency: string;
}

export const WorkflowBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([
    {
      id: 'wf-01',
      name: 'Autonomous Multi-Chain Flash Arbitrage',
      category: 'DeFi High-Frequency',
      description: 'Scans USDT/QMS price disparities across Ethereum Sepolia, Solana, and QMoosa L1; triggers zero-slippage rebalancing when spread > 0.4%.',
      trigger: 'Price Disparity Spread > 0.4%',
      guardCheck: 'Max $100/tx, Max $500/day, Risk ≤ 45/100',
      aiAction: 'Simulate DEX Route & Generate ZK Proof',
      settlementChain: 'QMoosa Parallel L1 + Solana',
      frequency: 'Every Block (~350ms)',
    },
    {
      id: 'wf-02',
      name: 'Smart Dollar-Cost Averaging (DCA) into QMS',
      category: 'Treasury & Staking',
      description: 'Allocates $25 USDT daily into staked QMS tokens whenever network gas is in the lowest 20th percentile.',
      trigger: 'Daily 00:00 UTC & Gas < 0.0001 USD',
      guardCheck: 'Max $25/day strict limit',
      aiAction: 'Execute Permit2 Swaps & Stake in Validator',
      settlementChain: 'Base Sepolia (L2)',
      frequency: 'Daily',
    },
    {
      id: 'wf-03',
      name: 'Automated Circuit Breaker & Emergency Stop-Loss',
      category: 'Risk Mitigation',
      description: 'Monitors market volatility index; automatically activates Smart Account Emergency Pause if abnormal contract drains are detected.',
      trigger: 'Slippage > 5% or Unverified Contract Call',
      guardCheck: 'Zero-trust instant circuit breaker',
      aiAction: 'Toggle Emergency Pause & Revoke Session Keys',
      settlementChain: 'All Connected Chains',
      frequency: 'Continuous Sentinel',
    },
  ]);

  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowTemplate>(workflows[0]);
  const [runningStep, setRunningStep] = useState<number | null>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [completedTxHash, setCompletedTxHash] = useState<string | null>(null);

  const handleRunWorkflow = () => {
    setRunningStep(1);
    setCompletedTxHash(null);
    setExecutionLogs([`[Trigger] Event detected: ${activeWorkflow.trigger}`]);

    setTimeout(() => {
      setRunningStep(2);
      setExecutionLogs((prev) => [...prev, `[Policy Guardian] Enforcing rules: ${activeWorkflow.guardCheck}`]);
    }, 600);

    setTimeout(() => {
      setRunningStep(3);
      setExecutionLogs((prev) => [...prev, `[AI Model] Formulating route: ${activeWorkflow.aiAction}`]);
    }, 1200);

    setTimeout(() => {
      setRunningStep(4);
      setExecutionLogs((prev) => [
        ...prev,
        `[Consensus] Broadcasted & settled on ${activeWorkflow.settlementChain}!`,
      ]);
      const tx = '0xwf_exec_' + Math.random().toString(16).substring(2, 14);
      setCompletedTxHash(tx);
      setRunningStep(null);
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Workflow className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">Visual Agent Workflow Builder</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold font-mono">
                  Autonomous Pipelines
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Construct, orchestrate, and simulate multi-stage autonomous AI execution pipelines bounded by deterministic on-chain spending guardians.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunWorkflow}
            disabled={runningStep !== null}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
          >
            {runningStep !== null ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing Pipeline Step {runningStep}/4...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Selected Workflow</span>
              </>
            )}
          </button>
        </div>

        {completedTxHash && (
          <div className="bg-emerald-950/40 border border-emerald-800/80 p-3.5 rounded-xl text-xs text-emerald-300 font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Workflow Completed Successfully! On-Chain Execution Hash: {completedTxHash}</span>
          </div>
        )}
      </div>

      {/* Grid: Workflow List and Visual Flow Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Templates */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Autonomous Pipelines</h3>
          <div className="space-y-2">
            {workflows.map((wf) => {
              const isSelected = wf.id === activeWorkflow.id;
              return (
                <button
                  key={wf.id}
                  onClick={() => {
                    setActiveWorkflow(wf);
                    setExecutionLogs([]);
                    setCompletedTxHash(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{wf.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {wf.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{wf.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Stage Flow */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">{activeWorkflow.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeWorkflow.description}</p>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                {activeWorkflow.frequency}
              </span>
            </div>

            {/* Visual 4-Step Pipeline Node Chart */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { step: 1, title: 'Trigger Event', val: activeWorkflow.trigger, icon: Zap, color: 'text-amber-400' },
                { step: 2, title: 'Policy Guardian', val: activeWorkflow.guardCheck, icon: ShieldCheck, color: 'text-purple-400' },
                { step: 3, title: 'AI Model Planner', val: activeWorkflow.aiAction, icon: Sparkles, color: 'text-cyan-400' },
                { step: 4, title: 'L1/L2 Settlement', val: activeWorkflow.settlementChain, icon: Server, color: 'text-emerald-400' },
              ].map((node) => {
                const Icon = node.icon;
                const isActive = runningStep === node.step;
                const isDone = (runningStep === null && completedTxHash) || (runningStep !== null && runningStep > node.step);
                return (
                  <div
                    key={node.step}
                    className={`bg-slate-950 p-4 rounded-xl border space-y-2 transition-all ${
                      isActive
                        ? 'border-cyan-400 ring-2 ring-cyan-500/20 scale-105'
                        : isDone
                        ? 'border-emerald-500/50 bg-emerald-950/20'
                        : 'border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Step {node.step}
                      </span>
                      <Icon className={`w-4 h-4 ${node.color}`} />
                    </div>
                    <div className="font-bold text-xs text-slate-200">{node.title}</div>
                    <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">{node.val}</p>
                  </div>
                );
              })}
            </div>

            {/* Live Console Output */}
            {executionLogs.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Live Workflow Execution Console
                </span>
                <div className="space-y-1 font-mono text-xs text-slate-300">
                  {executionLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-cyan-400">➜</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
