import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AgentStudio } from './components/AgentStudio';
import { WalletPortal } from './components/WalletPortal';
import { Explorer } from './components/Explorer';
import { CrossChainBridge } from './components/CrossChainBridge';
import { DeveloperSDK } from './components/DeveloperSDK';
import { GenesisWhitepaper } from './components/GenesisWhitepaper';
import { FaucetModal } from './components/FaucetModal';
import { DEFAULT_AGENT_WALLETS } from './data/genesis';
import { AgentWallet, Block, AgentExecutionPlan } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('agent-studio');
  const [wallets, setWallets] = useState<AgentWallet[]>(DEFAULT_AGENT_WALLETS);
  const [activeWallet, setActiveWallet] = useState<AgentWallet>(DEFAULT_AGENT_WALLETS[0]);

  const [blockHeight, setBlockHeight] = useState(104820);
  const [tps, setTps] = useState(8450);
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [isFaucetOpen, setIsFaucetOpen] = useState(false);

  // Fetch real-time status from Express backend
  const fetchBlockchainStatus = async () => {
    try {
      const res = await fetch('/api/blockchain/status');
      if (res.ok) {
        const data = await res.json();
        setBlockHeight(data.blockHeight);
        setTps(data.tps);
        if (data.latestBlocks?.length > 0) {
          setLatestBlocks(data.latestBlocks);
        }
      }
    } catch (err) {
      console.warn('Backend status poll error:', err);
    }
  };

  useEffect(() => {
    fetchBlockchainStatus();
    const interval = setInterval(fetchBlockchainStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle transaction execution from Agent Studio
  const handleExecuteTx = (plan: AgentExecutionPlan) => {
    const updated = wallets.map((w) => {
      if (w.id === activeWallet.id) {
        const newUsed = w.policy.usedTodayUsdt + plan.totalUsdtCost;
        const newUsdtBalance = Math.max(0, w.usdtBalance - plan.totalUsdtCost);
        const newQmsBalance = Math.max(0, w.qmsBalance - plan.totalQmsFee);
        return {
          ...w,
          usdtBalance: newUsdtBalance,
          qmsBalance: newQmsBalance,
          policy: {
            ...w.policy,
            usedTodayUsdt: newUsed,
          },
        };
      }
      return w;
    });

    setWallets(updated);
    const newActive = updated.find((w) => w.id === activeWallet.id) || updated[0];
    setActiveWallet(newActive);
    fetchBlockchainStatus();
  };

  // Handle Policy rule update
  const handleUpdatePolicy = (updatedPolicy: any) => {
    const updated = wallets.map((w) => {
      if (w.id === activeWallet.id) {
        return { ...w, policy: updatedPolicy };
      }
      return w;
    });
    setWallets(updated);
    setActiveWallet({ ...activeWallet, policy: updatedPolicy });
  };

  // Handle Mine block
  const handleMineBlock = async () => {
    try {
      const res = await fetch('/api/blockchain/mine', { method: 'POST' });
      if (res.ok) {
        fetchBlockchainStatus();
      }
    } catch (err) {
      console.error('Failed to mine block:', err);
    }
  };

  // Handle Faucet drip
  const handleFaucetDripped = (amount: number, token: 'QMS' | 'USDT') => {
    const updated = wallets.map((w) => {
      if (w.id === activeWallet.id) {
        return {
          ...w,
          qmsBalance: token === 'QMS' ? w.qmsBalance + amount : w.qmsBalance,
          usdtBalance: token === 'USDT' ? w.usdtBalance + amount : w.usdtBalance,
        };
      }
      return w;
    });
    setWallets(updated);
    setActiveWallet(updated.find((w) => w.id === activeWallet.id) || updated[0]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        blockHeight={blockHeight}
        tps={tps}
        onOpenFaucet={() => setIsFaucetOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'agent-studio' && (
          <AgentStudio activeWallet={activeWallet} onExecuteTx={handleExecuteTx} />
        )}

        {activeTab === 'wallet' && (
          <WalletPortal
            wallets={wallets}
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
            onUpdatePolicy={handleUpdatePolicy}
          />
        )}

        {activeTab === 'explorer' && (
          <Explorer
            blockHeight={blockHeight}
            tps={tps}
            latestBlocks={latestBlocks}
            onMineBlock={handleMineBlock}
          />
        )}

        {activeTab === 'bridge' && <CrossChainBridge />}

        {activeTab === 'sdk' && <DeveloperSDK />}

        {activeTab === 'tokenomics' && <GenesisWhitepaper />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-300">QMoosa Nexus Testnet v1.0</span>
            <span>•</span>
            <span>Autonomous Agent & Policy Protocol</span>
            <span>•</span>
            <span>AI-Native Web4 Multi-Chain Engine</span>
          </div>
          <div className="flex items-center space-x-3 font-mono text-[11px] text-slate-400">
            <span>100T QMS Supply</span>
            <span>•</span>
            <span>Multi-Chain Interop</span>
            <span>•</span>
            <span>USDT Native</span>
          </div>
        </div>
      </footer>

      {/* Faucet Modal */}
      <FaucetModal
        isOpen={isFaucetOpen}
        onClose={() => setIsFaucetOpen(false)}
        targetAddress={activeWallet.address}
        onFaucetDripped={handleFaucetDripped}
      />
    </div>
  );
}
