// Unit 4 Backtracking & Branch and Bound Hub UI
// Implements N-Queens, Graph Colouring, Sum of Subsets, and TSP Branch & Bound
// Referencing Section 7 of Aryan Sharma's PBL Report

import { $, showToast } from "../utils/dom.js";
import { BacktrackingEngine } from "../dsa/backtrack.js";

export class BacktrackUI {
  constructor(appState) {
    this.state = appState;
    this.currentQueenSolIdx = 0;
    this.queenSolutions = [];
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Solve N-Queens
    const solveQueensBtn = $("#btn-solve-queens");
    const queensNSelect = $("#select-queens-n");
    if (solveQueensBtn && queensNSelect) {
      solveQueensBtn.addEventListener("click", () => {
        const n = parseInt(queensNSelect.value, 10);
        this.runQueens(n);
      });
    }

    // Next Queen Solution
    const nextQueenBtn = $("#btn-next-queen-sol");
    if (nextQueenBtn) {
      nextQueenBtn.addEventListener("click", () => {
        if (this.queenSolutions.length > 0) {
          this.currentQueenSolIdx = (this.currentQueenSolIdx + 1) % this.queenSolutions.length;
          this.renderChessboard();
        }
      });
    }

    // Run Exam Timetable Graph Colouring
    const runColouringBtn = $("#btn-run-colouring");
    if (runColouringBtn) {
      runColouringBtn.addEventListener("click", () => {
        this.runGraphColouring();
      });
    }

    // Run Sum of Subsets
    const runSubsetsBtn = $("#btn-run-subsets");
    if (runSubsetsBtn) {
      runSubsetsBtn.addEventListener("click", () => {
        this.runSumOfSubsets();
      });
    }

    // Run TSP Branch & Bound
    const runTspBtn = $("#btn-run-tsp");
    if (runTspBtn) {
      runTspBtn.addEventListener("click", () => {
        this.runTSP();
      });
    }
  }

  render() {
    this.runQueens(4);
    this.runGraphColouring();
    this.runSumOfSubsets();
    this.runTSP();
  }

  runQueens(n = 4) {
    const result = BacktrackingEngine.solveNQueens(n);
    this.queenSolutions = result.solutions;
    this.currentQueenSolIdx = 0;

    const statsEl = $("#queens-stats-container");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-badge success">
          <strong>N = ${n} Board:</strong> Found <strong>${result.solutionsCount}</strong> non-conflicting solutions (Pruned <strong>${result.deadEnds}</strong> dead-end partial states).
          ${n === 4 ? '<span class="block mt-1 text-xs">Fig. 8 Reference: The two 4-Queens column configurations are <code>[1, 3, 0, 2]</code> and <code>[2, 0, 3, 1]</code>.</span>' : ''}
        </div>
      `;
    }

    this.renderChessboard();
  }

  renderChessboard() {
    const boardContainer = $("#chessboard-canvas-container");
    if (!boardContainer || this.queenSolutions.length === 0) return;

    const sol = this.queenSolutions[this.currentQueenSolIdx];
    const n = sol.length;

    let html = `
      <div class="text-xs text-muted mb-2 text-center">
        Displaying Solution <strong>${this.currentQueenSolIdx + 1} of ${this.queenSolutions.length}</strong> (Column sequence: <code>[${sol.join(", ")}]</code>)
      </div>
      <div class="grid" style="grid-template-columns: repeat(${n}, minmax(0, 1fr)); width: 240px; margin: 0 auto; border: 2px solid #334155;">
    `;

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const isDark = (r + c) % 2 === 1;
        const hasQueen = sol[r] === c;
        html += `
          <div class="aspect-square flex items-center justify-center font-bold text-xl ${isDark ? 'bg-slate-300' : 'bg-slate-50'}" style="height: 58px;">
            ${hasQueen ? '<span class="text-rose-600 drop-shadow">♛</span>' : ''}
          </div>
        `;
      }
    }

    html += `</div>`;
    boardContainer.innerHTML = html;
  }

  runGraphColouring() {
    // 5 Exams with common student conflicts
    const exams = [
      "DSA-II (BCSE0401)",
      "OS (BCSE0402)",
      "DBMS (BCSE0501)",
      "Discrete Math (MATH0201)",
      "DAA (BCSE0502)"
    ];

    // Conflict edges: [examA, examB] have students enrolled in both
    const conflictEdges = [
      [0, 1], // DSA-II and OS
      [0, 2], // DSA-II and DBMS
      [1, 2], // OS and DBMS
      [0, 3], // DSA-II and Discrete Math
      [2, 4]  // DBMS and DAA
    ];

    const result = BacktrackingEngine.solveGraphColouring(exams, conflictEdges, 3);
    const container = $("#colouring-result-container");

    if (container) {
      container.innerHTML = `
        <div class="alert alert-info">
          <div class="font-bold text-base mb-1">
            Exam Conflict Resolution: ${result.success ? `✓ Scheduled in ${result.maxSlots} Slots (3 Colours)` : '✕ Needs More Slots'}
          </div>
          <p class="text-xs mb-3 text-slate-700">
            Backtracking explored <strong>${result.trials} trial states</strong> with constraint checks on conflicting common enrollments (Section 7.4).
          </p>
          <div class="space-y-1">
            ${result.schedule.map(item => `
              <div class="flex justify-between items-center text-xs py-1 border-b border-slate-200">
                <span class="font-semibold">${item.exam}</span>
                <span class="badge ${item.slotNumber === 1 ? 'badge-primary' : item.slotNumber === 2 ? 'badge-secondary' : 'badge-warning'}">
                  ${item.slotName}
                </span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
  }

  runSumOfSubsets() {
    const set = [3, 5, 6, 7];
    const target = 15;
    const result = BacktrackingEngine.solveSumOfSubsets(set, target);
    const container = $("#subsets-result-container");

    if (container) {
      container.innerHTML = `
        <div class="alert alert-secondary">
          <div class="font-bold text-base mb-1">
            Sum of Subsets: ${result.summary}
          </div>
          <p class="text-xs text-slate-600 mb-1">
            Set: <code>{${set.join(", ")}}</code> &bull; Target: <code>${target}</code> &bull; Explored: <strong>${result.nodesExplored} nodes</strong> &bull; Pruned: <strong>${result.prunedCount} branches</strong>
          </p>
          <div class="text-xs text-muted">
            Matching Section 7.2 & Fig. 7 of the report: include/skip state-space tree with bounding function.
          </div>
        </div>
      `;
    }
  }

  runTSP() {
    const result = BacktrackingEngine.solveTSPBranchAndBound();
    const container = $("#tsp-result-container");

    if (container) {
      container.innerHTML = `
        <div class="alert alert-success">
          <div class="font-bold text-base mb-1">
            Campus Courier Tour: ${result.bestCost} min round-trip
          </div>
          <p class="text-xs mb-2">
            <strong>Optimal Route:</strong> ${result.bestTour.join(" &rarr; ")}
          </p>
          <div class="text-xs text-muted">
            Explored: <strong>${result.nodesExplored} search nodes</strong> &bull; Pruned: <strong>${result.branchesPruned} subtrees</strong> via bounding (Section 7.6).
          </div>
        </div>
      `;
    }
  }
}
