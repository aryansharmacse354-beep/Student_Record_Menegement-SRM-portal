// Unit 5 Advanced Data Structures & B+ Tree UI
// Referencing Section 8, Table 8 & Table 9 of Aryan Sharma's PBL Report

import { $, showToast } from "../utils/dom.js";

export class BTreeUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Range query on B+ Tree
    const runRangeBtn = $("#btn-run-bplus-range");
    const startInput = $("#input-bplus-start");
    const endInput = $("#input-bplus-end");

    if (runRangeBtn && startInput && endInput) {
      runRangeBtn.addEventListener("click", () => {
        const start = startInput.value.trim();
        const end = endInput.value.trim();
        if (start && end) {
          this.executeRangeQuery(start, end);
        } else {
          showToast("Please provide start and end roll numbers for range query", "error");
        }
      });
    }
  }

  render() {
    this.renderBPlusTreeStructure();
    this.renderRedBlackComparison();
    this.renderConsolidatedComplexityTable();
  }

  executeRangeQuery(startKey, endKey) {
    const result = this.state.bPlusTree.rangeQuery(startKey, endKey);
    const container = $("#bplus-range-results-container");

    if (container) {
      container.innerHTML = `
        <div class="alert alert-success">
          <div class="font-bold text-base mb-1">
            B+ Tree Range Query: Found <strong>${result.results.length} records</strong> between <code>${startKey}</code> and <code>${endKey}</code>
          </div>
          <p class="text-xs text-slate-700 mb-2">
            Simulated Disk Page Reads: <strong>${result.diskBlockReads} block accesses</strong>. Records retrieved sequentially via linked leaf node pointers without touching intermediate index pages!
          </p>
          <div class="space-y-1">
            ${result.results.map(r => `
              <div class="flex justify-between items-center text-xs py-1 border-b border-slate-200">
                <span class="font-mono font-semibold">${r.key}</span>
                <span>${r.record.name} (${r.record.programme}, Sem ${r.record.semester})</span>
                <span class="badge badge-primary">CGPA: ${r.record.cgpa}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    showToast(`B+ Tree range query returned ${result.results.length} records`, "success");
  }

  renderBPlusTreeStructure() {
    const container = $("#bplus-tree-canvas-container");
    if (!container) return;

    // Render linked leaf nodes
    let currentLeaf = this.state.bPlusTree.getFirstLeaf();
    const leafNodes = [];
    let leafIdx = 0;

    while (currentLeaf) {
      leafNodes.push({
        id: leafIdx++,
        keys: [...currentLeaf.keys],
        recordsCount: currentLeaf.children.length
      });
      currentLeaf = currentLeaf.next;
    }

    container.innerHTML = `
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div class="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
          Linked Leaf-Level Architecture (Fig. 10 B+ Tree Scan)
        </div>
        <div class="flex flex-wrap items-center gap-3 overflow-x-auto pb-2">
          ${leafNodes.map((leaf, i) => `
            <div class="flex items-center gap-2">
              <div class="border-2 border-indigo-500 bg-white rounded p-2 shadow-sm text-xs min-w-[130px]">
                <div class="font-bold text-indigo-700 border-b pb-1 mb-1">Leaf Block #${leaf.id}</div>
                <div class="font-mono text-xs text-slate-800 space-y-0.5">
                  ${leaf.keys.map(k => `<div>&bull; ${k.slice(-4)} (${k})</div>`).join("")}
                </div>
              </div>
              ${i < leafNodes.length - 1 ? '<div class="text-indigo-600 font-bold text-lg">&harr;</div>' : ''}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderRedBlackComparison() {
    const tbody = $("#rb-comparison-tbody");
    if (!tbody) return;

    const data = [
      { feature: "Balancing Invariant", avl: "Height difference between subtrees <= 1", rb: "Root black, no 2 adjacent red nodes, equal black-height" },
      { feature: "Maximum Tree Height", avl: "Approx 1.44 log₂(n + 2)", rb: "Approx 2.00 log₂(n + 1)" },
      { feature: "Lookup Speed", avl: "Slightly faster (strictly balanced height)", rb: "Very fast O(log n), marginally deeper than AVL" },
      { feature: "Rotations on Insertion", avl: "At most 2 rotations", rb: "At most 2 rotations (recoloring often suffices)" },
      { feature: "Rotations on Deletion", avl: "Up to O(log n) rotations", rb: "At most 3 rotations" },
      { feature: "Primary Use Case", avl: "Read-heavy in-memory student lookup indexes", rb: "Write-heavy standard libraries (std::map, TreeMap)" }
    ];

    tbody.innerHTML = data.map(row => `
      <tr>
        <td class="font-semibold text-slate-900">${row.feature}</td>
        <td class="text-slate-700">${row.avl}</td>
        <td class="text-slate-700">${row.rb}</td>
      </tr>
    `).join("");
  }

  renderConsolidatedComplexityTable() {
    const tbody = $("#complexity-matrix-tbody");
    if (!tbody) return;

    const rows = [
      { unit: "Unit 1", structure: "Hash Table (Exact ID Lookup)", time: "Average O(1), Worst O(n)", space: "O(n)", role: "Primary student search by Roll No / ERP ID" },
      { unit: "Unit 1", structure: "AVL Tree / BST", time: "O(log n) guaranteed", space: "O(n)", role: "In-order sorted roll number queries" },
      { unit: "Unit 1", structure: "Binary Min-Heap", time: "Insert: O(log n), Extract: O(log n), Peek: O(1)", space: "O(n)", role: "Urgent administrative ticket queue" },
      { unit: "Unit 2", structure: "Prerequisite Graph (Kahn DAG)", time: "O(V + E)", space: "O(V + E)", role: "Topological course sequencing & cycle trap" },
      { unit: "Unit 2", structure: "Floyd-Warshall Shortest Path", time: "O(V³)", space: "O(V²)", role: "All-pairs campus service network routing" },
      { unit: "Unit 3", structure: "0/1 Knapsack (DP)", time: "O(nW) pseudo-polynomial", space: "O(nW)", role: "Elective activity benefit score optimization" },
      { unit: "Unit 3", structure: "Longest Common Subseq (LCS)", time: "O(mn)", space: "O(mn)", role: "Curriculum progress alignment check" },
      { unit: "Unit 4", structure: "Graph Colouring (Backtrack)", time: "Exponential pruned (O(m^V))", space: "O(V)", role: "Exam timetable slot clash resolution" },
      { unit: "Unit 4", structure: "N-Queens Placement", time: "O(N!) worst-case", space: "O(N)", role: "Non-conflicting resource slot demonstration" },
      { unit: "Unit 4", structure: "TSP Branch and Bound", time: "O(n² 2ⁿ) / O(n!) pruned", space: "O(n)", role: "Campus courier minimal cost tour" },
      { unit: "Unit 5", structure: "B+ Tree Index", time: "O(log_m n) page reads", space: "O(n)", role: "Database persistent range scans via linked leaves" }
    ];

    tbody.innerHTML = rows.map(r => `
      <tr>
        <td><span class="badge badge-secondary">${r.unit}</span></td>
        <td class="font-semibold text-slate-900">${r.structure}</td>
        <td class="font-mono text-xs font-bold text-primary">${r.time}</td>
        <td class="font-mono text-xs">${r.space}</td>
        <td class="text-xs text-slate-700">${r.role}</td>
      </tr>
    `).join("");
  }
}
