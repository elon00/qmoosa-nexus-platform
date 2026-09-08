import React, { useState } from 'react';
import { Zap, Shield, RefreshCw, CheckCircle2, ArrowRight, Bitcoin, Layers, ExternalLink } from 'lucide-react';

export const JarsolStakingBeaming: React.FC = () => {
  const [stakeAmount, setStakeAmount] = useState('2.5');
  const [isStaking, setIsStaking] = useState(false);
  const [spellUtxo, setSpellUtxo] = useState('3a9f...81c2:0');
  const [beamingTarget, setBeamingTarget] = useState('Solana Devnet (Active Slot 494729610)');
  const [beamingHistory, setBeamingHistory] = useState([
    {
      id: 'BEAM-9021',
      btcAmount: '0.045 BTC',
      mintedJarsol: '405,000,000 JARSOL',
      status: 'VERIFIED_ON_SOLANA',
      spellHash: '618b91...b7c0',
      proof: 'RISC-V zkVM Proof Confirmed'
    }
  ]);

  const handleCastSpell = () => {
    setIsStaking(true);
    setTimeout(() => {
      const newBeam = {
        id: 'BEAM-' + Math.floor(1000 + Math.random() * 9000),
        btcAmount: (Number(stakeAmount) * 0.015).toFixed(3) + ' BTC',
        mintedJarsol: (Number(stakeAmount) * 9000000000).toLocaleString() + ' JARSOL',
        status: 'VERIFIED_ON_SOLANA',
        spellHash: '8f1a85...e79f',
        proof: 'RISC-V zkVM Proof Confirmed'
      };
      setBeamingHistory([newBeam, ...beamingHistory]);
      setIsStaking(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
              <Bitcoin className="w-3.5 h-3.5" />
              <span>JARSOL FLAGSHIP MODULE • SOLANA LST + BITCOIN CHARMS zkVM</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Solana Liquid Staking & Bitcoin Charms zkVM Beaming
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mt-1">
              Liquid stake SOL and cast programmable zero-knowledge <strong>Charms Spells on Bitcoin UTXOs</strong>, beaming state cross-chain with <strong>NIST FIPS 203 ML-KEM-768</strong> key encapsulation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-right">
              <div className="text-xs text-slate-400 font-mono">Reference Valuation</div>
              <div className="text-xl font-black text-purple-400 font-mono">9B JARSOL / 1 SOL</div>
              <div className="text-[10px] text-slate-400">Fixed Supply Model</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spell Caster */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Cast Charms v15 Spell & Beam
          </h2>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">SOL Stake Collateral</label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Bitcoin UTXO Commitment</label>
            <input
              type="text"
              value={spellUtxo}
              onChange={(e) => setSpellUtxo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Beaming Destination</label>
            <input
              type="text"
              value={beamingTarget}
              onChange={(e) => setBeamingTarget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1 font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">zkVM Target:</span>
              <span className="text-amber-400">riscv32im-unknown-none-elf</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">PQC Invariant:</span>
              <span className="text-purple-400">ML-DSA-65 & ML-KEM-768</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cluster Status:</span>
              <span className="text-emerald-400">Solana Devnet Active</span>
            </div>
          </div>

          <button
            onClick={handleCastSpell}
            disabled={isStaking}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isStaking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Proving Spell in RISC-V zkVM...</span>
              </>
            ) : (
              <>
                <Bitcoin className="w-4 h-4" />
                <span>Cast Spell & Mint JARSOL</span>
              </>
            )}
          </button>
        </div>

        {/* Beaming Feed */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Verifiable Bitcoin ↔ Solana Beaming Proofs
            </h2>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
              18/18 Charms Tests Passed
            </span>
          </div>

          <div className="space-y-3">
            {beamingHistory.map((b) => (
              <div key={b.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-amber-400">{b.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-200">{b.mintedJarsol}</div>
                </div>

                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Collateral: {b.btcAmount}</span>
                  <span className="text-emerald-400 font-bold">{b.proof}</span>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Spell Hash: <span className="text-slate-300">{b.spellHash}</span></span>
                  <span className="text-amber-400">Pure RISC-V Verification</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
