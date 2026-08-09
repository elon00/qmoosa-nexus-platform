import React, { useState } from 'react';
import { Droplet, X, CheckCircle2, RefreshCw } from 'lucide-react';

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAddress: string;
  onFaucetDripped: (amount: number, token: 'QMS' | 'USDT') => void;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  isOpen,
  onClose,
  targetAddress,
  onFaucetDripped,
}) => {
  const [selectedToken, setSelectedToken] = useState<'QMS' | 'USDT'>('QMS');
  const [loading, setLoading] = useState(false);
  const [dripMessage, setDripMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaim = async () => {
    setLoading(true);
    setDripMessage(null);

    try {
      const res = await fetch('/api/faucet/drip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAddress,
          token: selectedToken,
        }),
      });

      const data = await res.json();
      setLoading(false);
      setDripMessage(data.message);
      onFaucetDripped(data.amount, selectedToken);
    } catch (err) {
      console.error('Faucet failed:', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">QMoosa Testnet Faucet</h3>
            <p className="text-xs text-slate-400">Claim free testnet tokens for agent execution testing.</p>
          </div>
        </div>

        <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400 block">Recipient Smart Account:</span>
            <span className="text-cyan-300 font-bold truncate block">{targetAddress}</span>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-slate-400 block font-sans font-semibold text-[11px]">Select Token Drip:</label>
            <div className="grid grid-cols-2 gap-2 font-sans">
              <button
                type="button"
                onClick={() => setSelectedToken('QMS')}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  selectedToken === 'QMS'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                1,000,000 QMS
              </button>
              <button
                type="button"
                onClick={() => setSelectedToken('USDT')}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  selectedToken === 'USDT'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                100 USDT
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Dripping Tokens to Smart Account...</span>
            </>
          ) : (
            <>
              <Droplet className="w-4 h-4" />
              <span>Claim Testnet {selectedToken}</span>
            </>
          )}
        </button>

        {dripMessage && (
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-3 text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{dripMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
