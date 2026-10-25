// Administrative Request Priority Queue (Binary Heap) UI
// Referencing Section 4.7 & Figure 3 of Aryan Sharma's PBL Report

import { $, $$, showToast } from "../utils/dom.js";

export class PriorityUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Process / Extract-Min button
    const processBtn = $("#btn-process-next-ticket");
    if (processBtn) {
      processBtn.addEventListener("click", () => {
        this.processNextTicket();
      });
    }

    // Submit ticket form
    const form = $("#new-ticket-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleNewTicket(new FormData(form));
      });
    }
  }

  handleNewTicket(formData) {
    const studentId = formData.get("studentId")?.trim();
    const studentName = formData.get("studentName")?.trim() || "Student";
    const taskType = formData.get("taskType")?.trim();
    const deadlineDay = parseInt(formData.get("deadlineDay"), 10);
    const priorityScore = parseInt(formData.get("priorityScore"), 10);

    if (!studentId || !taskType || isNaN(deadlineDay) || isNaN(priorityScore)) {
      showToast("Please fill all required ticket fields correctly", "error");
      return;
    }

    const newTicket = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      studentId,
      studentName,
      taskType,
      deadlineDay,
      priorityScore,
      status: "Pending"
    };

    this.state.adminQueue.insert(newTicket);
    showToast(`Enqueued ticket ${newTicket.id} with deadline day ${deadlineDay} & score ${priorityScore}`, "success");
    $("#new-ticket-form")?.reset();
    this.render();
  }

  processNextTicket() {
    const ticket = this.state.adminQueue.extractMin();
    const statusBox = $("#processed-ticket-display");

    if (!ticket) {
      showToast("Priority Queue is empty! No pending administrative tasks.", "info");
      if (statusBox) statusBox.innerHTML = `<span class="text-muted italic">All requests processed. Queue is clear.</span>`;
      return;
    }

    if (statusBox) {
      statusBox.innerHTML = `
        <div class="alert alert-success animate-fade-in">
          <div class="font-bold">✓ Dispatched Request: ${ticket.id} (${ticket.taskType})</div>
          <p class="text-sm mt-1">
            Student: <strong>${ticket.studentName}</strong> (ID: <code>${ticket.studentId}</code>) &bull; 
            Deadline: <strong>Day ${ticket.deadlineDay}</strong> &bull; Priority Score: <strong>${ticket.priorityScore}/10</strong>
          </p>
          <div class="text-xs text-muted mt-1">Extracted from root of Binary Min-Heap in O(log n) time. Remaining in queue: ${this.state.adminQueue.size()}</div>
        </div>
      `;
    }

    showToast(`Processed urgent request ${ticket.id} (${ticket.taskType})`, "success");
    this.render();
  }

  render() {
    this.renderQueueTable();
    this.renderHeapArray();
    this.renderHeapTree();
  }

  renderQueueTable() {
    const tbody = $("#priority-queue-table-body");
    if (!tbody) return;

    const items = this.state.adminQueue.getAll();
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No active administrative tickets in queue.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map((task, idx) => `
      <tr class="${idx === 0 ? 'bg-amber-50 font-semibold' : ''}">
        <td class="font-mono text-xs">
          ${idx === 0 ? '<span class="badge badge-warning">ROOT / NEXT</span> ' : ''}${task.id}
        </td>
        <td>${task.studentName} <span class="font-mono text-xs text-muted">(${task.studentId})</span></td>
        <td>${task.taskType}</td>
        <td><span class="badge badge-secondary">Day ${task.deadlineDay}</span></td>
        <td><span class="font-bold text-primary">${task.priorityScore} / 10</span></td>
        <td class="font-mono text-xs text-muted">Index [${idx}]</td>
      </tr>
    `).join("");
  }

  renderHeapArray() {
    const container = $("#heap-array-container");
    if (!container) return;

    const items = this.state.adminQueue.getAll();
    if (items.length === 0) {
      container.innerHTML = `<span class="text-muted text-xs">Heap array is empty</span>`;
      return;
    }

    container.innerHTML = `
      <div class="flex flex-wrap gap-2">
        ${items.map((item, idx) => `
          <div class="heap-cell ${idx === 0 ? 'heap-cell-root' : ''}">
            <div class="cell-index">[${idx}]</div>
            <div class="cell-id font-mono">${item.id}</div>
            <div class="cell-key text-xs font-semibold">D:${item.deadlineDay} | P:${item.priorityScore}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  renderHeapTree() {
    const container = $("#heap-tree-canvas-container");
    if (!container) return;

    const items = this.state.adminQueue.getAll();
    if (items.length === 0) {
      container.innerHTML = `<div class="py-8 text-center text-muted text-sm">Priority heap tree is empty.</div>`;
      return;
    }

    // Binary heap node coordinates
    const nodes = [];
    const links = [];

    const getPos = (idx) => {
      const level = Math.floor(Math.log2(idx + 1));
      const posInLevel = idx - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);
      const spacing = 700 / (totalInLevel + 1);
      const x = (posInLevel + 1) * spacing + 50;
      const y = 45 + level * 65;
      return { x, y };
    };

    items.forEach((item, idx) => {
      const pos = getPos(idx);
      nodes.push({ ...item, idx, ...pos });

      // Link to parent
      if (idx > 0) {
        const parentIdx = Math.floor((idx - 1) / 2);
        const parentPos = getPos(parentIdx);
        links.push({ x1: parentPos.x, y1: parentPos.y, x2: pos.x, y2: pos.y });
      }
    });

    let svg = `<svg viewBox="0 0 800 240" class="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg">`;

    // Draw lines
    for (const link of links) {
      svg += `<line x1="${link.x1}" y1="${link.y1}" x2="${link.x2}" y2="${link.y2}" stroke="#cbd5e1" stroke-width="2"/>`;
    }

    // Draw nodes
    for (const node of nodes) {
      const isRoot = node.idx === 0;
      svg += `
        <g transform="translate(${node.x}, ${node.y})">
          <circle r="20" fill="${isRoot ? '#fef3c7' : '#ffffff'}" stroke="${isRoot ? '#d97706' : '#64748b'}" stroke-width="${isRoot ? '2.5' : '1.5'}"/>
          <text text-anchor="middle" y="4" font-size="10" font-weight="700" font-family="monospace">${node.id.replace('REQ-', '')}</text>
          <text text-anchor="middle" y="-24" font-size="9" fill="#0369a1" font-weight="600">D:${node.deadlineDay} P:${node.priorityScore}</text>
          <text text-anchor="middle" y="32" font-size="8" fill="#94a3b8">[${node.idx}]</text>
        </g>
      `;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
  }
}
