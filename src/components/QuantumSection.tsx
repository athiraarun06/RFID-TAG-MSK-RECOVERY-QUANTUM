/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QuantumSimulationResult } from '../quantum/types';
import { Zap, CheckCircle2, HelpCircle } from 'lucide-react';

interface QuantumSectionProps {
  quantumResult: QuantumSimulationResult | null;
  secretMask: string;
}

export const QuantumSection: React.FC<QuantumSectionProps> = ({
  quantumResult,
  secretMask,
}) => {
  const activeBitIndices = secretMask
    .split('')
    .map((b, idx) => (b === '1' ? idx : -1))
    .filter((idx) => idx !== -1);

  return (
    <section id="quantum" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              Quantum Bernstein–Vazirani Circuit & Simulation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              7-qubit circuit (6 input qubits + 1 ancilla). Extracts the hidden mask in 1 oracle query per execution.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-500">Oracle Queries:</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold">
              1 per execution
            </span>
          </div>
        </div>

        {/* Quantum Circuit Diagram (SVG) */}
        <div className="pt-4">
          <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
            <span>Dynamic Quantum Circuit Diagram (7 Qubits)</span>
            <span className="text-[11px] text-slate-400 font-mono font-normal">
              CNOT Gates: {activeBitIndices.length} active controls
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="min-w-[700px]">
              <svg
                id="quantum-circuit-svg"
                className="w-full h-[290px]"
                viewBox="0 0 720 290"
                style={{ backgroundColor: '#f8fafc' }}
              >
                <defs>
                  <linearGradient id="gateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="oracleBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                </defs>

                {/* Circuit Column Headers */}
                <text x="35" y="16" fill="#64748b" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  Qubit
                </text>
                <text x="100" y="16" fill="#64748b" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  Init
                </text>
                <text x="175" y="16" fill="#2563eb" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  H⊗7
                </text>
                <text x="355" y="16" fill="#6d28d9" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  Oracle U_f (1 Query)
                </text>
                <text x="535" y="16" fill="#2563eb" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  H⊗6
                </text>
                <text x="635" y="16" fill="#059669" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  Measure
                </text>

                {/* Oracle Boundary Box */}
                <rect
                  x="240"
                  y="24"
                  width="230"
                  height="255"
                  rx="6"
                  fill="url(#oracleBg)"
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
                <text x="355" y="40" fill="#475569" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  f_s(x) = (s · x) mod 2
                </text>

                {/* 7 Qubit Wires: 6 input registers (q0..q5) and 1 ancilla (qa) */}
                {[0, 1, 2, 3, 4, 5, 6].map((qIdx) => {
                  const y = qIdx < 6 ? 48 + qIdx * 34 : 256;
                  const isAncilla = qIdx === 6;

                  return (
                    <g key={qIdx}>
                      {/* Qubit label */}
                      <text
                        x="25"
                        y={y + 4}
                        fill={isAncilla ? '#7c3aed' : '#334155'}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {isAncilla ? 'q_a' : `q_${qIdx}`}
                      </text>

                      {/* Initial state */}
                      <text
                        x="100"
                        y={y + 4}
                        fill={isAncilla ? '#7c3aed' : '#0284c7'}
                        fontSize="11"
                        fontFamily="monospace"
                      >
                        {isAncilla ? '|1⟩' : '|0⟩'}
                      </text>

                      {/* Wire line */}
                      <line
                        x1="125"
                        y1={y}
                        x2="685"
                        y2={y}
                        stroke={isAncilla ? '#a78bfa' : '#cbd5e1'}
                        strokeWidth="1.5"
                      />

                      {/* Initial Hadamard H on all 7 wires */}
                      <g transform={`translate(165, ${y - 11})`}>
                        <rect width="22" height="22" rx="3" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
                        <text x="11" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                          H
                        </text>
                      </g>

                      {/* Final Hadamard H (only on the 6 input register qubits) */}
                      {!isAncilla && (
                        <g transform={`translate(525, ${y - 11})`}>
                          <rect width="22" height="22" rx="3" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
                          <text x="11" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                            H
                          </text>
                        </g>
                      )}

                      {/* Measurement meter (only on 6 input register qubits) */}
                      {!isAncilla && (
                        <g transform={`translate(625, ${y - 11})`}>
                          <rect width="26" height="22" rx="3" fill="#ffffff" stroke="#10b981" strokeWidth="1.2" />
                          <path d="M 5 16 A 8 8 0 0 1 21 16 M 13 16 L 19 8" stroke="#059669" strokeWidth="1.2" fill="none" />
                          {quantumResult && (
                            <text x="32" y="15" fill="#059669" fontSize="11" fontFamily="monospace" fontWeight="bold">
                              ={quantumResult.recoveredMask[qIdx]}
                            </text>
                          )}
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Ancilla separator label */}
                <line x1="25" y1="230" x2="685" y2="230" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <text x="35" y="242" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
                  Ancilla register (target for phase kickback)
                </text>

                {/* CNOT Gates inside Oracle */}
                {activeBitIndices.length === 0 ? (
                  <text x="355" y="145" fill="#64748b" fontSize="11" fontFamily="sans-serif" textAnchor="middle">
                    Identity Oracle (All zeros)
                  </text>
                ) : (
                  activeBitIndices.map((bitIdx, order) => {
                    const cx = 260 + (order + 1) * (190 / (activeBitIndices.length + 1));
                    const ctrlY = 48 + bitIdx * 34;
                    const targY = 256;

                    return (
                      <g key={bitIdx}>
                        {/* Vertical connection */}
                        <line x1={cx} y1={ctrlY} x2={cx} y2={targY} stroke="#7c3aed" strokeWidth="1.5" />
                        {/* Control point on qubit bitIdx */}
                        <circle cx={cx} cy={ctrlY} r="4.5" fill="#7c3aed" />
                        <text x={cx} y={ctrlY - 7} fill="#6d28d9" fontSize="8" fontFamily="monospace" textAnchor="middle">
                          s{bitIdx}=1
                        </text>
                        {/* Target symbol on ancilla */}
                        <circle cx={cx} cy={targY} r="8" fill="#ffffff" stroke="#7c3aed" strokeWidth="1.5" />
                        <line x1={cx - 5} y1={targY} x2={cx + 5} y2={targY} stroke="#7c3aed" strokeWidth="1.5" />
                        <line x1={cx} y1={targY - 5} x2={cx} y2={targY + 5} stroke="#7c3aed" strokeWidth="1.5" />
                      </g>
                    );
                  })
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Quantum Readout Cards */}
        {quantumResult && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Selected Secret</span>
              <span className="text-sm font-mono font-bold text-slate-900 mt-1 block tracking-wider">
                {quantumResult.secretMask}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Measured Output</span>
              <span className="text-sm font-mono font-bold text-blue-700 mt-1 block tracking-wider">
                {quantumResult.recoveredMask}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Shots Sampled</span>
              <span className="text-sm font-mono font-bold text-slate-900 mt-1 block">
                {quantumResult.shots}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Target Count</span>
              <span className="text-sm font-mono font-bold text-slate-900 mt-1 block">
                {quantumResult.measuredCounts[quantumResult.secretMask] || 0} / {quantumResult.shots}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Queries / Exec.</span>
              <span className="text-sm font-mono font-bold text-blue-600 mt-1 block">
                1 Query
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Success Prob.</span>
              <span className="text-sm font-mono font-bold text-emerald-600 mt-1 block">
                {(quantumResult.successProbability * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Informative distinction callout */}
        <div className="mt-3 p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-start gap-2 text-xs text-blue-900">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>Note on shots:</strong> The {quantumResult ? quantumResult.shots : 1024} shots represent repeated measurement samplings of the quantum state to verify statistical output distribution. The Bernstein–Vazirani algorithm itself requires strictly <strong>1 oracle query</strong> per circuit execution.
          </span>
        </div>
      </div>
    </section>
  );
};
