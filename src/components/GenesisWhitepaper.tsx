import React from 'react';
import { Shield, Coins, Cpu, CheckCircle2, Globe, Layers, Lock } from 'lucide-react';
import { TOKENOMICS_ALLOCATION, TOTAL_QMS_MAX_SUPPLY } from '../data/genesis';

export const GenesisWhitepaper: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider">
          Genesis Specification & Tokenomics
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">QMoosa Nexus Protocol</h1>
        <p className="text-slate-400 text-sm max-w-3xl mx-auto leading-relaxed">
          An autonomous multi-chain execution layer combining parallel state consensus, native AI agent permission guardians, zero-knowledge proof verification, and 100 Trillion QMS max supply tokenomics.
        </p>
      </div>

      {/* 100 Trillion Tokenomics Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>100 Trillion QMS Token Economics</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Hard-capped Maximum Supply: <span className="font-mono font-bold text-cyan-400">100,000,000,000,000 QMS</span>
            </p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            Zero Unlimited Minting • Immutable Cap
          </div>
        </div>

        {/* Visual Allocation Bars */}
        <div className="space-y-4">
          <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex">
            {TOKENOMICS_ALLOCATION.map((item, idx) => (
              <div
                key={idx}
                className={`${item.color} h-full transition-all hover:opacity-80`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.category}: ${item.percentage}%`}
              ></div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {TOKENOMICS_ALLOCATION.map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                    <span className="font-bold text-slate-200">{item.category}</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-400">{item.percentage}%</span>
                </div>
                <div className="font-mono text-slate-400 text-[11px]">
                  {(item.amountQms / 1e12).toFixed(1)} Trillion QMS
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Protocol Core Architectural Differentiators */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span>Core Differentiators vs Traditional Blockchains</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-bold text-sm text-white">Native AI Agent Execution</h3>
            <p className="text-slate-400 leading-relaxed">
              Smart Accounts natively understand Agent spending policies, risk limits, daily caps, and allowlists without exposing raw private keys.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-bold text-sm text-white">Sub-Second Parallel VM</h3>
            <p className="text-slate-400 leading-relaxed">
              Hybrid PoS + BFT consensus engine designed for 10,000+ parallel TPS with ultra-predictable $0.00005 average gas fees.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-bold text-sm text-white">USDT + Cross-Chain Interop</h3>
            <p className="text-slate-400 leading-relaxed">
              Integrated ZK-relayer bridges stablecoin USDT and native QMS across Solana, Ethereum, Base, Polygon, BNB, and Arbitrum.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Globe className="w-5 h-5 text-emerald-400" />
          <span>Architectural Comparison Table</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Feature</th>
                <th className="p-3 text-cyan-400 font-bold">QMoosa Nexus L1</th>
                <th className="p-3">Ethereum</th>
                <th className="p-3">Solana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-3 font-semibold text-white">AI Agent Permission Layer</td>
                <td className="p-3 text-emerald-400 font-bold">Native Protocol Level</td>
                <td className="p-3 text-slate-400">External Smart Contracts</td>
                <td className="p-3 text-slate-400">External Programs</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Max Token Supply Cap</td>
                <td className="p-3 text-cyan-400 font-bold">100 Trillion QMS</td>
                <td className="p-3 text-slate-400">Dynamic / Inflationary</td>
                <td className="p-3 text-slate-400">Inflation Schedule</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Average Gas Fee</td>
                <td className="p-3 text-emerald-400 font-bold">~$0.00005 USD</td>
                <td className="p-3 text-slate-400">~$1.25 USD</td>
                <td className="p-3 text-slate-400">~$0.00025 USD</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Execution Engine</td>
                <td className="p-3 text-cyan-400 font-bold">Parallel WASM/EVM + ZK</td>
                <td className="p-3 text-slate-400">Sequential EVM</td>
                <td className="p-3 text-slate-400">Sealevel Parallel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
