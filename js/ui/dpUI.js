// Unit 3 Dynamic Programming Hub UI
// Implements 0/1 Knapsack, LCS, and Matrix Chain Multiplication
// Referencing Section 6 of Aryan Sharma's PBL Report

import { $, showToast } from "../utils/dom.js";
import { DPEngine } from "../dsa/dpEngine.js";
import { KNAPSACK_ACTIVITIES, KNAPSACK_BUDGET } from "../data.js";

export class DPUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Knapsack Capacity change
    const capInput = $("#input-knapsack-capacity");
    const runKnapsackBtn = $("#btn-run-knapsack");
    if (runKnapsackBtn && capInput) {
      runKnapsackBtn.addEventListener("click", () => {
        const cap = parseInt(capInput.value, 10);
        if (!isNaN(cap) && cap >= 1 && cap <= 15) {
          this.renderKnapsack(cap);
        } else {
          showToast("Please enter a valid capacity between 1 and 15", "error");
        }
      });
    }

    // Run LCS
    const runLcsBtn = $("#btn-run-lcs");
    if (runLcsBtn) {
      runLcsBtn.addEventListener("click", () => {
        this.runLCSDemo();
      });
    }

    // Run Matrix Chain
    const runMcmBtn = $("#btn-run-mcm");
    if (runMcmBtn) {
      runMcmBtn.addEventListener("click", () => {
        this.runMCMDemo();
      });
    }
  }

  render() {
    this.renderKnapsack(KNAPSACK_BUDGET);
    this.runLCSDemo();
    this.runMCMDemo();
  }

  renderKnapsack(capacity = 7) {
    const result = DPEngine.solve01Knapsack(KNAPSACK_ACTIVITIES, capacity);
    const tableContainer = $("#knapsack-table-container");
    const summaryContainer = $("#knapsack-summary-container");

    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div class="alert alert-success">
          <div class="font-bold text-base mb-1">
            Optimal Activity Benefit Score: <strong>${result.optimalValue}</strong> (Capacity: ${result.capacity} hours)
          </div>
          <p class="text-sm">
            Optimal activities selected via DP backtracking:
            <strong>${result.chosenItems.map(item => `${item.id}: ${item.name} (${item.weight}h, score ${item.value})`).join(" + ")}</strong>
          </p>
          <div class="text-xs text-muted mt-2">
            Formula: <code>${result.recurrenceExplanation}</code> &bull; Solved in O(nW) = O(${result.activities.length} &times; ${result.capacity})
          </div>
        </div>
      `;
    }

    if (tableContainer) {
      let html = `
        <div class="overflow-x-auto">
          <table class="data-table text-center text-xs">
            <thead>
              <tr>
                <th class="bg-slate-100">Activity (w, v)</th>
                ${Array.from({ length: capacity + 1 }, (_, w) => `<th class="bg-slate-50 font-mono">c = ${w}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-bold bg-slate-50">i = 0 (Base)</td>
                ${result.dpTable[0].map(val => `<td>${val}</td>`).join("")}
              </tr>
              ${result.activities.map((act, i) => `
                <tr>
                  <td class="font-bold bg-slate-50 text-left">
                    ${act.id} (${act.weight}h, ${act.value}pts)
                  </td>
                  ${result.dpTable[i + 1].map((val, w) => {
                    const isOptimalCell = i === result.activities.length - 1 && w === capacity;
                    return `<td class="${isOptimalCell ? 'bg-emerald-100 font-bold text-emerald-800' : ''}">${val}</td>`;
                  }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
      tableContainer.innerHTML = html;
    }
  }

  runLCSDemo() {
    const seq1Input = $("#input-lcs-seq1")?.value || "BCSE0101,MATH0201,BCSE0301,BCSE0401,BCSE0402,BCSE0501";
    const seq2Input = $("#input-lcs-seq2")?.value || "BCSE0101,BCSE0301,BCSE0401,BCSE0501";

    const s1 = seq1Input.split(",").map(s => s.trim());
    const s2 = seq2Input.split(",").map(s => s.trim());

    const result = DPEngine.solveLCS(s1, s2);
    const container = $("#lcs-result-container");

    if (container) {
      container.innerHTML = `
        <div class="alert alert-info">
          <div class="font-bold text-base mb-1">
            LCS Length: <strong>${result.lcsLength} Courses</strong> (Curriculum Alignment: <strong>${result.similarityScore}%</strong>)
          </div>
          <p class="text-sm">
            Common Ordered Course Subsequence: 
            <strong>${result.lcsElements.join(" &rarr; ")}</strong>
          </p>
          <div class="text-xs text-muted mt-2">
            Dynamic Programming Complexity: O(m &times; n) = O(${s1.length} &times; ${s2.length}). Compares prerequisite progress against standard curriculum template.
          </div>
        </div>
      `;
    }
  }

  runMCMDemo() {
    // Standard dimensions from academic data analytics pipeline
    const dimensions = [10, 20, 30, 40, 30]; // 4 matrices: A1(10x20), A2(20x30), A3(30x40), A4(40x30)
    const result = DPEngine.solveMatrixChain(dimensions);
    const container = $("#mcm-result-container");

    if (container) {
      container.innerHTML = `
        <div class="alert alert-secondary">
          <div class="font-bold text-base mb-1">
            Minimum Scalar Multiplications: <strong>${result.minOperations.toLocaleString()} operations</strong>
          </div>
          <p class="text-sm">
            Optimal Evaluation Order: <code>${result.optimalParentheses}</code>
          </p>
          <div class="text-xs text-muted mt-1">
            Demonstrates O(n³) bottom-up dynamic programming optimization for analytics aggregation pipelines (Section 6.4).
          </div>
        </div>
      `;
    }
  }
}
