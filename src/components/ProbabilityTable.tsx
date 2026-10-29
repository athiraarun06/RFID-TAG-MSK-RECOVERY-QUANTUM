/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProbabilityRecord } from '../quantum/types';
import { Table, Search, Filter } from 'lucide-react';

interface ProbabilityTableProps {
  probabilities64: ProbabilityRecord[];
  secretMask: string;
  shots: number;
}

export const ProbabilityTable: React.FC<ProbabilityTableProps> = ({
  probabilities64,
  secretMask,
  shots,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [onlyNonZero, setOnlyNonZero] = useState<boolean>(false);

  const filtered = probabilities64.filter((p) => {
    const matchesSearch = p.bitstring.includes(searchTerm);
    const matchesNonZero = onlyNonZero ? p.measuredCount > 0 : true;
    return matchesSearch && matchesNonZero;
  });

  return (
    <section id="probabilities" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-600" />
              Probability Analysis (All 64 Computational Basis States)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison between theoretical quantum predictions and simulated measurement counts ({shots} shots).
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.replace(/[^01]/g, ''))}
                placeholder="Filter bitstring..."
                className="w-32 sm:w-36 px-2.5 py-1 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setOnlyNonZero(!onlyNonZero)}
              className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
                onlyNonZero
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {onlyNonZero ? 'Showing Non-Zero Only' : 'Show All 64'}
            </button>
          </div>
        </div>

        {/* 64-Row Table Container */}
        <div className="pt-4">
          <div className="overflow-x-auto rounded-lg border border-slate-200 max-h-80 overflow-y-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase z-10">
                <tr>
                  <th className="py-2.5 px-3">State #</th>
                  <th className="py-2.5 px-3">Output Bitstring</th>
                  <th className="py-2.5 px-3 text-right">Theoretical Prob.</th>
                  <th className="py-2.5 px-3 text-right">Simulated Prob.</th>
                  <th className="py-2.5 px-3 text-right">Measured Count</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((item, idx) => {
                  const isTarget = item.bitstring === secretMask;
                  const hasCounts = item.measuredCount > 0;

                  return (
                    <tr
                      key={item.bitstring}
                      className={`transition-colors ${
                        isTarget
                          ? 'bg-blue-50/80 font-bold text-blue-900'
                          : hasCounts
                          ? 'bg-slate-50/60 text-slate-800'
                          : 'hover:bg-slate-50/40 text-slate-500'
                      }`}
                    >
                      <td className="py-1.5 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-1.5 px-3">
                        <span className="font-bold tracking-wider">{item.bitstring}</span>
                        {isTarget && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 font-sans font-semibold">
                            Target Mask s
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        {item.theoreticalProbability.toFixed(4)}
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        {item.simulatedProbability.toFixed(4)}
                      </td>
                      <td className="py-1.5 px-3 text-right font-bold">
                        {item.measuredCount}
                      </td>
                      <td className="py-1.5 px-3 text-center font-sans text-[11px]">
                        {isTarget ? (
                          <span className="text-emerald-700 font-semibold">Secret Match</span>
                        ) : hasCounts ? (
                          <span className="text-amber-600">Noise / Error</span>
                        ) : (
                          <span className="text-slate-400">0%</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Showing {filtered.length} of {probabilities64.length} states</span>
            <span>Sum of measured counts: {probabilities64.reduce((acc, p) => acc + p.measuredCount, 0)} / {shots}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
