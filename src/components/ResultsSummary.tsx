/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClassicalSimulationResult, QuantumSimulationResult } from '../quantum/types';
import { CheckCircle2, XCircle, Award, HelpCircle } from 'lucide-react';

interface ResultsSummaryProps {
  secretMask: string;
  classicalResult: ClassicalSimulationResult | null;
  quantumResult: QuantumSimulationResult | null;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  secretMask,
  classicalResult,
  quantumResult,
}) => {
  if (!classicalResult && !quantumResult) {
    return (
      <section id="summary" className="scroll-mt-20">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-xs">
          Click <strong className="text-blue-600 font-semibold">&ldquo;Run Simulation&rdquo;</strong> to view the results summary.
        </div>
      </section>
    );
  }

  const classicalMatch = classicalResult?.isMatch ?? false;
  const quantumMatch = quantumResult?.isMatch ?? false;
  const allVerified = classicalMatch && quantumMatch;

  return (
    <section id="summary" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Results Summary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified outcomes for classical and quantum oracle executions.
            </p>
          </div>

          <div>
            {allVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verification Status: Success (Both Match)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                <XCircle className="w-3.5 h-3.5 text-amber-600" />
                Verification Status: Partial / Discrepancy
              </span>
            )}
          </div>
        </div>

        {/* 7 Summary Items in a Neat Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 text-xs">
          {/* Selected Secret Mask */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium block">Selected Secret Mask</span>
            <div className="text-lg font-mono font-bold text-slate-900 mt-1 tracking-wider">
              {secretMask}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Expected target mask</span>
          </div>

          {/* Classical Recovered Mask */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium block">Classical Recovered Mask</span>
            <div className="text-lg font-mono font-bold text-slate-800 mt-1 tracking-wider flex items-center gap-1.5">
              <span>{classicalResult ? classicalResult.recoveredMask : '—'}</span>
              {classicalResult && (
                classicalMatch ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )
              )}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">6 sequential queries</span>
          </div>

          {/* Quantum Recovered Mask */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium block">Quantum Recovered Mask</span>
            <div className="text-lg font-mono font-bold text-blue-700 mt-1 tracking-wider flex items-center gap-1.5">
              <span>{quantumResult ? quantumResult.recoveredMask : '—'}</span>
              {quantumResult && (
                quantumMatch ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )
              )}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">1 query per execution</span>
          </div>

          {/* Classical Query Count */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium block">Classical Oracle Queries</span>
            <div className="text-lg font-mono font-bold text-slate-900 mt-1">
              {classicalResult ? classicalResult.oracleQueryCount : '—'}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Standard-basis probes</span>
          </div>

          {/* Quantum Queries Per Execution */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium block">Quantum Queries / Execution</span>
            <div className="text-lg font-mono font-bold text-blue-600 mt-1">
              {quantumResult ? `${quantumResult.oracleQueriesPerExecution}` : '—'}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Single oracle invocation</span>
          </div>

          {/* Quantum Success Probability */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium block">Quantum Success Probability</span>
            <div className="text-lg font-mono font-bold text-emerald-600 mt-1">
              {quantumResult ? `${(quantumResult.successProbability * 100).toFixed(1)}%` : '—'}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {quantumResult?.noiseEnabled ? 'Noise model enabled' : '1.000 (Ideal noiseless)'}
            </span>
          </div>

          {/* Shots & Samples */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-slate-500 font-medium block">Measurement Shots</span>
            <div className="text-lg font-mono font-bold text-indigo-700 mt-1">
              {quantumResult ? `${quantumResult.shots}` : '—'}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Repeated state readings</span>
          </div>
        </div>
      </div>
    </section>
  );
};
