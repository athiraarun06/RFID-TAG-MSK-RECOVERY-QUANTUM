# RFID Tag Mask Recovery Using the Bernstein–Vazirani Algorithm

**Classical vs. Quantum Query Complexity Demonstration**  
**Team Members:** Athira Arun, Chelsea Reena

---

## 📌 Project Overview
This academic project demonstrates the quantum query complexity advantage of the **Bernstein–Vazirani algorithm** compared to classical sequential probing when recovering a hidden 6-bit binary mask $s \in \{0, 1\}^6$ from a simulated RFID tag.

In Radio-Frequency Identification (RFID) systems, a transponder answers challenge vectors $x \in \{0, 1\}^6$ via the parity challenge-response function:
$$f_s(x) = (s \cdot x) \pmod 2 = \bigoplus_{i=0}^{5} (s_i \land x_i)$$

The goal is to determine the secret mask $s$ with the minimum number of oracle evaluations.

---

## ⚡ Classical vs. Quantum Query Complexity

| Metric | Classical Probing | Quantum Bernstein–Vazirani |
| :--- | :--- | :--- |
| **Oracle Queries** | **6 queries** ($n=6$) | **1 query per circuit execution** |
| **Query Complexity** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ |
| **Strategy** | Probing standard basis vectors $e_0 \dots e_5$ | Quantum superposition & phase kickback |
| **Query Reduction** | Baseline | **83.33% fewer queries** |

> **Note on Query Advantage:** The 83.33% query reduction is an information-theoretic query complexity advantage ($1$ query vs. $6$ queries), demonstrating the power of quantum interference over classical Shannon information limits ($1$ bit per classical query).

---

## 🔬 System Architecture & Circuit

The application includes an exact 7-qubit quantum state-vector simulator ($2^7 = 128$ complex amplitudes):
1. **Register Preparation:** Initializes 6 input qubits to $|000000\rangle$ and 1 target ancilla qubit to $|1\rangle$.
2. **Superposition:** Applies Hadamard transform $H^{\otimes 7}$, putting inputs into equal superposition and the ancilla into $|-\rangle = \frac{|0\rangle - |1\rangle}{\sqrt{2}}$.
3. **Oracle Evaluation ($U_f$):** Evaluates $U_f |x, y\rangle = |x, y \oplus f(x)\rangle$. Through **phase kickback**, the ancilla $|-\rangle$ induces an exact phase shift $(-1)^{s \cdot x}$ onto the register without altering the ancilla.
4. **Interference:** Applies $H^{\otimes 6}$ on the input register, causing total destructive interference for all $y \ne s$ and $100\%$ constructive interference on $|s\rangle$.
5. **Measurement:** Measuring the 6 input qubits deterministically yields the hidden secret mask $s$.

---

## 🚀 Key Features

- **Interactive Simulation Controls:** Configure any 6-bit mask, presets (`110101` default, `011010`), shot counts (100, 512, 1024, 2048), and optional realistic depolarizing noise model.
- **Results Summary:** Instant verification and side-by-side comparison of classical and quantum outcomes.
- **Interactive Boolean Oracle:** Directly test any challenge vector $x$ against the active mask.
- **Dynamic Quantum Circuit Diagram:** SVG circuit automatically drawing the active CNOT gates for the selected mask.
- **64-State Probability Analysis:** Comprehensive table of all $2^6 = 64$ basis states comparing theoretical vs. simulated probabilities and measured counts.
- **Graphical Visualizations:** Measurement frequencies, comparative probability distributions, and query reduction charts.
- **Downloads & Exports:**
  - `Results CSV` (All 64 bitstrings with theoretical and empirical probabilities and counts)
  - `Summary TXT` (Full experimental verification report)
  - `Probability Chart PNG` (High-resolution distribution chart)
  - `Quantum Circuit PNG` (Exported quantum circuit schematic)

---

## 💻 Tech Stack & Installation

- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (Light mode academic design)
- **Icons:** Lucide React

### Getting Started

```bash
# Clone the repository
git clone https://github.com/athiraarun06/<your-repo-name>.git
cd <your-repo-name>

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 👥 Authors & Credits
- **Athira Arun**
- **Chelsea Reena**
