/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { evaluateRFIDOracle } from '../quantum/simulator';
import { Binary, Calculator, Check, ArrowRight } from 'lucide-react';

interface OracleSimulatorProps {
  secretMask: string;
}

export const OracleSimulator: React.FC<OracleSimulatorProps> = ({ secretMask }) => {
  const [queryInput, setQueryInput] = useState<string>('100000');
  const [evaluationResult, setEvaluationResult] = useState<{
    query: string;
    output: number;
    explanation: string;
  }>({
    query: '100000',
    output: evaluateRFIDOracle(secretMask, '100000'),
    explanation: `(${secretMask} · 100000) mod 2 = ${evaluateRFIDOracle(secretMask, '100000')}`,
  });

  const handleEvaluate = () => {
    const clean = queryInput.replace(/[^01]/g, '').slice(0, 6);
    if (clean.length === 6) {
      const output = evaluateRFIDOracle(secretMask, clean);
      setEvaluationResult({
        query: clean,
        output,
        explanation: `(${secretMask} · ${clean}) mod 2 = ${output}`,
      });
    }
  };

  const handleQuickBasisClick = (basisInput: string) => {
    setQueryInput(basisInput);
    const output = evaluateRFIDOracle(secretMask, basisInput);
    setEvaluationResult({
      query: basisInput,
      output,
      explanation: `(${secretMask} · ${basisInput}) mod 2 = ${output}`,
    });
  };

  const standardQueries = [
    { input: '100000', label: 'e0', bitIndex: 0 },
    { input: '010000', label: 'e1', bitIndex: 1 },
    { input: '001000', label: 'e2', bitIndex: 2 },
    { input: '000100', label: 'e3', bitIndex: 3 },
    { input: '000010', label: 'e4', bitIndex: 4 },
    { input: '000001', label: 'e5', bitIndex: 5 },
  ];

  return (
    <section id="oracle" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Binary className="w-4 h-4 text-blue-600" />
              Boolean Oracle Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates <code className="text-blue-700 font-mono font-medium">f_s(x) = (s · x) mod 2</code> for any 6-bit challenge vector.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Active Mask s:</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold tracking-wider">
              {secretMask}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 items-start">
          {/* Interactive Tester (6 cols) */}
          <div className="md:col-span-6 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label htmlFor="custom-query-input" className="block text-xs font-semibold text-slate-700">
              Interactive 6-Bit Query Input (x)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="custom-query-input"
                type="text"
                maxLength={6}
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value.replace(/[^01]/g, '').slice(0, 6))}
                placeholder="100000"
                className="w-full px-3 py-1.5 text-xs font-mono tracking-widest bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
              <button
                onClick={handleEvaluate}
                disabled={queryInput.length !== 6}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Evaluate Oracle
              </button>
            </div>

            {/* Calculated Output Readout */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Calculated Oracle Response</span>
                <span className="text-xs font-mono text-slate-600 mt-0.5 block">
                  {evaluationResult.explanation}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">f_s(x) =</span>
                <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-base flex items-center justify-center">
                  {evaluationResult.output}
                </span>
              </div>
            </div>
          </div>

          {/* Standard Basis Reference Table (6 cols) */}
          <div className="md:col-span-6">
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>Standard-Basis Challenge Vectors (e₀ to e₅)</span>
              <span className="text-[11px] text-slate-400 font-normal">Click any row to test</span>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 text-xs">
              <table className="w-full text-left font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase">
                    <th className="py-2 px-3">Basis</th>
                    <th className="py-2 px-3">Vector x</th>
                    <th className="py-2 px-3 text-center">Output f_s(x)</th>
                    <th className="py-2 px-3 text-right">Revealed Bit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {standardQueries.map((q) => {
                    const out = evaluateRFIDOracle(secretMask, q.input);
                    const isSelected = evaluationResult.query === q.input;
                    return (
                      <tr
                        key={q.input}
                        onClick={() => handleQuickBasisClick(q.input)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/70 font-semibold text-blue-900' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-1.5 px-3 text-slate-400">{q.label}</td>
                        <td className="py-1.5 px-3 font-bold text-slate-700">{q.input}</td>
                        <td className="py-1.5 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold">
                            {out}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-right text-blue-600">
                          s_{q.bitIndex} = {out}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
