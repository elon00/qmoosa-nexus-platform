import React, { useState } from 'react';
import { Cpu, Shield, Activity, Droplet, Wallet, RefreshCw, Key, AlertCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  blockHeight: number;
  tps: number;
  onOpenFaucet: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  blockHeight,
  tps,
  onOpenFaucet,
}) => {
  const [metaMaskAccount, setMetaMaskAccount] = useState<string | null>(null);
  const [metaMaskConnecting, setMetaMaskConnecting] = useState(false);
  const [metaMaskStatusMsg, setMetaMaskStatusMsg] = useState<string | null>(null);

  const handleConnectMetaMask = async () => {
    setMetaMaskStatusMsg(null);
    setMetaMaskConnecting(true);

    try {
      const ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
      if (!ethereum) {
        setMetaMaskStatusMsg('MetaMask extension not found in browser');
        setTimeout(() => setMetaMaskStatusMsg(null), 3500);
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (Array.isArray(accounts) && accounts.length > 0) {
        setMetaMaskAccount(accounts[0]);
        setMetaMaskStatusMsg('Connected to MetaMask!');
        setTimeout(() => setMetaMaskStatusMsg(null), 3000);
      } else {
        setMetaMaskStatusMsg('No accounts found in MetaMask');
      }
    } catch (err: any) {
      console.warn('Handled MetaMask connect attempt:', err);
      if (err?.code === 4001) {
        setMetaMaskStatusMsg('Connection rejected by user');
      } else {
        setMetaMaskStatusMsg('MetaMask connection notice: ' + (err?.message || 'Check extension'));
      }
      setTimeout(() => setMetaMaskStatusMsg(null), 3500);
    } finally {
      setMetaMaskConnecting(false);
    }
  };

  const navItems = [
    { id: 'agent-studio', label: 'AI Agent Studio', icon: Cpu },
    { id: 'wallet', label: 'Wallet & Smart Accounts', icon: Wallet },
    { id: 'explorer', label: 'Block Explorer', icon: Activity },
    { id: 'bridge', label: 'Cross-Chain Bridge', icon: RefreshCw },
    { id: 'sdk', label: 'Developer SDK', icon: Shield },
    { id: 'tokenomics', label: 'Tokenomics', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('agent-studio')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  QMoosa Nexus
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Testnet v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Multi-Chain Agent Network</p>
            </div>
          </div>

          {/* Network Indicators */}
          <div className="hidden md:flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">Block:</span>
              <span className="font-mono font-semibold text-slate-200">#{blockHeight.toLocaleString()}</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Speed:</span>
              <span className="font-mono font-semibold text-cyan-400">{tps.toLocaleString()} TPS</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenFaucet}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-xs font-medium cursor-pointer"
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>Faucet (QMS/USDT)</span>
            </button>

            {/* MetaMask / Web3 Wallet Button */}
            <button
              onClick={handleConnectMetaMask}
              disabled={metaMaskConnecting}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-all cursor-pointer"
              title="Connect Web3 / MetaMask Wallet"
            >
              <div className={`w-2 h-2 rounded-full ${metaMaskAccount ? 'bg-emerald-400' : 'bg-cyan-400'}`}></div>
              <span>
                {metaMaskConnecting
                  ? 'Connecting...'
                  : metaMaskAccount
                  ? `${metaMaskAccount.substring(0, 6)}...${metaMaskAccount.substring(metaMaskAccount.length - 4)}`
                  : 'MetaMask / Smart Account'}
              </span>
            </button>
          </div>
        </div>

        {metaMaskStatusMsg && (
          <div className="bg-slate-900 border border-cyan-500/30 text-cyan-300 px-3 py-1.5 text-xs rounded-lg my-1 flex items-center space-x-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{metaMaskStatusMsg}</span>
          </div>
        )}

        {/* Navigation Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

