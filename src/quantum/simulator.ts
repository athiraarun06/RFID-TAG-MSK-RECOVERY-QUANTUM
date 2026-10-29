/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ClassicalSimulationResult,
  ClassicalQueryRecord,
  QuantumSimulationResult,
  ProbabilityRecord,
} from './types';

/**
 * 7-Qubit Quantum State Vector Simulator
 * Simulates 2^7 = 128 complex amplitudes:
 * - 6 input register qubits: q0 (MSB) to q5 (LSB)
 * - 1 ancilla qubit: q6 (index 6)
 */
export class QuantumStateVector {
  readonly numQubits = 7;
  readonly dim = 128; // 2^7
  real: Float64Array;
  imag: Float64Array;

  constructor() {
    this.real = new Float64Array(this.dim);
    this.imag = new Float64Array(this.dim);
    // Initialize in |0000000>
    this.real[0] = 1.0;
  }

  clone(): QuantumStateVector {
    const copy = new QuantumStateVector();
    copy.real.set(this.real);
    copy.imag.set(this.imag);
    return copy;
  }

  /**
   * Apply Pauli-X (NOT) to qubit i (0 to 6)
   */
  applyX(qubitIndex: number): void {
    const bitMask = 1 << (6 - qubitIndex);
    for (let k = 0; k < this.dim; k++) {
      if ((k & bitMask) === 0) {
        const k0 = k;
        const k1 = k | bitMask;
        const tempR = this.real[k0];
        const tempI = this.imag[k0];
        this.real[k0] = this.real[k1];
        this.imag[k0] = this.imag[k1];
        this.real[k1] = tempR;
        this.imag[k1] = tempI;
      }
    }
  }

  /**
   * Apply Hadamard H to qubit i (0 to 6)
   * H = 1/sqrt(2) * [[1, 1], [1, -1]]
   */
  applyHadamard(qubitIndex: number): void {
    const bitMask = 1 << (6 - qubitIndex);
    const invSqrt2 = Math.SQRT1_2;

    for (let k = 0; k < this.dim; k++) {
      if ((k & bitMask) === 0) {
        const k0 = k;
        const k1 = k | bitMask;

        const r0 = this.real[k0];
        const i0 = this.imag[k0];
        const r1 = this.real[k1];
        const i1 = this.imag[k1];

        this.real[k0] = (r0 + r1) * invSqrt2;
        this.imag[k0] = (i0 + i1) * invSqrt2;
        this.real[k1] = (r0 - r1) * invSqrt2;
        this.imag[k1] = (i0 - i1) * invSqrt2;
      }
    }
  }

  /**
   * Apply Controlled-NOT (CNOT) gate
   * @param controlQubit index 0 to 6
   * @param targetQubit index 0 to 6
   */
  applyCNOT(controlQubit: number, targetQubit: number): void {
    const ctrlMask = 1 << (6 - controlQubit);
    const targMask = 1 << (6 - targetQubit);

    for (let k = 0; k < this.dim; k++) {
      if ((k & ctrlMask) !== 0 && (k & targMask) === 0) {
        const k0 = k;
        const k1 = k | targMask;
        const tempR = this.real[k0];
        const tempI = this.imag[k0];
        this.real[k0] = this.real[k1];
        this.imag[k0] = this.imag[k1];
        this.real[k1] = tempR;
        this.imag[k1] = tempI;
      }
    }
  }

  /**
   * Calculate probability distribution over the 6-qubit register (64 states)
   * Traces out the ancilla qubit (q6)
   */
  getInputRegisterProbabilities(): number[] {
    const probs = new Array<number>(64).fill(0);
    for (let reg = 0; reg < 64; reg++) {
      const idx0 = (reg << 1) | 0; // ancilla = 0
      const idx1 = (reg << 1) | 1; // ancilla = 1

      const p0 = this.real[idx0] * this.real[idx0] + this.imag[idx0] * this.imag[idx0];
      const p1 = this.real[idx1] * this.real[idx1] + this.imag[idx1] * this.imag[idx1];
      probs[reg] = Math.max(0, p0 + p1);
    }
    return probs;
  }
}

/**
 * Boolean Oracle Evaluation:
 * f_s(x) = s · x mod 2 = XOR_i (s[i] AND x[i])
 */
export function evaluateRFIDOracle(secretMask: string, queryInput: string): number {
  let dotProduct = 0;
  for (let i = 0; i < 6; i++) {
    const s_i = parseInt(secretMask[i], 10) || 0;
    const x_i = parseInt(queryInput[i], 10) || 0;
    dotProduct ^= s_i & x_i;
  }
  return dotProduct;
}

/**
 * Classical Recovery Algorithm
 * Evaluates the 6 standard basis queries e_0 through e_5
 */
export function runClassicalRecovery(secretMask: string): ClassicalSimulationResult {
  const startTime = performance.now();
  const queries: ClassicalQueryRecord[] = [];
  const basisInputs = [
    '100000', // e0 -> s0
    '010000', // e1 -> s1
    '001000', // e2 -> s2
    '000100', // e3 -> s3
    '000010', // e4 -> s4
    '000001', // e5 -> s5
  ];

  const recoveredBits: string[] = ['?', '?', '?', '?', '?', '?'];

  for (let i = 0; i < 6; i++) {
    const input = basisInputs[i];
    const oracleOutput = evaluateRFIDOracle(secretMask, input);
    recoveredBits[i] = oracleOutput.toString();

    queries.push({
      queryIndex: i + 1,
      queryInput: input,
      oracleOutput,
      extractedBitIndex: i,
      extractedBitValue: oracleOutput,
      partialSecret: recoveredBits.join(''),
    });
  }

  const recoveredMask = recoveredBits.join('');
  const endTime = performance.now();

  return {
    secretMask,
    recoveredMask,
    oracleQueryCount: 6,
    queries,
    isMatch: recoveredMask === secretMask,
    executionTimeMs: Math.max(0.1, Number((endTime - startTime).toFixed(2))),
  };
}

