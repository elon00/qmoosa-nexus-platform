import React, { useState } from 'react';
import { Rocket, Coins, Plus, TrendingUp, ShieldCheck, CheckCircle2, Search, ArrowUpRight, Flame } from 'lucide-react';

interface AgentToken {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  marketCapUsd: number;
  bondingProgress: number; // 0 to 100%
  holdersCount: number;
  qmsLiquidity: number;
  description: string;
  priceUsd: number;
  change24h: number;
}

export const TokenLaunchpad: React.FC = () => {
  const [tokens, setTokens] = useState<AgentToken[]>([
    {
      id: 'tok-01',
      name: 'Vortex Arbitrage Agent',
      symbol: 'VORTEX',
      creator: '0xAgent_Creator_8819',
      marketCapUsd: 1420000,
      bondingProgress: 78.5,
      holdersCount: 3420,
      qmsLiquidity: 5000000000,
      description: 'Autonomous multi-chain arbitrage agent distributing 80% of cross-chain capture to token stakers.',
      priceUsd: 0.00142,
      change24h: 34.2,
    },
    {
      id: 'tok-02',
      name: 'Quantum PQC Sentinel',
      symbol: 'QSENT',
      creator: '0xQuantum_Dev_9901',
      marketCapUsd: 890000,
      bondingProgress: 52.0,
      holdersCount: 1980,
      qmsLiquidity: 2500000000,
      description: 'Post-Quantum lattice signature validator securing high-value smart accounts against Shor algorithms.',
      priceUsd: 0.00089,
      change24h: 18.5,
    },
    {
      id: 'tok-03',
      name: 'Conway Automaton Swarm',
      symbol: 'SWARM',
      creator: '0xConway_Lattice_3311',
      marketCapUsd: 2150000,
      bondingProgress: 94.0,
      holdersCount: 5120,
      qmsLiquidity: 8200000000,
      description: 'Self-organizing cellular automata agent producing verifiable randomness beacons for DeFi protocols.',
      priceUsd: 0.00215,
      change24h: 48.9,
    },
  ]);

  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDesc, setTokenDesc] = useState('');
  const [initialQms, setInitialQms] = useState('1000000');
  const [deploySuccess, setDeploySuccess] = useState<string | null>(null);

  const handleDeployToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName || !tokenSymbol) return;

    const newToken: AgentToken = {
      id: 'tok_' + Date.now(),
      name: tokenName,
      symbol: tokenSymbol.toUpperCase(),
      creator: '0xNexus_Creator_You',
      marketCapUsd: 50000,
      bondingProgress: 5.0,
      holdersCount: 1,
      qmsLiquidity: Number(initialQms) || 1000000,
      description: tokenDesc || 'Autonomous AI Agent utility token launched on QMoosa Nexus Bonding Curve.',
      priceUsd: 0.00005,
      change24h: 0.0,
    };

    setTokens([newToken, ...tokens]);
    setDeploySuccess(`Deployed $${newToken.symbol} successfully on QMoosa Bonding Curve!`);
    setIsDeployModalOpen(false);
    setTokenName('');
    setTokenSymbol('');
    setTokenDesc('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">QMoosa Agent Fair Launchpad</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold font-mono">
                  Bonding Curve Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Deploy and trade autonomous AI agent tokens with fair launch bonding curves, instant liquidity, and automated DEX graduation into QMS pools.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Agent Token</span>
          </button>
        </div>

        {deploySuccess && (
          <div className="bg-emerald-950/40 border border-emerald-800/80 p-3 rounded-xl text-xs text-emerald-300 font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{deploySuccess}</span>
          </div>
        )}
      </div>

      {/* Trending Agent Tokens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tokens.map((tok) => (
          <div key={tok.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-sm text-white">{tok.name}</h3>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                    ${tok.symbol}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">By: {tok.creator.substring(0, 10)}...</span>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-0.5 bg-emerald-500/10 px-2 py-0.5 rounded">
                <TrendingUp className="w-3 h-3" />
                <span>+{tok.change24h}%</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{tok.description}</p>

            {/* Bonding Curve Bar */}
            <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Bonding Progress</span>
                <span className="font-mono font-bold text-amber-400">{tok.bondingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${tok.bondingProgress}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                <span>Market Cap: ${tok.marketCapUsd.toLocaleString()}</span>
                <span>Holders: {tok.holdersCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Price</span>
                <span className="font-mono font-bold text-xs text-white">${tok.priceUsd}</span>
              </div>

              <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition-all cursor-pointer">
                Trade / Swap
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Launch New Token */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Rocket className="w-4 h-4 text-amber-400" />
                <span>Deploy Autonomous Agent Token</span>
              </h2>
              <button onClick={() => setIsDeployModalOpen(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleDeployToken} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Token Name</label>
                <input
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="e.g. Nexus Sentinel AI"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Token Symbol (Ticker)</label>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  placeholder="e.g. SENTINEL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white uppercase focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Agent Description & Utility</label>
                <textarea
                  value={tokenDesc}
                  onChange={(e) => setTokenDesc(e.target.value)}
                  placeholder="What autonomous task does this agent perform?"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Initial QMS Liquidity Deposit</label>
                <input
                  type="number"
                  value={initialQms}
                  onChange={(e) => setInitialQms(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                Instant Fair Launch Token
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
