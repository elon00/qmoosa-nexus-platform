import React, { useState } from 'react';
import { Wallet, ShieldCheck, Lock, AlertTriangle, Plus, Key, Layers, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { AgentWallet, NetworkChain } from '../types';
import { NETWORK_CHAINS } from '../data/genesis';

interface WalletPortalProps {
  wallets: AgentWallet[];
  activeWallet: AgentWallet;
  setActiveWallet: (wallet: AgentWallet) => void;
  onUpdatePolicy: (updatedPolicy: any) => void;
}

export const WalletPortal: React.FC<WalletPortalProps> = ({
  wallets,
  activeWallet,
  setActiveWallet,
  onUpdatePolicy,
}) => {
  const [editingPolicy, setEditingPolicy] = useState({ ...activeWallet.policy });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [metaMaskAddress, setMetaMaskAddress] = useState<string | null>(null);
  const [metaMaskConnecting, setMetaMaskConnecting] = useState(false);
  const [metaMaskMsg, setMetaMaskMsg] = useState<string | null>(null);

  const handleConnectMetaMask = async () => {
    setMetaMaskMsg(null);
    setMetaMaskConnecting(true);

    try {
      const ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
      if (!ethereum) {
        setMetaMaskMsg('MetaMask extension not found in browser. Please install or enable MetaMask extension.');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (Array.isArray(accounts) && accounts.length > 0) {
        setMetaMaskAddress(accounts[0]);
        setMetaMaskMsg(`MetaMask successfully connected: ${accounts[0]}`);
      } else {
        setMetaMaskMsg('No accounts returned from MetaMask.');
      }
    } catch (err: any) {
      console.warn('Handled MetaMask connection attempt in WalletPortal:', err);
      if (err?.code === 4001) {
        setMetaMaskMsg('User rejected connection request in MetaMask.');
      } else {
        setMetaMaskMsg(err?.message || 'Failed to connect to MetaMask.');
      }
    } finally {
      setMetaMaskConnecting(false);
    }
  };

  const handleToggleChain = (chainId: NetworkChain) => {
    const current = editingPolicy.allowedChains || [];
    const exists = current.includes(chainId);
    const updatedChains = exists
      ? current.filter((c) => c !== chainId)
      : [...current, chainId];
    setEditingPolicy({ ...editingPolicy, allowedChains: updatedChains });
  };

  const handleSavePolicy = () => {
    onUpdatePolicy(editingPolicy);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Smart Accounts & Agent Wallet Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            QMoosa Smart Accounts use Account Abstraction (ERC-4337 / Sol-AA) with built-in Spending Limit Guardians and Emergency Pauses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleConnectMetaMask}
            disabled={metaMaskConnecting}
            className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center space-x-2 transition-all cursor-pointer"
          >
            <div className={`w-2 h-2 rounded-full ${metaMaskAddress ? 'bg-emerald-400' : 'bg-cyan-400'}`}></div>
            <span>
              {metaMaskConnecting
                ? 'Connecting MetaMask...'
                : metaMaskAddress
                ? `MetaMask: ${metaMaskAddress.substring(0, 6)}...`
                : 'Connect MetaMask Wallet'}
            </span>
          </button>

          <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Passkey MPC Active</span>
          </span>
        </div>
      </div>

      {metaMaskMsg && (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{metaMaskMsg}</span>
        </div>
      )}


      {/* Wallet Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map((w) => {
          const isActive = w.id === activeWallet.id;
          return (
            <div
              key={w.id}
              onClick={() => {
                setActiveWallet(w);
                setEditingPolicy({ ...w.policy });
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-b from-slate-900 to-indigo-950/60 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 font-bold font-mono">
                    AA
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{w.name}</h3>
                    <p className="font-mono text-xs text-slate-400">{w.address}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {w.smartAccountType}
                </span>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">QMS Balance</span>
                  <span className="text-sm font-bold text-cyan-300">{w.qmsBalance.toLocaleString()} QMS</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">USDT Balance</span>
                  <span className="text-sm font-bold text-emerald-400">${w.usdtBalance.toLocaleString()} USDT</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Chain Balances Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Multi-Chain Unified Liquidity (USDT + QMS)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {NETWORK_CHAINS.map((chain) => (
            <div key={chain.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="font-semibold text-slate-200">{chain.name}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {chain.type}
                </span>
              </div>
              <div className="font-mono font-bold text-emerald-400">
                ${(activeWallet.usdtBalance / NETWORK_CHAINS.length).toFixed(2)} USDT
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                Gas: ${chain.avgGasUsd} ({chain.finalityMs}ms)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Policy Guardian Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Policy Guardian & Security Controls</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Set hard spending limits, allowed target chains, human approval thresholds, and emergency controls for your AI Agents.
            </p>
          </div>

          <button
            onClick={handleSavePolicy}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Policy Saved!</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Update Policy Rules</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spending Limits */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Financial Spending Boundaries</h4>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 block">Maximum Daily Spending Limit (USDT)</label>
              <input
                type="number"
                value={editingPolicy.maxDailySpendingUsdt}
                onChange={(e) =>
                  setEditingPolicy({ ...editingPolicy, maxDailySpendingUsdt: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 block">Maximum Single Transaction Limit (USDT)</label>
              <input
                type="number"
                value={editingPolicy.maxPerTxUsdt}
                onChange={(e) =>
                  setEditingPolicy({ ...editingPolicy, maxPerTxUsdt: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 block">Require Human Approval Above (USDT)</label>
              <input
                type="number"
                value={editingPolicy.requireHumanApprovalAboveUsdt}
                onChange={(e) =>
                  setEditingPolicy({
                    ...editingPolicy,
                    requireHumanApprovalAboveUsdt: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Target Chains & Emergency Controls */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Chain & Emergency Governance</h4>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 block">Authorized Chains for Agent Execution</label>
              <div className="flex flex-wrap gap-1.5">
                {NETWORK_CHAINS.map((chain) => {
                  const isAllowed = editingPolicy.allowedChains?.includes(chain.id);
                  return (
                    <button
                      key={chain.id}
                      type="button"
                      onClick={() => handleToggleChain(chain.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                        isAllowed
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {chain.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 space-y-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Emergency Kill Switch</span>
                  <span className="text-[11px] text-slate-400">Instantly freeze all automated agent withdrawals.</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingPolicy({
                      ...editingPolicy,
                      emergencyPauseActive: !editingPolicy.emergencyPauseActive,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    editingPolicy.emergencyPauseActive
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {editingPolicy.emergencyPauseActive ? 'PAUSED' : 'ACTIVE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
