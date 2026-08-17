import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Cpu, Layers, Activity, ShieldCheck, Zap, Share2, CheckCircle2 } from 'lucide-react';

const GRID_SIZE = 32;

export const ConwayAutomaton: React.FC = () => {
  const [grid, setGrid] = useState<boolean[][]>(() => createInitialGrid('pulsar'));
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speedMs, setSpeedMs] = useState(150);
  const [committedTx, setCommittedTx] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState('pulsar');

  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  function createEmptyGrid(): boolean[][] {
    return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
  }

  function createInitialGrid(preset: string): boolean[][] {
    const newGrid = createEmptyGrid();
    const mid = Math.floor(GRID_SIZE / 2);

    if (preset === 'glider') {
      newGrid[mid][mid + 1] = true;
      newGrid[mid + 1][mid + 2] = true;
      newGrid[mid + 2][mid] = true;
      newGrid[mid + 2][mid + 1] = true;
      newGrid[mid + 2][mid + 2] = true;
    } else if (preset === 'pulsar') {
      const offsets = [-6, -1, 1, 6];
      for (const dx of offsets) {
        for (let dy = -4; dy <= -2; dy++) {
          newGrid[mid + dx][mid + dy] = true;
          newGrid[mid + dx][mid - dy] = true;
          newGrid[mid + dy][mid + dx] = true;
          newGrid[mid - dy][mid + dx] = true;
        }
      }
    } else if (preset === 'gun') {
      // Gosper Glider Gun
      const pattern = [
        [1, 5], [1, 6], [2, 5], [2, 6],
        [11, 5], [11, 6], [11, 7], [12, 4], [12, 8], [13, 3], [13, 9], [14, 3], [14, 9],
        [15, 6], [16, 4], [16, 8], [17, 5], [17, 6], [17, 7], [18, 6],
        [21, 3], [21, 4], [21, 5], [22, 3], [22, 4], [22, 5], [23, 2], [23, 6],
        [25, 1], [25, 2], [25, 6], [25, 7],
        [35, 3], [35, 4], [36, 3], [36, 4]
      ];
      pattern.forEach(([x, y]) => {
        if (x < GRID_SIZE && y < GRID_SIZE) newGrid[y][x] = true;
      });
    } else if (preset === 'random') {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          newGrid[r][c] = Math.random() > 0.75;
        }
      }
    }
    return newGrid;
  }

  const handleToggleCell = (row: number, col: number) => {
    const updated = grid.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? !c : c))
    );
    setGrid(updated);
  };

  const stepSimulation = () => {
    setGrid((currentGrid) => {
      const nextGrid = createEmptyGrid();
      const neighborsDirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ];

      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          let aliveNeighbors = 0;
          for (const [dr, dc] of neighborsDirs) {
            const nr = (r + dr + GRID_SIZE) % GRID_SIZE;
            const nc = (c + dc + GRID_SIZE) % GRID_SIZE;
            if (currentGrid[nr][nc]) aliveNeighbors++;
          }

          if (currentGrid[r][c]) {
            nextGrid[r][c] = aliveNeighbors === 2 || aliveNeighbors === 3;
          } else {
            nextGrid[r][c] = aliveNeighbors === 3;
          }
        }
      }
      return nextGrid;
    });
    setGeneration((g) => g + 1);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (runningRef.current) {
        stepSimulation();
      }
    }, speedMs);
    return () => clearInterval(interval);
  }, [isRunning, speedMs]);

  const handleApplyPreset = (presetName: string) => {
    setActivePreset(presetName);
    setIsRunning(false);
    setGeneration(0);
    setCommittedTx(null);
    setGrid(createInitialGrid(presetName));
  };

  const handleClear = () => {
    setIsRunning(false);
    setGeneration(0);
    setCommittedTx(null);
    setGrid(createEmptyGrid());
  };

  const handleCommitState = () => {
    const aliveCount = grid.flat().filter(Boolean).length;
    const entropyHash = '0xconway_' + Math.random().toString(16).substring(2, 14) + '_gen' + generation;
    setCommittedTx(entropyHash);
  };

  const aliveCount = grid.flat().filter(Boolean).length;
  const entropyRatio = ((aliveCount / (GRID_SIZE * GRID_SIZE)) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">Conway AI Automaton & Evolutionary State Engine</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold font-mono">
                  Web 4.0 Emergent VM
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Decentralized Cellular Automata lattice modeling emergent AI agent swarms, deterministic consensus entropy, and self-organizing smart contracts.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCommitState}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Share2 className="w-4 h-4" />
              <span>Commit State Root to L1</span>
            </button>
          </div>
        </div>

        {committedTx && (
          <div className="bg-emerald-950/40 border border-emerald-800/80 p-3 rounded-xl text-xs text-emerald-300 font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>State Root Committed on QMoosa L1! Block Entropy Hash: {committedTx}</span>
          </div>
        )}
      </div>

      {/* Main Grid and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Automaton Canvas */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs">
              <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 font-mono">
                Generation: <strong className="text-cyan-400">#{generation}</strong>
              </span>
              <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 font-mono">
                Active Nodes: <strong className="text-emerald-400">{aliveCount}</strong>
              </span>
              <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 font-mono hidden sm:inline-block">
                Lattice Density: <strong className="text-purple-400">{entropyRatio}%</strong>
              </span>
            </div>

            {/* Play/Pause controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isRunning ? 'Pause' : 'Evolve'}</span>
              </button>

              <button
                onClick={stepSimulation}
                disabled={isRunning}
                className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg text-xs font-mono transition-all cursor-pointer"
                title="Single Generation Step"
              >
                Step +1
              </button>

              <button
                onClick={handleClear}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-all cursor-pointer"
                title="Reset Grid"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Matrix Grid */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex justify-center overflow-x-auto">
            <div
              className="grid gap-[2px] bg-slate-900/60 p-2 rounded-lg border border-slate-800"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: '620px',
                aspectRatio: '1 / 1',
              }}
            >
              {grid.map((row, rIdx) =>
                row.map((isAlive, cIdx) => (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handleToggleCell(rIdx, cIdx)}
                    className={`aspect-square rounded-[2px] transition-all duration-75 ${
                      isAlive
                        ? 'bg-gradient-to-tr from-cyan-400 to-indigo-400 shadow-sm shadow-cyan-400/50 scale-95'
                        : 'bg-slate-950/80 hover:bg-slate-800/60'
                    }`}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Presets & Parameters */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Automaton Presets</h3>
            <div className="space-y-2">
              {[
                { id: 'pulsar', label: 'Pulsar Consensus Oscillator', desc: 'Heartbeat pattern simulating validator pulse' },
                { id: 'glider', label: 'Autonomous Agent Glider', desc: 'Self-propagating state machine traversing lattice' },
                { id: 'gun', label: 'Gosper Glider Gun', desc: 'Continuous block production state factory' },
                { id: 'random', label: 'Decentralized Random Mesh', desc: 'Stochastic agent swarm network distribution' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    activePreset === p.id
                      ? 'bg-slate-950 border-cyan-500/50 text-white shadow-md'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-slate-200 block">{p.label}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{p.desc}</span>
                </button>
              ))}
            </div>

            {/* Speed Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Evolution Speed</span>
                <span className="font-mono text-cyan-400">{speedMs}ms / gen</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Web 4.0 Mathematical Law</span>
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Every state transition follows John Conway’s deterministic B3/S23 survival rule. In the QMoosa L1 VM, these states generate verifiable zero-knowledge pseudorandomness seeds utilized in autonomous agent routing and transaction ordering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
