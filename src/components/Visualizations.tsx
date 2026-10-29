/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { QuantumSimulationResult, ClassicalSimulationResult } from '../quantum/types';
import { BarChart3, TrendingUp, Scale } from 'lucide-react';

interface VisualizationsProps {
  quantumResult: QuantumSimulationResult | null;
  classicalResult: ClassicalSimulationResult | null;
  secretMask: string;
}

export const Visualizations: React.FC<VisualizationsProps> = ({
  quantumResult,
  classicalResult,
  secretMask,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // If results exist, let's also render to canvas so export is ready
  useEffect(() => {
    if (!canvasRef.current || !quantumResult) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions
    canvas.width = 800;
    canvas.height = 400;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Measurement Frequency & Probability Distribution', 30, 35);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Secret Mask: ${secretMask} | Shots: ${quantumResult.shots} | Queries: 1`, 30, 55);

    // Draw active states
    const activeStates = quantumResult.probabilities64
      .filter((p) => p.measuredCount > 0 || p.bitstring === secretMask)
      .slice(0, 10);

    const startX = 60;
    const startY = 320;
    const chartHeight = 220;
    const barWidth = Math.min(50, Math.floor(650 / (activeStates.length * 2 + 1)));

    // Axes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(750, startY);
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY - chartHeight);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText('Probability', 10, startY - chartHeight - 10);

    activeStates.forEach((st, i) => {
      const x = startX + 25 + i * (barWidth * 2 + 15);
      const isTarget = st.bitstring === secretMask;

      // Theoretical bar (light blue)
      const theoHeight = Math.round(st.theoreticalProbability * chartHeight);
      ctx.fillStyle = isTarget ? '#93c5fd' : '#e2e8f0';
      ctx.fillRect(x, startY - theoHeight, barWidth, theoHeight);

      // Simulated bar (dark blue)
      const simHeight = Math.round(st.simulatedProbability * chartHeight);
      ctx.fillStyle = isTarget ? '#2563eb' : '#64748b';
      ctx.fillRect(x + barWidth, startY - simHeight, barWidth, simHeight);

      // X label
      ctx.fillStyle = isTarget ? '#1e3a8a' : '#334155';
      ctx.font = isTarget ? 'bold 10px monospace' : '10px monospace';
      ctx.fillText(st.bitstring, x, startY + 18);

      // Percentage label
      const pct = (st.simulatedProbability * 100).toFixed(1) + '%';
      ctx.fillText(pct, x, startY - simHeight - 5);
    });

    // Legend
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(520, 25, 12, 12);
    ctx.fillStyle = '#475569';
    ctx.font = '11px sans-serif';
    ctx.fillText('Theoretical Prob.', 540, 35);

    ctx.fillStyle = '#2563eb';
    ctx.fillRect(660, 25, 12, 12);
    ctx.fillStyle = '#475569';
    ctx.fillText('Simulated Prob.', 680, 35);
  }, [quantumResult, secretMask]);

  if (!quantumResult) {
    return (
      <section id="visualizations" className="scroll-mt-20">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-xs">
          Run the simulation to generate visualizations.
        </div>
      </section>
    );
  }

  // Active states for display
  const topOutcomes = quantumResult.probabilities64
    .filter((p) => p.measuredCount > 0 || p.bitstring === secretMask)
    .sort((a, b) => b.measuredCount - a.measuredCount)
    .slice(0, 6);

  const classicalQueries = classicalResult?.oracleQueryCount ?? 6;
  const quantumQueries = quantumResult.oracleQueriesPerExecution;

  return (
    <section id="visualizations" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Graphical Visualizations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical measurement frequencies, theoretical probability distribution, and oracle query comparison.
            </p>
          </div>
        </div>

        {/* Hidden Canvas for High-Res PNG Export */}
        <canvas ref={canvasRef} id="probability-chart-canvas" className="hidden" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chart A & B: Measurement Frequency & Theoretical Comparison (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  A & B. Measurement Frequency & Probability Distribution
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Comparison between theoretical quantum expectation and actual measured counts ({quantumResult.shots} shots).
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-600 font-sans">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-300"></span>
                  Theoretical
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-600"></span>
                  Simulated
                </span>
              </div>
            </div>

            {/* Visual Bar Spectrum */}
            <div className="space-y-3 pt-2">
              {topOutcomes.map((item) => {
                const isTarget = item.bitstring === secretMask;
                const theoPct = item.theoreticalProbability * 100;
                const simPct = item.simulatedProbability * 100;

                return (
                  <div key={item.bitstring} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold flex items-center gap-1.5">
                        <span className={isTarget ? 'text-blue-700 font-extrabold' : 'text-slate-700'}>
                          |{item.bitstring}⟩
                        </span>
                        {isTarget && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-sans font-semibold">
                            Secret Target
                          </span>
                        )}
                      </span>
                      <span className="text-slate-500 font-sans text-[11px]">
                        Count: <strong className="font-mono text-slate-900">{item.measuredCount}</strong> / {quantumResult.shots} ({simPct.toFixed(1)}%)
                      </span>
                    </div>

                    {/* Dual comparative bar */}
                    <div className="space-y-1">
                      {/* Theoretical bar */}
                      <div className="flex items-center gap-2">
                        <span className="w-16 text-[10px] text-slate-400 font-sans">Theoretical:</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-300 rounded-full transition-all"
                            style={{ width: `${Math.max(theoPct, 1)}%` }}
                          />
                        </div>
                        <span className="w-10 text-[10px] text-right font-mono text-slate-500">
                          {theoPct.toFixed(1)}%
                        </span>
                      </div>

                      {/* Simulated bar */}
                      <div className="flex items-center gap-2">
                        <span className="w-16 text-[10px] text-slate-400 font-sans">Simulated:</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isTarget ? 'bg-blue-600' : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.max(simPct, 1)}%` }}
                          />
                        </div>
                        <span className="w-10 text-[10px] text-right font-mono font-bold text-slate-700">
                          {simPct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart C: Classical vs Quantum Query Comparison (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                C. Classical vs. Quantum Query Comparison
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Comparison of required black-box oracle queries to reconstruct the 6-bit mask.
              </p>

              <div className="mt-5 space-y-4">
                {/* Classical Query Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-700 font-semibold">Classical Method</span>
                    <span className="font-bold text-slate-900">{classicalQueries} Queries (100%)</span>
                  </div>
                  <div className="w-full h-7 bg-white rounded-lg p-1 border border-slate-200">
                    <div
                      className="h-full rounded bg-slate-400 flex items-center justify-end pr-2 text-xs font-mono font-bold text-white"
                      style={{ width: '100%' }}
                    >
                      6 Queries
                    </div>
                  </div>
                </div>

                {/* Quantum Query Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-blue-700 font-semibold">Bernstein–Vazirani</span>
                    <span className="font-bold text-blue-700">{quantumQueries} Query (16.67%)</span>
                  </div>
                  <div className="w-full h-7 bg-white rounded-lg p-1 border border-slate-200">
                    <div
                      className="h-full rounded bg-blue-600 flex items-center justify-end pr-2 text-xs font-mono font-bold text-white"
                      style={{ width: '16.67%' }}
                    >
                      1
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Callout Card */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-900 block">
                Query Reduction Summary:
              </span>
              <p className="text-xs text-slate-600">
                <strong className="text-blue-700 font-bold">83.33% fewer oracle queries</strong> for a 6-bit mask.
              </p>
              <p className="text-[11px] text-slate-400">
                5 oracle calls saved (1 quantum query vs. 6 classical queries).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
