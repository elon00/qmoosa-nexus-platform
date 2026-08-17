import React from 'react';
import { Shield, Coins, Cpu, CheckCircle2, Globe, Layers, Lock, History, Award, Sparkles } from 'lucide-react';
import { TOKENOMICS_ALLOCATION, TOTAL_QMS_MAX_SUPPLY } from '../data/genesis';

export const GenesisWhitepaper: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider">
          Genesis Whitepaper v4.0 & Project History
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">QMoosa Nexus Protocol</h1>
        <p className="text-slate-400 text-sm max-w-3xl mx-auto leading-relaxed">
          An autonomous Web 4.0 multi-chain execution layer combining parallel state consensus, native AI agent permission guardians, Post-Quantum lattice cryptography, Conway automaton emergence, and a 1,000 Trillion QMS hard cap.
        </p>
      </div>

      {/* Mere History of the Project */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-4">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">The History & Genesis of QMoosa Nexus</h2>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            <strong className="text-white">The Genesis Epoch (2024–2025):</strong> The QMoosa Nexus initiative was conceived to resolve the fundamental bottleneck of Web3: humans were required to manually approve every single cryptographic signature, quote slippage, and manage gas across fragmented blockchain networks. While large language models (LLMs) emerged capable of autonomous reasoning, they lacked safe financial boundaries—an untrusted agent could drain a user's wallet or execute unauthorized contract calls.
          </p>

          <p>
            <strong className="text-cyan-300">The Web 4.0 Architectural Breakthrough (2025–2026):</strong> The QMoosa research team combined Account Abstraction (ERC-4337) with the <span className="text-white font-semibold">Policy Guardian</span>—a deterministic smart contract layer that acts as an unbreakable sandbox for AI agents. By equipping agents with scoped session keys, daily spending caps, and risk score thresholds, AI agents gained the ability to autonomously execute cross-chain DEX swaps, pay for compute, and manage DeFi positions without exposing raw private keys.
          </p>

          <p>
            <strong className="text-purple-300">Convergence with Quantum Resistance & Cellular Automata:</strong> As quantum computing matured, QMoosa integrated NIST FIPS 203/204 Post-Quantum Cryptography (ML-DSA / Dilithium & ML-KEM / Kyber), ensuring that smart accounts remain unbreakable against Shor’s algorithm. Concurrently, the platform integrated John Conway’s Cellular Automata as a decentralized, emergent entropy beacon for multi-agent swarm consensus.
          </p>

          <p>
            <strong className="text-amber-300">Global Standards & Market Launch (Present):</strong> Today, QMoosa Nexus is fully compliant with EU MiCA (2023/1114) disclosures, FATF Travel Rule protocols, and the EU AI Act (2024/1689), powered by an immutable 1,000 Trillion QMS token economy designed to power the next trillion autonomous machine transactions.
          </p>
        </div>
      </div>

      {/* 1,000 Trillion Tokenomics Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>1,000 Trillion QMS Token Economics (1 Quadrillion)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Hard-capped Maximum Supply: <span className="font-mono font-bold text-cyan-400">1,000,000,000,000,000 QMS</span>
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
            <h3 className="font-bold text-sm text-white">Post-Quantum Lattice Security</h3>
            <p className="text-slate-400 leading-relaxed">
              NIST FIPS 203/204 ML-DSA and ML-KEM cryptographic primitives preventing quantum state decryption and signature forgery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
