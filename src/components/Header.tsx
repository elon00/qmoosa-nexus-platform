import React, { useState } from 'react';
import { Cpu, Shield, Activity, Droplet, Wallet, RefreshCw, Key, AlertCircle, Scale, ShieldCheck, Globe, Bot, Workflow, Rocket, Megaphone, CheckCircle2, Lock, Zap, History } from 'lucide-react';
import { LIVE_SUPPORTED_NETWORKS, BlockchainService } from '../services/blockchainService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  blockHeight: number;
  tps: number;
  onOpenFaucet: () => void;
  activeNetworkKey: string;
  setActiveNetworkKey: (networkKey: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  blockHeight,
  tps,
  onOpenFaucet,
  activeNetworkKey,
  setActiveNetworkKey,
}) => {
  const [metaMaskAccount, setMetaMaskAccount] = useState<string | null>(null);
  const [metaMaskConnecting, setMetaMaskConnecting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleConnectMetaMask = async () => {
    setStatusMsg(null);
    setMetaMaskConnecting(true);

    try {
      const ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
      if (!ethereum) {
        setStatusMsg('MetaMask extension not found in browser. Please install or enable MetaMask.');
        setTimeout(() => setStatusMsg(null), 4000);
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (Array.isArray(accounts) && accounts.length > 0) {
        setMetaMaskAccount(accounts[0]);
        setStatusMsg(`Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`);
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        setStatusMsg('No accounts found in MetaMask');
      }
    } catch (err: any) {
      console.warn('Handled MetaMask connect attempt:', err);
      if (err?.code === 4001) {
        setStatusMsg('Connection request was rejected in wallet');
      } else {
        setStatusMsg('Wallet status: ' + (err?.message || 'Check extension'));
      }
      setTimeout(() => setStatusMsg(null), 3500);
    } finally {
      setMetaMaskConnecting(false);
    }
  };

  const handleNetworkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value;
    setActiveNetworkKey(selectedKey);
    const result = await BlockchainService.switchEVMNetwork(selectedKey);
    setStatusMsg(result.message);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const navItems = [
    { id: 'agent-studio', label: 'AI Agent Studio', icon: Cpu },
    { id: 'chatbot', label: 'Agent Chatbot', icon: Bot },
    { id: 'workflows', label: 'Workflow Builder', icon: Workflow },
    { id: 'conway', label: 'Conway Automaton', icon: Zap },
    { id: 'pqc', label: 'PQC Quantum Security', icon: Lock },
    { id: 'launchpad', label: 'Token Launchpad', icon: Rocket },
    { id: 'marketing', label: 'Marketing & Quests', icon: Megaphone },
    { id: 'health', label: 'Diagnostic Matrix', icon: CheckCircle2 },
    { id: 'wallet', label: 'Smart Accounts', icon: Wallet },
    { id: 'explorer', label: 'Block Explorer', icon: Activity },
    { id: 'bridge', label: 'Cross-Chain ZK Bridge', icon: RefreshCw },
    { id: 'compliance', label: 'Global Compliance', icon: Scale },
    { id: 'security', label: 'Security Audit (98.4%)', icon: ShieldCheck },
    { id: 'sdk', label: 'Developer SDK', icon: Shield },
    { id: 'tokenomics', label: '1,000T Whitepaper', icon: Key },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('agent-studio')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  QMoosa Nexus
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Global Testnet v4.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Autonomous Web 4.0 Multi-Chain Layer</p>
            </div>
          </div>

          {/* Network Switcher & Indicators */}
          <div className="hidden md:flex items-center space-x-3 text-xs">
            {/* Live RPC Selector */}
            <div className="flex items-center space-x-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={activeNetworkKey}
                onChange={handleNetworkChange}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                {Object.values(LIVE_SUPPORTED_NETWORKS).map((net) => (
                  <option key={net.id} value={net.id} className="bg-slate-900 text-white">
                    {net.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Block & Speed Counter */}
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
              <span>Testnet Faucet</span>
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
                  : 'Web3 Wallet'}
              </span>
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="bg-slate-900 border border-cyan-500/30 text-cyan-300 px-3 py-1.5 text-xs rounded-lg my-1 flex items-center space-x-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{statusMsg}</span>
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
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
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
