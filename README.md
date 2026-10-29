# RFID Tag Mask Recovery Using the Bernstein–Vazirani Algorithm

An educational quantum-computing project that explores how the **Bernstein–Vazirani algorithm** can recover a hidden binary mask using an oracle-based mathematical model inspired by RFID tag identification.

## Overview

Radio Frequency Identification (RFID) systems use radio waves to identify and track tagged objects. This project explores a simplified, RFID-inspired problem: recovering a hidden binary string using classical computation and the Bernstein–Vazirani quantum algorithm.

The project demonstrates the difference between classical and quantum query complexity through an interactive web application, with an emphasis on algorithm visualization, binary-mask recovery, and the fundamentals of quantum computing.

> **Disclaimer:** This project is an educational simulation of a mathematical model. It does not attack, clone, or recover secret keys from real-world RFID devices.

## Objectives

- Understand the Bernstein–Vazirani quantum algorithm.
- Model a hidden binary mask as a mathematical oracle function.
- Compare classical and quantum oracle query requirements.
- Explore binary strings, parity calculations, and quantum measurement outcomes.
- Provide a user-friendly interface for experimenting with the problem.

## How It Works

The hidden binary mask is represented by an \(n\)-bit string:

\[
s = s_0s_1\ldots s_{n-1}
\]

The oracle evaluates the bitwise inner product modulo two:

\[
f_s(x) = s \cdot x \pmod 2
\]

Here, \(s\) is the hidden mask and \(x\) is a binary input string. The oracle returns the parity of the bitwise products.

### Example

For the six-bit mask `110101`:

- **Input:** A six-bit binary string.
- **Oracle:** Computes the inner product modulo two.
- **Goal:** Recover the hidden mask.
- **Expected ideal output:** `110101`.

### Classical vs. Quantum Approach

| Approach | Oracle queries | Principle |
|---|---:|---|
| Classical deterministic | 6 for a six-bit mask | Query each standard basis vector |
| Bernstein–Vazirani quantum algorithm | 1 per circuit execution | Quantum superposition and phase kickback |

For an \(n\)-bit mask, the standard deterministic classical approach requires \(n\) oracle queries, while the Bernstein–Vazirani algorithm requires one oracle query per circuit execution in the ideal model.

This is a comparison of **oracle query complexity**, not a claim that every quantum implementation runs faster in wall-clock time.

## Features

The following features can be documented as implemented once they are available and tested in the application:

- Interactive web interface for binary-mask experiments.
- Secret-mask input and validation.
- Classical oracle-query demonstration.
- Bernstein–Vazirani algorithm visualization.
- Quantum circuit and measurement-result display, if supported by the implementation.
- Probability analysis and classical-versus-quantum comparison, if implemented.
- Responsive interface for convenient experimentation.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| Tailwind CSS | Interface styling |
| Lucide React | Interface icons |
| Google GenAI SDK | Available dependency; used only where integrated into the application |

**Quantum simulation:** A real Qiskit-based simulation requires a separate Python/Qiskit implementation or an appropriately configured backend. Do not assume that installing this frontend automatically runs Qiskit.

## Getting Started

### Prerequisites

Install the following software:

- [Node.js](https://nodejs.org/) — use a version compatible with the project's Vite requirements.
- npm — included with Node.js.
- Git — to clone the repository.

### 1. Clone the repository

```bash
git clone https://github.com/athiraarun06/RFID-QUANTUM.git
```

### 2. Navigate to the project

```bash
cd RFID-QUANTUM
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal, typically:

```text
http://localhost:3000/
```

### 5. Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

The exact files may evolve as the project develops.

```text
RFID-QUANTUM/
├── src/
│   ├── App.tsx
│   └── ...                 # Application components and logic
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Mathematical Background

The Bernstein–Vazirani algorithm solves a hidden-string problem using a quantum oracle.

Its main steps are:

1. Initialize the input qubits and an ancilla qubit.
2. Apply Hadamard gates to prepare superposition.
3. Apply the oracle encoding the hidden mask.
4. Use phase kickback to encode the mask into the input register.
5. Apply Hadamard gates to the input register again.
6. Measure the input qubits to recover the hidden string.

For an ideal noiseless implementation, the measurement returns the hidden mask with probability 1.

Real devices and noisy simulations may produce different results.

## Scope and Limitations

- The RFID connection is a simplified mathematical model for educational purposes.
- The oracle is assumed to be available; constructing or accessing a real RFID protocol is outside the scope of the model.
- Quantum query complexity does not automatically imply practical runtime or hardware advantages.
- Simulation results depend on the actual algorithm implementation, simulator, and configuration.
- Real RFID security depends on the device, protocol, authentication mechanism, and threat model.

## Future Improvements

- Integrate a verified Qiskit quantum-circuit simulator.
- Display the generated quantum circuit and measurement histogram.
- Add configurable secret-mask lengths and shot counts.
- Compare theoretical probabilities with simulated measurements.
- Export experiment results for further analysis.
- Add automated tests for mask recovery and oracle behavior.

## Educational Use

This project is intended for learning about quantum algorithms, oracle models, and the differences between classical and quantum computation. It is not intended to bypass RFID authentication or compromise deployed systems.

## Authors

**Athira Arun** and **Chelsea Reena**

## License

A license has not yet been specified. Add a `LICENSE` file before distributing the project under an open-source license.

---

*Exploring the intersection of quantum computing, binary information, and RFID-inspired identification through an interactive educational model.*

