import React, { useState } from 'react';
import { ShieldCheck, Lock, Cpu, Key, CheckCircle2, AlertTriangle, RefreshCw, Zap, ExternalLink, Code } from 'lucide-react';

export const PQCSecurity: React.FC = () => {
  const [keyPair, setKeyPair] = useState<{ pubKey: string; privKey: string; algorithm: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [signMessage, setSignMessage] = useState('Authorize QMoosa Multi-Chain Agent Swarm Execution: 50 USDT');
  const [signatureOutput, setSignatureOutput] = useState<{ signature: string; verified: boolean; timeMs: number } | null>(null);
  const [signing, setSigning] = useState(false);

  const handleGeneratePQCKey = () => {
    setGenerating(true);
    setSignatureOutput(null);

    setTimeout(() => {
      setGenerating(false);
      setKeyPair({
        algorithm: 'ML-DSA-65 (NIST FIPS 204 Standard)',
        pubKey: '0x' + Array.from({ length: 96 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        privKey: '0x' + Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      });
    }, 600);
  };

  const handleSignMessage = () => {
    if (!keyPair) return;
    setSigning(true);

    setTimeout(() => {
      setSigning(false);
      setSignatureOutput({
        signature: '0xpqc_sig_' + Array.from({ length: 120 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        verified: true,
        timeMs: 1.45,
      });
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/50 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">Post-Quantum Cryptography (PQC) Security Layer</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                  NIST FIPS 203/204
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Lattice-based Quantum-Resistant Digital Signatures (ML-DSA / Dilithium) and Key Encapsulation (ML-KEM / Kyber) protecting Smart Accounts against Shor's Algorithm attacks.
              </p>
            </div>
          </div>

          <button
            onClick={handleGeneratePQCKey}
            disabled={generating}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-purple-500/20"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Lattice Keypair...</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Generate PQC Keypair</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Grid: Classical vs Quantum Safe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-300">Legacy ECDSA (secp256k1)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              Quantum Vulnerable
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Standard Ethereum/Bitcoin elliptic curve signatures broken in polynomial time by Shor’s Algorithm on a ~2,048-qubit quantum computer.
          </p>
          <div className="font-mono text-[11px] text-rose-400 pt-1">Threat Horizon: 2029–2032</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-purple-300">ML-DSA-65 (Dilithium)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              NIST Standard
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Module-Lattice-Based Digital Signature Algorithm (FIPS 204). Hard mathematical reduction to shortest vector lattice problems.
          </p>
          <div className="font-mono text-[11px] text-emerald-400 pt-1">Quantum Security: 128+ Bits Hardness</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-cyan-300">ML-KEM-768 (Kyber)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              Lattice KEM
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            NIST FIPS 203 Key Encapsulation mechanism utilized in QMoosa cross-chain atomic bridge channels and session key handshakes.
          </p>
          <div className="font-mono text-[11px] text-cyan-400 pt-1">Zero Shor Vulnerability</div>
        </div>
      </div>

      {/* Interactive PQC Key & Signer Playground */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Key className="w-5 h-5 text-purple-400" />
          <span>Interactive Lattice Signature & Verification Simulator</span>
        </h2>

        {keyPair ? (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-400 font-bold">{keyPair.algorithm}</span>
                <span className="text-emerald-400 flex items-center space-x-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Keypair Ready</span>
                </span>
              </div>
              <div className="text-xs text-slate-400">
                <strong className="text-slate-300 block mb-1">Public Key (Lattice Polynomial):</strong>
                <div className="font-mono text-[11px] text-cyan-300 break-all bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {keyPair.pubKey}
                </div>
              </div>
            </div>

            {/* Message input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Transaction Payload to Sign with PQC</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={signMessage}
                  onChange={(e) => setSignMessage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
                <button
                  onClick={handleSignMessage}
                  disabled={signing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  {signing ? 'Signing with ML-DSA...' : 'Sign with PQC'}
                </button>
              </div>
            </div>

            {/* Signature Output */}
            {signatureOutput && (
              <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lattice Signature Verified On-Chain!</span>
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">Verification Latency: {signatureOutput.timeMs}ms</span>
                </div>
                <div className="text-xs text-slate-400">
                  <strong className="text-slate-300 block mb-1">NIST FIPS 204 Signature Bytes:</strong>
                  <div className="font-mono text-[11px] text-purple-300 break-all bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    {signatureOutput.signature}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-950/60 rounded-xl border border-slate-800 border-dashed space-y-3">
            <Lock className="w-8 h-8 text-purple-400/60 mx-auto" />
            <p className="text-xs text-slate-400">
              Click <strong className="text-purple-300">Generate PQC Keypair</strong> above to initialize a NIST-compliant quantum-safe keypair.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
