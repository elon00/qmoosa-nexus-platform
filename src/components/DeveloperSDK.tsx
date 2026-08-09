import React, { useState } from 'react';
import { Terminal, Play, Code, Copy, Check, RefreshCw } from 'lucide-react';
import { SDK_EXAMPLES } from '../data/genesis';

export const DeveloperSDK: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(SDK_EXAMPLES[0]);
  const [editableCode, setEditableCode] = useState(SDK_EXAMPLES[0].code);
  const [executing, setExecuting] = useState(false);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleSelectExample = (ex: (typeof SDK_EXAMPLES)[0]) => {
    setSelectedExample(ex);
    setEditableCode(ex.code);
    setOutputLogs([]);
  };

  const handleRunCode = async () => {
    setExecuting(true);
    setOutputLogs([]);

    try {
      const res = await fetch('/api/sdk/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editableCode,
          language: selectedExample.language,
        }),
      });

      const data = await res.json();
      setTimeout(() => {
        setExecuting(false);
        setOutputLogs(data.outputLogs || []);
      }, 800);
    } catch (err) {
      console.error('Failed to run code:', err);
      setExecuting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Developer SDK & Agent Code Studio</h1>
        </div>
        <p className="text-xs text-slate-400">
          Build and deploy autonomous AI agents using QMoosa TypeScript, Python, and Rust SDKs.
        </p>
      </div>

      {/* Code Editor & Test Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Examples */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">SDK Templates</h3>
          <div className="space-y-2">
            {SDK_EXAMPLES.map((ex) => {
              const isSelected = ex.id === selectedExample.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExample(ex)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-200">{ex.title}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {ex.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ex.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Playground */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Editor Top Bar */}
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold font-mono text-slate-200">{selectedExample.title}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={executing}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  {executing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run SDK Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Editable Textarea */}
            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              className="w-full h-80 bg-slate-950 p-4 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed selection:bg-cyan-500/30"
              spellCheck={false}
            />
          </div>

          {/* Execution Output Console */}
          {outputLogs.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
              <span className="text-cyan-400 font-bold block">Console Output Logs:</span>
              <div className="space-y-1 text-slate-300">
                {outputLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-slate-500">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
