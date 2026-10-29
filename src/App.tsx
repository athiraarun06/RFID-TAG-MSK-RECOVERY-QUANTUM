/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SimulationControls } from './components/SimulationControls';
import { ResultsSummary } from './components/ResultsSummary';
import { OracleSimulator } from './components/OracleSimulator';
import { ClassicalSection } from './components/ClassicalSection';
import { QuantumSection } from './components/QuantumSection';
import { ProbabilityTable } from './components/ProbabilityTable';
import { Visualizations } from './components/Visualizations';
import { ComparisonSection } from './components/ComparisonSection';
import { DownloadsSection } from './components/DownloadsSection';
import { AboutSection } from './components/AboutSection';
import { runBernsteinVaziraniSimulation, runClassicalRecovery } from './quantum/simulator';
import { ClassicalSimulationResult, QuantumSimulationResult } from './quantum/types';

export default function App() {
  // Default secret mask: '110101'
  const [secretMask, setSecretMask] = useState<string>('110101');
  const [shots, setShots] = useState<number>(1024);
  const [noiseEnabled, setNoiseEnabled] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Simulation outputs
  const [classicalResult, setClassicalResult] = useState<ClassicalSimulationResult | null>(null);
  const [quantumResult, setQuantumResult] = useState<QuantumSimulationResult | null>(null);

  // Run simulation helper
  const executeSimulation = (mask: string, shotCount: number, noise: boolean) => {
    setIsRunning(true);
    setTimeout(() => {
      const cRes = runClassicalRecovery(mask);
      const qRes = runBernsteinVaziraniSimulation(mask, shotCount, noise);
      setClassicalResult(cRes);
      setQuantumResult(qRes);
      setIsRunning(false);
    }, 60);
  };

  // Initial load simulation with default parameters
  useEffect(() => {
    executeSimulation('110101', 1024, false);
  }, []);

  const handleRunSimulation = () => {
    executeSimulation(secretMask, shots, noiseEnabled);
  };

  const handleReset = () => {
    setSecretMask('110101');
    setShots(1024);
    setNoiseEnabled(false);
    executeSimulation('110101', 1024, false);
  };

  const handleUpdateMask = (newMask: string) => {
    setSecretMask(newMask);
    executeSimulation(newMask, shots, noiseEnabled);
  };

  const handleChangeShots = (newShots: number) => {
    setShots(newShots);
    executeSimulation(secretMask, newShots, noiseEnabled);
  };

  const handleToggleNoise = (enabled: boolean) => {
    setNoiseEnabled(enabled);
    executeSimulation(secretMask, shots, enabled);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header and Navigation */}
      <Navbar />

      {/* Main Single-Page Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 2. Simulation Controls */}
        <SimulationControls
          secretMask={secretMask}
          onUpdateMask={handleUpdateMask}
          shots={shots}
          onChangeShots={handleChangeShots}
          noiseEnabled={noiseEnabled}
          onToggleNoise={handleToggleNoise}
          onRunSimulation={handleRunSimulation}
          onReset={handleReset}
          isRunning={isRunning}
        />

        {/* 3. Results Summary */}
        <ResultsSummary
          secretMask={secretMask}
          classicalResult={classicalResult}
          quantumResult={quantumResult}
        />

        {/* 4. Oracle Simulator */}
        <OracleSimulator secretMask={secretMask} />

        {/* 5. Classical Recovery */}
        <ClassicalSection
          classicalResult={classicalResult}
          secretMask={secretMask}
        />

        {/* 6. Quantum Circuit and Simulation */}
        <QuantumSection
          quantumResult={quantumResult}
          secretMask={secretMask}
        />

        {/* 7. Probability Analysis (All 64 States) */}
        {quantumResult && (
          <ProbabilityTable
            probabilities64={quantumResult.probabilities64}
            secretMask={secretMask}
            shots={quantumResult.shots}
          />
        )}

        {/* 8. Graphical Visualizations */}
        <Visualizations
          quantumResult={quantumResult}
          classicalResult={classicalResult}
          secretMask={secretMask}
        />

        {/* 9. Classical vs Quantum Comparison */}
        <ComparisonSection
          classicalResult={classicalResult}
          quantumResult={quantumResult}
          maskLength={6}
        />

        {/* 10. Downloads */}
        <DownloadsSection
          secretMask={secretMask}
          classicalResult={classicalResult}
          quantumResult={quantumResult}
        />

        {/* 11. About and Limitations */}
        <AboutSection />
      </main>

      {/* Small Clean Academic Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-medium text-slate-700">RFID Tag Mask Recovery Using the Bernstein–Vazirani Algorithm</span>
            <span className="text-slate-400 mx-1.5">•</span>
            <span className="text-blue-700 font-semibold">Team: Athira Arun, Chelsea Reena</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Academic Project Demonstration • 7-Qubit State Vector Simulator
          </span>
        </div>
      </footer>
    </div>
  );
}
