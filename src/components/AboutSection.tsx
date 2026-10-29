/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Info } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          About and Limitations
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Algorithm</span>
            <span className="font-semibold text-slate-800">Bernstein–Vazirani</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Input size</span>
            <span className="font-semibold text-slate-800">6 bits</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Qubits</span>
            <span className="font-semibold text-slate-800">7 (6 reg + 1 ancilla)</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Environment</span>
            <span className="font-semibold text-slate-800">Quantum simulator</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Purpose</span>
            <span className="font-semibold text-slate-800">Academic demo</span>
          </div>

          <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-blue-700 block font-sans font-semibold">Team</span>
            <span className="font-semibold text-slate-900 block">Athira Arun, Chelsea Reena</span>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-100 pt-2">
          Note: Simulated mathematical model inspired by RFID tag-mask recovery. Does not scan or interface with physical commercial RFID hardware.
        </div>
      </div>
    </section>
  );
};
