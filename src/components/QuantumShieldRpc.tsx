import React, { useState } from 'react';
import { Shield, Lock, Activity, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export const QuantumShieldRpc: React.FC = () => {
  const [proxyEndpoint, setProxyEndpoint] = useState('https://rpc-shield.qmoosa.io/v1/solana');
  const [ingressMetrics, setIngressMetrics] = useState({
    totalInspected: 148920,
    blockedAttacks: 412,
    pqcVerified: 148508,
    averageLatencyMs: 1.4
  });

  const [recentLogs, setRecentLogs] = useState([
    { method: 'getAccountInfo', status: 'AUTHORIZED', time: '18:34:01', signature: 'ML-DSA-65 Valid' },
    { method: 'sendTransaction', status: 'AUTHORIZED', time: '18:34:02', signature: 'Dual Ed25519 ∧ ML-DSA Valid' },
    { method: 'debug_dumpTrace', status: 'BLOCKED_BY_FIREWALL', time: '18:34:05', signature: 'MALICIOUS_CALL' },
    { method: 'getLatestBlockhash', status: 'AUTHORIZED', time: '18:34:08', signature: 'ML-DSA-65 Valid' }
  ]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>QUANTUMSHIELD MODULE • POST-QUANTUM RPC INGRESS FIREWALL</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Zero-Trust PQC RPC Proxy & Validator Shield
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mt-1">
              Active ingress firewall filtering EVM and Solana RPC calls with mandatory <strong>NIST FIPS 204 ML-DSA-65 signature header inspection</strong> and instant exploit blocking.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-right">
              <div className="text-xs text-slate-400 font-mono">Firewall Status</div>
              <div className="text-xl font-black text-blue-400 font-mono">ACTIVE (100%)</div>
              <div className="text-[10px] text-emerald-400">0 Leaked Bits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Total Inspected</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{ingressMetrics.totalInspected.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Blocked Exploits</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{ingressMetrics.blockedAttacks}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">PQC Verified</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{ingressMetrics.pqcVerified.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Average Overhead</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{ingressMetrics.averageLatencyMs} ms</div>
        </div>
      </div>

      {/* Live Logs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Real-Time Ingress Firewall Inspection Stream
        </h2>

        <div className="space-y-2">
          {recentLogs.map((log, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-3">
                {log.status === 'AUTHORIZED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className="text-slate-200 font-bold">{log.method}</span>
                <span className="text-slate-500">{log.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={log.status === 'AUTHORIZED' ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                  {log.status}
                </span>
                <span className="text-slate-400">{log.signature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
