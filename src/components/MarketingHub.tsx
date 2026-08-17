import React, { useState } from 'react';
import { Megaphone, Users, Award, TrendingUp, Share2, CheckCircle2, Gift, Globe, Rocket, ArrowRight } from 'lucide-react';

export const MarketingHub: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [completedQuests, setCompletedQuests] = useState<number[]>([1, 2]);

  const referralLink = 'https://qmoosa.nexus/?ref=AGENT_8A1F';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleQuest = (id: number) => {
    if (completedQuests.includes(id)) {
      setCompletedQuests(completedQuests.filter((q) => q !== id));
    } else {
      setCompletedQuests([...completedQuests, id]);
    }
  };

  const quests = [
    { id: 1, title: 'Deploy Your First Smart Account with Policy Guardian', points: 500, category: 'On-Chain' },
    { id: 2, title: 'Execute Multi-Chain AI Agent Transaction', points: 750, category: 'AI Studio' },
    { id: 3, title: 'Bridge USDT across Ethereum Sepolia & Solana Devnet', points: 1000, category: 'ZK Bridge' },
    { id: 4, title: 'Evolve Conway Automaton Lattice to 50 Generations', points: 400, category: 'Web 4.0' },
    { id: 5, title: 'Generate NIST FIPS 204 Quantum PQC Signature', points: 600, category: 'Security' },
    { id: 6, title: 'Launch an Agent Token on QMoosa Fair Launchpad', points: 1500, category: 'Launchpad' },
  ];

  const totalPoints = completedQuests.reduce((sum, id) => {
    const q = quests.find((item) => item.id === id);
    return sum + (q?.points || 0);
  }, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">Global Growth & Marketing Strategy Hub</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold font-mono">
                  1,000T QMS Ecosystem
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Global market penetration strategy: Viral Airdrop Quests, Tier-1 CEX Listings, KOL Affiliate Network, and $50M Developer Grant Program.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Your Testnet Points</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{totalPoints.toLocaleString()} PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Global Marketing */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold">
            <Rocket className="w-4 h-4" />
            <span>Tier-1 CEX Roadmap</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Targeted Day-1 listings across Binance, OKX, Bybit, KuCoin, and Coinbase with $150T QMS dedicated liquidity pools.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-purple-400 font-bold">
            <Users className="w-4 h-4" />
            <span>Global KOL Network</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Multi-regional ambassador program covering 250+ top crypto & AI researchers across North America, Europe, Asia, and UAE.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-400 font-bold">
            <Gift className="w-4 h-4" />
            <span>Viral Airdrop Quests</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Gamified on-chain quests distributing 100 Trillion QMS community rewards to active developers and node operators.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Globe className="w-4 h-4" />
            <span>$50M Agent Grants</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Non-dilutive grants and liquidity matching for builders launching autonomous Web 4.0 applications on QMoosa L1.
          </p>
        </div>
      </div>

      {/* Quests & Viral Referral Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Interactive Quests */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Testnet Incentivized Quests</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete daily interactions on the testnet to claim points for the 100T QMS Genesis Community Airdrop.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {quests.map((q) => {
              const isDone = completedQuests.includes(q.id);
              return (
                <div
                  key={q.id}
                  onClick={() => handleToggleQuest(q.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDone ? 'bg-emerald-500 text-black' : 'border border-slate-700'}`}>
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-200 block">{q.title}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{q.category}</span>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-xs text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    +{q.points} PTS
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right col: Viral Referral Box */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Viral Referral Link</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Earn 10% bonus testnet points for every builder or validator node that connects via your unique referral code.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="font-mono text-xs text-cyan-300 break-all">{referralLink}</div>
              <button
                onClick={handleCopyLink}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                {copiedLink ? 'Copied to Clipboard!' : 'Copy Referral Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
