/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProbabilityRecord {
  bitstring: string;
  theoreticalProbability: number;
  simulatedProbability: number;
  measuredCount: number;
}

export interface ClassicalQueryRecord {
  queryIndex: number;
  queryInput: string;
  oracleOutput: number;
  extractedBitIndex: number;
  extractedBitValue: number;
  partialSecret: string;
}

export interface ClassicalSimulationResult {
  secretMask: string;
  recoveredMask: string;
  oracleQueryCount: number;
  queries: ClassicalQueryRecord[];
  isMatch: boolean;
  executionTimeMs: number;
}

export interface QuantumSimulationResult {
  secretMask: string;
  recoveredMask: string;
  shots: number;
  noiseEnabled: boolean;
  noiseRate: number;
  oracleQueriesPerExecution: number;
  successProbability: number;
  isMatch: boolean;
  measuredCounts: Record<string, number>;
  probabilities64: ProbabilityRecord[];
  topOutcomes: { bitstring: string; count: number; percentage: number }[];
  executionTimeMs: number;
  gateCount: {
    hadamard: number;
    pauliX: number;
    cnot: number;
    measurement: number;
    total: number;
  };
}
