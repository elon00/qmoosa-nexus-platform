import React, { useState } from 'react';
import { Activity, Cpu, Layers, Server, Search, Play, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { Block, ValidatorNode } from '../types';
import { DEFAULT_VALIDATORS } from '../data/genesis';

interface ExplorerProps {
  blockHeight: number;
  tps: number;
  latestBlocks: Block[];
  onMineBlock: () => void;
}

export const Explorer: React.FC<ExplorerProps> = ({
  blockHeight,
  tps,
  latestBlocks,
  onMineBlock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mining, setMining] = useState(false);

  const handleMine = () => {
    setMining(true);
    setTimeout(() => {
      onMineBlock();
      setMining(false);
    }, 600);
  };

  const filteredBlocks = latestBlocks.filter(
    (b) =>
      b.height.toString().includes(searchQuery) ||
      b.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.proposer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">QMoosa Nexus Testnet Explorer</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live parallel execution state, ZK proofs generation, and validator consensus monitoring.
            </p>
          </div>

          <button
            onClick={handleMine}
            disabled={mining}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
          >
            {mining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Parallel Block...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Produce Next Block</span>
              </>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Block Height, Hash, or Proposer Address..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Network Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 text-xs block">Current Block Height</span>
          <span className="text-xl font-bold font-mono text-white">#{blockHeight.toLocaleString()}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 text-xs block">Live Parallel Speed</span>
          <span className="text-xl font-bold font-mono text-cyan-400">{tps.toLocaleString()} TPS</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 text-xs block">Max QMS Token Supply</span>
          <span className="text-xl font-bold font-mono text-purple-400">100 Trillion</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 text-xs block">Active Validators</span>
          <span className="text-xl font-bold font-mono text-emerald-400">128 Nodes</span>
        </div>
      </div>

      {/* Live Blocks Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Recent Blocks & ZK Proof Hashes</span>
        </h3>

        <div className="space-y-3">
          {filteredBlocks.map((block) => (
            <div
              key={block.height}
              className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 text-xs space-y-2 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 font-mono font-bold border border-cyan-500/20">
                    #{block.height}
                  </span>
                  <span className="font-mono text-slate-300 font-medium truncate max-w-[200px] sm:max-w-none">
                    {block.hash}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                  <span>{block.txCount} txs</span>
                  <span>•</span>
                  <span>{block.tps} TPS</span>
                  <span>•</span>
                  <span>{new Date(block.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 font-mono text-[11px]">
                <div className="text-slate-400">
                  Proposer: <span className="text-slate-200">{block.proposer}</span>
                </div>
                <div className="text-slate-400">
                  ZK Proof: <span className="text-purple-400">{block.zkProofHash}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validator Consensus Nodes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
          <Server className="w-4 h-4 text-indigo-400" />
          <span>Active Validator Nodes & Staking Distribution</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Node Name</th>
                <th className="p-3">Region</th>
                <th className="p-3">Staked QMS</th>
                <th className="p-3">Blocks Proposed</th>
                <th className="p-3">Uptime</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {DEFAULT_VALIDATORS.map((val) => (
                <tr key={val.id} className="hover:bg-slate-950/50">
                  <td className="p-3 font-semibold text-white">{val.name}</td>
                  <td className="p-3 text-slate-400">{val.region}</td>
                  <td className="p-3 text-cyan-400 font-bold">{(val.stakedQms / 1e9).toFixed(1)}B QMS</td>
                  <td className="p-3 text-slate-300">{val.blocksProposed.toLocaleString()}</td>
                  <td className="p-3 text-emerald-400">{val.uptimePercentage}%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                      {val.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
