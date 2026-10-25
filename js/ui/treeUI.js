// Unit 1 AVL Tree Interactive Lab & Visualizer
// Referencing Section 4.4, 4.5 & Fig. 2 of Aryan Sharma's PBL Report

import { $, $$, showToast } from "../utils/dom.js";

export class TreeUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Insert single key
    const insertBtn = $("#btn-avl-insert");
    const keyInput = $("#input-avl-key");
    if (insertBtn && keyInput) {
      insertBtn.addEventListener("click", () => {
        const val = parseInt(keyInput.value, 10);
        if (!isNaN(val)) {
          this.state.demoAVLTree.insert(val);
          keyInput.value = "";
          this.render();
          showToast(`Inserted key ${val} into AVL Tree`, "success");
        }
      });
      keyInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") insertBtn.click();
      });
    }

    // Run Report Demo Sequence: 10, 20, 30, 40, 50, 25 (Section 4.5)
    const runDemoSeqBtn = $("#btn-avl-report-sequence");
    if (runDemoSeqBtn) {
      runDemoSeqBtn.addEventListener("click", () => {
        this.runReportSequenceDemo();
      });
    }

    // Clear Tree
    const clearBtn = $("#btn-avl-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.state.demoAVLTree.clear();
        this.render();
        showToast("Cleared AVL Tree", "info");
      });
    }
  }

  runReportSequenceDemo() {
    this.state.demoAVLTree.clear();
    const sequence = [10, 20, 30, 40, 50, 25];
    
    // Insert sequentially
    sequence.forEach(key => {
      this.state.demoAVLTree.insert(key);
    });

    this.render();
    showToast("Executed report sequence [10, 20, 30, 40, 50, 25]: Triggered RR & RL Rotations!", "success");
  }

  render() {
    this.renderTreeCanvas();
    this.renderRotationLog();
    this.renderTraversals();
  }

  renderTreeCanvas() {
    const container = $("#avl-canvas-container");
    if (!container) return;

    const root = this.state.demoAVLTree.root;
    if (!root) {
      container.innerHTML = `
        <div class="empty-state py-12 text-center text-muted">
          <p class="text-sm">AVL Tree is empty. Insert keys or click <strong>Run Report Demo Sequence (Section 4.5)</strong> to visualize balanced tree construction.</p>
        </div>
      `;
      return;
    }

    // Compute node coordinates recursively
    const nodes = [];
    const links = [];

    const calculatePositions = (node, depth = 0, left = 0, right = 800) => {
      if (!node) return;
      const x = (left + right) / 2;
      const y = 50 + depth * 70;

      nodes.push({ key: node.key, height: node.height, balance: node.getBalance(), x, y });

      if (node.left) {
        const childX = (left + x) / 2;
        const childY = 50 + (depth + 1) * 70;
        links.push({ x1: x, y1: y, x2: childX, y2: childY });
        calculatePositions(node.left, depth + 1, left, x);
      }

      if (node.right) {
        const childX = (x + right) / 2;
        const childY = 50 + (depth + 1) * 70;
        links.push({ x1: x, y1: y, x2: childX, y2: childY });
        calculatePositions(node.right, depth + 1, x, right);
      }
    };

    calculatePositions(root, 0, 0, 800);

    let svg = `
      <svg viewBox="0 0 800 360" class="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg shadow-inner">
    `;

    // Draw lines
    for (const link of links) {
      svg += `<line x1="${link.x1}" y1="${link.y1}" x2="${link.x2}" y2="${link.y2}" stroke="#94a3b8" stroke-width="2"/>`;
    }

    // Draw nodes
    for (const node of nodes) {
      const isBalanced = Math.abs(node.balance) <= 1;
      const fill = isBalanced ? "#ffffff" : "#fee2e2";
      const stroke = isBalanced ? "#0284c7" : "#ef4444";

      svg += `
        <g class="tree-node" transform="translate(${node.x}, ${node.y})">
          <circle r="22" fill="${fill}" stroke="${stroke}" stroke-width="2.5" class="shadow"/>
          <text text-anchor="middle" y="5" font-size="13" font-weight="700" fill="#0f172a" font-family="monospace">${node.key}</text>
          <text text-anchor="middle" y="-28" font-size="10" font-weight="600" fill="#64748b">BF: ${node.balance}</text>
          <text text-anchor="middle" y="36" font-size="9" fill="#94a3b8">h=${node.height}</text>
        </g>
      `;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
  }

  renderRotationLog() {
    const tbody = $("#avl-rotation-log-body");
    if (!tbody) return;

    const log = this.state.demoAVLTree.rotationLog;
    if (log.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-3 text-xs">No rotations required yet (Tree currently balanced).</td></tr>`;
      return;
    }

    tbody.innerHTML = log.map((entry, idx) => `
      <tr>
        <td class="font-mono text-xs font-bold">${idx + 1}</td>
        <td>
          <span class="badge ${entry.type === 'LL' || entry.type === 'RR' ? 'badge-primary' : 'badge-warning'}">
            ${entry.type} Rotation
          </span>
        </td>
        <td class="text-xs text-slate-700">${entry.description}</td>
      </tr>
    `).join("");
  }

  renderTraversals() {
    const inOrderEl = $("#traversal-inorder");
    const preOrderEl = $("#traversal-preorder");
    const postOrderEl = $("#traversal-postorder");

    const inOrder = this.state.demoAVLTree.inOrder();
    const preOrder = this.state.demoAVLTree.preOrder();
    const postOrder = this.state.demoAVLTree.postOrder();

    if (inOrderEl) inOrderEl.textContent = inOrder.map(n => n.key).join(" → ") || "Empty";
    if (preOrderEl) preOrderEl.textContent = preOrder.map(n => n.key).join(" → ") || "Empty";
    if (postOrderEl) postOrderEl.textContent = postOrder.map(n => n.key).join(" → ") || "Empty";
  }
}