/**
 * Helper to compute Hamming distance between two 6-bit integers
 */
function hammingDistance(a: number, b: number): number {
  let val = a ^ b;
  let dist = 0;
  while (val > 0) {
    dist += val & 1;
    val >>= 1;
  }
  return dist;
}

/**
 * Quantum Bernstein–Vazirani Simulation with configurable shots and noise model
 */
export function runBernsteinVaziraniSimulation(
  secretMask: string,
  shots: number = 1024,
  noiseEnabled: boolean = false,
  noiseRate: number = 0.035
): QuantumSimulationResult {
  const startTime = performance.now();

  // 1. Exact local state-vector computation
  const sv = new QuantumStateVector();
  // Initialize ancilla to |1>
  sv.applyX(6);

  // Apply Hadamards to all 7 qubits
  for (let q = 0; q < 7; q++) {
    sv.applyHadamard(q);
  }

  // Apply Oracle CNOT gates
  let cnotCount = 0;
  for (let i = 0; i < 6; i++) {
    if (secretMask[i] === '1') {
      sv.applyCNOT(i, 6);
      cnotCount++;
    }
  }

  // Apply Hadamards to 6 input qubits
  for (let q = 0; q < 6; q++) {
    sv.applyHadamard(q);
  }

  // Raw ideal probabilities from state-vector
  const rawProbs = sv.getInputRegisterProbabilities();
  const secretVal = parseInt(secretMask, 2);

  // 2. Compute theoretical probabilities
  const theoreticalProbs = new Array<number>(64).fill(0);
  for (let i = 0; i < 64; i++) {
    theoreticalProbs[i] = i === secretVal ? 1.0 : 0.0;
  }

  // 3. Simulated distribution (accounting for depolarizing / readout noise if enabled)
  const effectiveProbs = new Array<number>(64).fill(0);

  if (!noiseEnabled) {
    for (let i = 0; i < 64; i++) {
      effectiveProbs[i] = rawProbs[i];
    }
  } else {
    // Depolarizing / bit-flip noise model:
    // Probability of no error across 6 qubits: (1 - p)^6
    // Independent bit-flip probability p on each measurement line
    const p = noiseRate;
    let sum = 0;
    for (let i = 0; i < 64; i++) {
      const dist = hammingDistance(secretVal, i);
      const prob = Math.pow(1 - p, 6 - dist) * Math.pow(p, dist);
      effectiveProbs[i] = prob;
      sum += prob;
    }
    // Normalize
    for (let i = 0; i < 64; i++) {
      effectiveProbs[i] /= sum;
    }
  }

  // 4. Sample measurement shots
  // Build cumulative distribution function
  const cdf = new Float64Array(64);
  let cumulative = 0;
  for (let i = 0; i < 64; i++) {
    cumulative += effectiveProbs[i];
    cdf[i] = cumulative;
  }
  cdf[63] = 1.0; // clamp end

  const measuredCounts: Record<string, number> = {};
  const countsArr = new Int32Array(64);

  for (let s = 0; s < shots; s++) {
    const r = Math.random();
    // Binary search or linear search in 64 items
    let chosen = 63;
    for (let i = 0; i < 64; i++) {
      if (r <= cdf[i]) {
        chosen = i;
        break;
      }
    }
    countsArr[chosen]++;
  }

  // Format all 64 probability records
  const probabilities64: ProbabilityRecord[] = [];
  let maxCount = -1;
  let recoveredVal = secretVal;

  for (let i = 0; i < 64; i++) {
    const bitstring = i.toString(2).padStart(6, '0');
    const count = countsArr[i];
    measuredCounts[bitstring] = count;

    if (count > maxCount) {
      maxCount = count;
      recoveredVal = i;
    }

    probabilities64.push({
      bitstring,
      theoreticalProbability: theoreticalProbs[i],
      simulatedProbability: count / shots,
      measuredCount: count,
    });
  }

  const recoveredMask = recoveredVal.toString(2).padStart(6, '0');
  const secretCount = measuredCounts[secretMask] || 0;
  const successProbability = Number((secretCount / shots).toFixed(4));

  // Top outcomes sorted by count
  const topOutcomes = Object.entries(measuredCounts)
    .filter(([_, count]) => count > 0)
    .map(([bitstring, count]) => ({
      bitstring,
      count,
      percentage: Number(((count / shots) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const endTime = performance.now();

  return {
    secretMask,
    recoveredMask,
    shots,
    noiseEnabled,
    noiseRate,
    oracleQueriesPerExecution: 1,
    successProbability,
    isMatch: recoveredMask === secretMask,
    measuredCounts,
    probabilities64,
    topOutcomes,
    executionTimeMs: Math.max(0.1, Number((endTime - startTime).toFixed(2))),
    gateCount: {
      hadamard: 13,
      pauliX: 1,
      cnot: cnotCount,
      measurement: 6,
      total: 13 + 1 + cnotCount + 6,
    },
  };
}
