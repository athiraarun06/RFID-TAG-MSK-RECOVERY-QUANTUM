/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClassicalSimulationResult, QuantumSimulationResult } from '../quantum/types';
import { Download, FileText, FileSpreadsheet, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface DownloadsSectionProps {
  secretMask: string;
  classicalResult: ClassicalSimulationResult | null;
  quantumResult: QuantumSimulationResult | null;
}

export const DownloadsSection: React.FC<DownloadsSectionProps> = ({
  secretMask,
  classicalResult,
  quantumResult,
}) => {
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadMsg(`Downloaded ${filename}`);
    setTimeout(() => setDownloadMsg(null), 3000);
  };

  // 1. Download Results CSV
  const handleDownloadCSV = () => {
    if (!quantumResult) return;
    const header = 'output_bitstring,theoretical_probability,simulated_probability,measured_count\n';
    const rows = quantumResult.probabilities64
      .map(
        (p) =>
          `${p.bitstring},${p.theoreticalProbability.toFixed(6)},${p.simulatedProbability.toFixed(
            6
          )},${p.measuredCount}`
      )
      .join('\n');

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `rfid_mask_recovery_results_${secretMask}.csv`);
  };

  // 2. Download Summary TXT
  const handleDownloadSummaryTXT = () => {
    if (!quantumResult) return;
    const isMatch =
      classicalResult?.recoveredMask === secretMask && quantumResult.recoveredMask === secretMask;

    const content = `=====================================================
RFID TAG MASK RECOVERY PROJECT - SIMULATION SUMMARY
Bernstein–Vazirani Algorithm vs. Classical Probing
Project Team: Athira Arun, Chelsea Reena
=====================================================

Selected Secret Mask:               ${secretMask}
Classical Recovered Mask:           ${classicalResult ? classicalResult.recoveredMask : 'N/A'}
Quantum Recovered Mask:             ${quantumResult.recoveredMask}
Verification Status:                ${isMatch ? 'VERIFIED MATCH' : 'DISCREPANCY'}

Simulation Parameters:
- Shots Sampled:                    ${quantumResult.shots}
- Noise Simulation:                 ${quantumResult.noiseEnabled ? 'Enabled (~3.5% error)' : 'Disabled (Ideal noiseless)'}
- Quantum Success Probability:      ${(quantumResult.successProbability * 100).toFixed(2)}%

Oracle Query Analysis:
- Classical Oracle Queries:         ${classicalResult ? classicalResult.oracleQueryCount : 6}
- Quantum Queries / Circuit Run:    ${quantumResult.oracleQueriesPerExecution}
- Query Reduction Percentage:       83.33% fewer queries for a 6-bit mask
- Algorithmic Complexity:           Classical O(n) vs. Quantum O(1)

Generated at: ${new Date().toISOString()}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    triggerDownload(blob, `rfid_mask_recovery_summary_${secretMask}.txt`);
  };

  // 3. Download Probability Chart PNG
  const handleDownloadChartPNG = () => {
    const canvas = document.getElementById('probability-chart-canvas') as HTMLCanvasElement;
    if (!canvas) {
      alert('Chart canvas is not rendered yet. Please run simulation.');
      return;
    }
    canvas.toBlob((blob) => {
      if (blob) {
        triggerDownload(blob, `rfid_probability_chart_${secretMask}.png`);
      }
    }, 'image/png');
  };

  // 4. Download Quantum Circuit PNG
  const handleDownloadCircuitPNG = () => {
    const svgElement = document.getElementById('quantum-circuit-svg') as SVGSVGElement | null;
    if (!svgElement) {
      alert('Circuit diagram not found.');
      return;
    }

    try {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);

      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const offscreenCanvas = document.createElement('canvas');
        const scale = 2; // High-res 2x
        offscreenCanvas.width = 720 * scale;
        offscreenCanvas.height = 290 * scale;
        const ctx = offscreenCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0);
          offscreenCanvas.toBlob((pngBlob) => {
            if (pngBlob) {
              triggerDownload(pngBlob, `rfid_quantum_circuit_${secretMask}.png`);
            }
            URL.revokeObjectURL(url);
          }, 'image/png');
        }
      };
      img.src = url;
    } catch (e) {
      console.error('Error generating circuit PNG', e);
    }
  };

  const hasResults = Boolean(quantumResult);

  return (
    <section id="downloads" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              Downloads & Export
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Export data, simulation summaries, and visual diagrams from the latest run.
            </p>
          </div>

          {downloadMsg && (
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
              ✓ {downloadMsg}
            </span>
          )}
        </div>

        {!hasResults ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
            Please run the simulation first to enable downloads. All exports will be generated from your active simulation run.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Results CSV */}
            <button
              onClick={handleDownloadCSV}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-300 text-left transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500">
                  CSV
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block">
                  Download Results CSV
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  All 64 bitstrings, theoretical & simulated probabilities, counts.
                </span>
              </div>
            </button>

            {/* 2. Summary TXT */}
            <button
              onClick={handleDownloadSummaryTXT}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-300 text-left transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500">
                  TXT
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block">
                  Download Summary TXT
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Masks, query counts, success prob, and verification record.
                </span>
              </div>
            </button>

            {/* 3. Probability Chart PNG */}
            <button
              onClick={handleDownloadChartPNG}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-300 text-left transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500">
                  PNG
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block">
                  Download Probability Chart
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  High-resolution PNG of the measurement distribution chart.
                </span>
              </div>
            </button>

            {/* 4. Quantum Circuit PNG */}
            <button
              onClick={handleDownloadCircuitPNG}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-300 text-left transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <ImageIcon className="w-5 h-5 text-violet-600" />
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500">
                  PNG
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block">
                  Download Quantum Circuit
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Export 7-qubit circuit diagram with gates and oracle CNOTs.
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
