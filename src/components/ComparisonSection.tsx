/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClassicalSimulationResult, QuantumSimulationResult } from '../quantum/types';
import { Scale, Info } from 'lucide-react';

interface ComparisonSectionProps {
  classicalResult: ClassicalSimulationResult | null;
  quantumResult: QuantumSimulationResult | null;
  maskLength?: number;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  classicalResult,
  quantumResult,
  maskLength = 6,
}) => {
  const classicalQueries = maskLength;
  const quantumQueries = 1;
  const reductionPercentage = (((classicalQueries - quantumQueries) / classicalQueries) * 100).toFixed(2);

  return (
    <section id="comparison" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              Classical vs. Quantum Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct evaluation of computational query complexity and algorithmic strategy.
            </p>
          </div>
        </div>

        {/* Compact Comparison Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase">
                <th className="py-2.5 px-4 font-semibold">Metric</th>
                <th className="py-2.5 px-4 font-semibold text-slate-700">Classical Algorithm</th>
                <th className="py-2.5 px-4 font-semibold text-blue-700">Quantum Bernstein–Vazirani</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-600">Number of oracle queries</td>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                  {classicalQueries}
                </td>
                <td className="py-2.5 px-4 font-mono font-bold text-blue-700">
                  {quantumQueries} per circuit execution
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-600">Recovery method</td>
                <td className="py-2.5 px-4 text-slate-700">
                  Individual bit queries (standard basis)
                </td>
                <td className="py-2.5 px-4 text-blue-800">
                  Bernstein–Vazirani circuit (Hadamard & phase kickback)
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-600">Recovered result</td>
                <td className="py-2.5 px-4 font-mono text-slate-800 font-bold">
                  {classicalResult ? classicalResult.recoveredMask : 'Calculated mask'}
                </td>
                <td className="py-2.5 px-4 font-mono text-blue-700 font-bold">
                  {quantumResult ? quantumResult.recoveredMask : 'Measured mask'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-600">Query complexity</td>
                <td className="py-2.5 px-4 font-mono text-slate-700">O(n)</td>
                <td className="py-2.5 px-4 font-mono text-blue-700">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Required Prominent Statement */}
        <div className="p-3.5 bg-blue-50/80 rounded-lg border border-blue-200 text-center">
          <span className="text-sm font-bold text-blue-900">
            {reductionPercentage}% fewer oracle queries for a six-bit mask.
          </span>
        </div>

        {/* Clarification Note */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Academic note:</strong> This reduction represents an algorithmic query-complexity advantage (1 query vs. 6 queries). It does not imply an 83.33% reduction in physical execution time or instantaneous real-world hardware speed, due to quantum circuit compilation, calibration, and measurement overhead.
          </span>
        </div>
      </div>
    </section>
  );
};
