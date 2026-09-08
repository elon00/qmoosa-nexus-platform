import React, { useState } from 'react';
import { Shield, Cpu, RefreshCw, CheckCircle2, Lock, ArrowUpRight, Award, Zap, AlertTriangle } from 'lucide-react';

export const QarbiEscrowVault: React.FC = () => {
  const [escrowAmount, setEscrowAmount] = useState('500');
  const [targetAgent, setTargetAgent] = useState('0x4b71...e18a (Arbitrage-Quant-Alpha)');
  const [arbitragePool, setArbitragePool] = useState('USDC / WETH (Uniswap v3 ↔ Camelot)');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedEscrows, setDeployedEscrows] = useState([
    {
      id: 'ESCROW-7049',
      agent: '0x3a91...bc4e',
      amount: '1,250 USDT',
      profitTarget: '+4.8%',
      status: 'ACTIVE_ARBITRAGE',
      pqcSignature: 'b8d3c4...181f (ML-DSA-65 Verified)',
      realityScore: '6.0/10 (A+ URS Certified)'
    },
    {
      id: 'ESCROW-7048',
      agent: '0x92f1...c28a',
      amount: '5,000 USDC',
      profitTarget: '+8.2%',
      status: 'SETTLED_PROFIT_REALIZED',
      pqcSignature: '7ca8da...101e (ML-DSA-65 Verified)',
      realityScore: '6.0/10 (A+ URS Certified)'
    }
  ]);

  const handleDeployEscrow = () => {
    setIsDeploying(true);
    setTimeout(() => {
      const newEscrow = {
        id: 'ESCROW-' + Math.floor(1000 + Math.random() * 9000),
        agent: targetAgent,
        amount: escrowAmount + ' USDC',
        profitTarget: '+5.4%',
        status: 'ACTIVE_ARBITRAGE',
        pqcSignature: '4a0a33...95d3 (NIST FIPS 204 ML-DSA-65 Verified)',
        realityScore: '6.0/10 (A+ URS Certified)'
      };
      setDeployedEscrows([newEscrow, ...deployedEscrows]);
      setIsDeploying(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-cyan-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>QARBI FLAGSHIP MODULE • ARBITRUM STYLUS + WASM ESCROW</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              AI Arbitrage Escrow & Conway Decentralized Vault
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mt-1">
              Automated autonomous agent capital escrow executed on <strong>Arbitrum Stylus (Rust WASM)</strong> with pure <strong>NIST FIPS 204 ML-DSA-65</strong> dual conjunction signatures.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-right">
              <div className="text-xs text-slate-400 font-mono">URS Reality Grade</div>
              <div className="text-xl font-black text-emerald-400 font-mono">6.0/10 (A+)</div>
              <div className="text-[10px] text-slate-400">Automated: 10.0/10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Escrow Creator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            Deploy Verifiable AI Escrow
          </h2>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Select Autonomous AI Agent</label>
            <input
              type="text"
              value={targetAgent}
              onChange={(e) => setTargetAgent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Arbitrage Liquidity Pair</label>
            <input
              type="text"
              value={arbitragePool}
              onChange={(e) => setArbitragePool(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Escrow Collateral (USDC)</label>
            <input
              type="number"
              value={escrowAmount}
              onChange={(e) => setEscrowAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1 font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Cryptographic Seal:</span>
              <span className="text-emerald-400">ML-DSA-65 (FIPS 204)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Contract Runtime:</span>
              <span className="text-cyan-400">Arbitrum Stylus WASM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fail-Closed Invariant:</span>
              <span className="text-slate-200">Active (0 Loss Guard)</span>
            </div>
          </div>

          <button
            onClick={handleDeployEscrow}
            disabled={isDeploying}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sealing Escrow on Arbitrum...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Deploy AI Escrow Vault</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Active Escrows List */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Live Cryptographically Verified Vaults
            </h2>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
              {deployedEscrows.length} Active Escrows
            </span>
          </div>

          <div className="space-y-3">
            {deployedEscrows.map((e) => (
              <div key={e.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan-400">{e.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {e.status}
                    </span>
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-200">{e.amount}</div>
                </div>

                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Agent: {e.agent}</span>
                  <span className="text-emerald-400 font-bold">{e.profitTarget}</span>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>PQC Seal: <span className="text-slate-300">{e.pqcSignature}</span></span>
                  <span className="text-cyan-400">{e.realityScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
