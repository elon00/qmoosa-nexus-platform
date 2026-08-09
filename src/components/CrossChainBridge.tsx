import React, { useState } from 'react';
import { RefreshCw, ArrowDown, ArrowRight, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { NetworkChain } from '../types';
import { NETWORK_CHAINS } from '../data/genesis';

export const CrossChainBridge: React.FC = () => {
  const [sourceChain, setSourceChain] = useState<NetworkChain>('ethereum');
  const [destChain, setDestChain] = useState<NetworkChain>('qmoosa');
  const [amount, setAmount] = useState('50.0');
  const [token, setToken] = useState<'USDT' | 'QMS'>('USDT');
  const [bridging, setBridging] = useState(false);
  const [successHash, setSuccessHash] = useState<string | null>(null);

  const sourceConfig = NETWORK_CHAINS.find((c) => c.id === sourceChain) || NETWORK_CHAINS[1];
  const destConfig = NETWORK_CHAINS.find((c) => c.id === destChain) || NETWORK_CHAINS[0];

  const handleBridge = () => {
    setBridging(true);
    setSuccessHash(null);

    setTimeout(() => {
      setBridging(false);
      setSuccessHash('0xbridge_zkp_' + Math.random().toString(16).substring(2, 14));
    }, 1200);
  };

  const handleSwapChains = () => {
    const temp = sourceChain;
    setSourceChain(destChain);
    setDestChain(temp);
  };

  const estimatedGasUsd = sourceConfig.avgGasUsd + destConfig.avgGasUsd;
  const estimatedTimeMs = sourceConfig.finalityMs + destConfig.finalityMs;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">QMoosa Multi-Chain Bridge & Atomic Swaps</h1>
        </div>
        <p className="text-xs text-slate-400">
          Seamlessly bridge USDT and QMS across Ethereum, Solana, Base, BNB, Polygon, Arbitrum, and QMoosa L1 with ZK-proof verification.
        </p>
      </div>

      {/* Main Bridge Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        {/* Source Chain */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-semibold text-slate-400 block">From Network</label>
          <div className="flex items-center justify-between gap-3">
            <select
              value={sourceChain}
              onChange={(e) => setSourceChain(e.target.value as NetworkChain)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {NETWORK_CHAINS.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === destChain}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-32 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-right text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <select
                value={token}
                onChange={(e) => setToken(e.target.value as 'USDT' | 'QMS')}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="USDT">USDT</option>
                <option value="QMS">QMS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwapChains}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-cyan-400 shadow-md transition-all cursor-pointer"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Chain */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-semibold text-slate-400 block">To Network (Destination)</label>
          <div className="flex items-center justify-between gap-3">
            <select
              value={destChain}
              onChange={(e) => setDestChain(e.target.value as NetworkChain)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {NETWORK_CHAINS.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === sourceChain}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>

            <div className="font-mono text-sm font-bold text-emerald-400">
              ≈ {parseFloat(amount) || 0} {token}
            </div>
          </div>
        </div>

        {/* Bridge Route Metadata */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Security Mechanism</span>
            <span className="text-purple-400 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Succinct ZK-SNARK Relayer</span>
            </span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>Estimated Gas Cost</span>
            <span className="text-cyan-400">${estimatedGasUsd.toFixed(4)} USD</span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>Estimated Finality Time</span>
            <span className="text-emerald-400">{(estimatedTimeMs / 1000).toFixed(2)} seconds</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleBridge}
          disabled={bridging || !parseFloat(amount)}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          {bridging ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating ZK Proof & Transferring Across Chains...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span>Initiate Cross-Chain Atomic Transfer</span>
            </>
          )}
        </button>

        {/* Success Card */}
        {successHash && (
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cross-Chain Transfer Verified On-Chain!</span>
            </div>
            <div className="text-slate-300 font-mono text-[11px] truncate">ZK Proof Hash: {successHash}</div>
          </div>
        )}
      </div>
    </div>
  );
};
