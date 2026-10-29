/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClassicalSimulationResult } from '../quantum/types';
import { Cpu, CheckCircle2, XCircle } from 'lucide-react';

interface ClassicalSectionProps {
  classicalResult: ClassicalSimulationResult | null;
  secretMask: string;
}

export const ClassicalSection: React.FC<ClassicalSectionProps> = ({
  classicalResult,
  secretMask,
}) => {
  return (
    <section id="classical" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              Classical Recovery Algorithm
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Queries the 6 standard-basis inputs sequentially to reconstruct the hidden mask bit-by-bit.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="font-mono text-slate-600">
              Oracle Queries: <strong className="text-slate-900">6</strong>
            </div>
            {classicalResult && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  classicalResult.isMatch
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {classicalResult.isMatch ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Matches Secret
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Mismatch
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Query Table */}
        <div className="pt-4">
          <div className="overflow-x-auto rounded-lg border border-slate-200 text-xs">
            <table className="w-full text-left font-mono border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Query #</th>
                  <th className="py-2.5 px-3">6-Bit Input (x)</th>
                  <th className="py-2.5 px-3">Evaluation Formula</th>
                  <th className="py-2.5 px-3 text-center">Oracle Output</th>
                  <th className="py-2.5 px-3 text-center">Recovered Bit</th>
                  <th className="py-2.5 px-3">Reconstructed Secret</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {!classicalResult ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-sans">
                      Run the simulation to view classical queries.
                    </td>
                  </tr>
                ) : (
                  classicalResult.queries.map((q) => (
                    <tr key={q.queryIndex} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 text-slate-400">Query {q.queryIndex}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{q.queryInput}</td>
                      <td className="py-2 px-3 text-slate-500 font-sans text-[11px]">
                        (s · e{q.extractedBitIndex}) mod 2
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-900 font-bold">
                          {q.oracleOutput}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center text-blue-700 font-semibold">
                        s_{q.extractedBitIndex} = {q.extractedBitValue}
                      </td>
                      <td className="py-2 px-3 tracking-widest font-bold text-slate-800">
                        {q.partialSecret}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Recovery Footer */}
          {classicalResult && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <span className="text-slate-600">
                Recovered Mask:{' '}
                <strong className="font-mono text-slate-900 text-sm ml-1">
                  {classicalResult.recoveredMask}
                </strong>
              </span>
              <span className="text-slate-500">
                Total Queries Required: <strong className="text-slate-900 font-mono">6</strong> (1 bit per classical query)
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
