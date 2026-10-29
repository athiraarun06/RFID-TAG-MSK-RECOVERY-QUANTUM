/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              BV
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              RFID Tag Mask Recovery
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Classical vs Quantum Recovery
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
            <span className="text-slate-400">Team:</span>
            <span className="text-slate-800 font-semibold">Athira Arun, Chelsea Reena</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-medium text-slate-600">
          <button
            onClick={() => scrollTo('controls')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Controls
          </button>
          <button
            onClick={() => scrollTo('summary')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Summary
          </button>
          <button
            onClick={() => scrollTo('oracle')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Oracle
          </button>
          <button
            onClick={() => scrollTo('classical')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Classical
          </button>
          <button
            onClick={() => scrollTo('quantum')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Quantum
          </button>
          <button
            onClick={() => scrollTo('probabilities')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Probabilities
          </button>
          <button
            onClick={() => scrollTo('visualizations')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Charts
          </button>
          <button
            onClick={() => scrollTo('comparison')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Comparison
          </button>
          <button
            onClick={() => scrollTo('downloads')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap text-blue-600 font-semibold"
          >
            Downloads
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="px-2 py-1 rounded hover:text-blue-600 hover:bg-slate-100 transition-colors whitespace-nowrap text-slate-400"
          >
            About
          </button>
        </nav>
      </div>
    </header>
  );
};
