/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, RotateCcw, AlertCircle, CheckCircle2, Sliders } from 'lucide-react';

interface SimulationControlsProps {
  secretMask: string;
  onUpdateMask: (mask: string) => void;
  shots: number;
  onChangeShots: (shots: number) => void;
  noiseEnabled: boolean;
  onToggleNoise: (enabled: boolean) => void;
  onRunSimulation: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  secretMask,
  onUpdateMask,
  shots,
  onChangeShots,
  noiseEnabled,
  onToggleNoise,
  onRunSimulation,
  onReset,
  isRunning,
}) => {
  const [inputValue, setInputValue] = useState<string>(secretMask);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync external changes
  React.useEffect(() => {
    setInputValue(secretMask);
  }, [secretMask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Only allow binary characters
    const filtered = raw.replace(/[^01]/g, '').slice(0, 6);
    setInputValue(filtered);

    if (filtered.length !== 6) {
      setErrorMsg(`Mask must be exactly 6 binary digits (currently ${filtered.length}/6).`);
    } else {
      setErrorMsg(null);
      onUpdateMask(filtered);
    }
  };

  const handleApplyPreset = (preset: string) => {
    setInputValue(preset);
    setErrorMsg(null);
    onUpdateMask(preset);
  };

  const isValid = inputValue.length === 6 && /^[01]{6}$/.test(inputValue);

  return (
    <section id="controls" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Simulation Controls
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure the hidden 6-bit secret mask, quantum shot count, and noise model.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500">Selected Mask:</span>
            <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-bold text-blue-700 tracking-wider">
              {secretMask}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 items-start">
          {/* Secret Mask Input & Presets (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div>
              <label htmlFor="secret-mask-input" className="block text-xs font-semibold text-slate-700 mb-1">
                6-Bit Binary Secret Mask (s)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="secret-mask-input"
                  type="text"
                  maxLength={6}
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="e.g. 110101"
                  className="w-full px-3 py-2 text-sm font-mono tracking-widest bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
                />
              </div>
              {errorMsg ? (
                <div className="text-[11px] text-rose-600 flex items-center gap-1 mt-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Valid 6-bit binary string</span>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Presets:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('110101')}
                className={`px-2.5 py-1 text-xs rounded-md font-mono font-medium border transition-colors ${
                  secretMask === '110101'
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                110101 (Default)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('011010')}
                className={`px-2.5 py-1 text-xs rounded-md font-mono font-medium border transition-colors ${
                  secretMask === '011010'
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                011010 (Preset 2)
              </button>
            </div>
          </div>

          {/* Shots & Noise (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div>
              <label htmlFor="shot-count-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Quantum Measurement Shots
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 512, 1024, 2048].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onChangeShots(s)}
                    className={`py-1.5 text-xs font-mono font-medium rounded-lg border transition-all text-center ${
                      shots === s
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Noise Toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={noiseEnabled}
                  onChange={(e) => onToggleNoise(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-700">
                  Noise simulation model (~3.5% depolarizing error)
                </span>
              </label>
              <p className="text-[11px] text-slate-400 pl-6 mt-0.5">
                Simulates non-ideal physical gate and readout errors on the simulator.
              </p>
            </div>
          </div>

          {/* Actions (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-2 pt-1 md:pt-4">
            <button
              onClick={onRunSimulation}
              disabled={!isValid || isRunning}
              className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunning ? 'Simulating...' : 'Run Simulation'}</span>
            </button>

            <button
              onClick={onReset}
              disabled={isRunning}
              className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
