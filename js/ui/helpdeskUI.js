// University Registrar Helpdesk & Student Petitions Queue UI
// Powered by Priority Queue Triage (Binary Min-Heap)

import { $, showToast } from "../utils/dom.js";

export class HelpdeskUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Process next urgent ticket button
    const processBtn = $("#btn-process-next-ticket");
    if (processBtn) {
      processBtn.addEventListener("click", () => {
        this.processNextTicket();
      });
    }

    // Submit new student petition
    const form = $("#new-petition-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleNewPetition(new FormData(form));
      });
    }
  }

  handleNewPetition(formData) {
    const studentId = formData.get("studentId")?.trim();
    const studentName = formData.get("studentName")?.trim();
    const category = formData.get("category")?.trim();
    const department = formData.get("department")?.trim();
    const urgencyScore = parseInt(formData.get("urgencyScore"), 10) || 5;
    const deadlineDays = parseInt(formData.get("deadlineDays"), 10) || 3;
    const notes = formData.get("notes")?.trim() || "";

    if (!studentId || !studentName || !category) {
      showToast("Please provide all required petition information", "error");
      return;
    }

    const newRequest = {
      id: `REQ-${Math.floor(4000 + Math.random() * 900)}`,
      studentId,
      studentName,
      category,
      department: department || "General Studies",
      urgencyScore,
      deadlineDays,
      status: "Pending",
      submissionDate: new Date().toISOString().split("T")[0],
      notes
    };

    this.state.registrarQueue.insert(newRequest);
    showToast(`Filed petition ${newRequest.id}: ${newRequest.category}`, "success");
    $("#new-petition-form")?.reset();
    this.render();
    if (this.state.dashboardUI) this.state.dashboardUI.render();
  }

  processNextTicket() {
    const ticket = this.state.registrarQueue.extractHighestPriority();
    const container = $("#processed-petition-result");

    if (!ticket) {
      showToast("No pending registrar petitions in the queue", "info");
      if (container) container.innerHTML = `<span class="text-xs text-muted">All student petitions have been addressed.</span>`;
      return;
    }

    if (container) {
      container.innerHTML = `
        <div class="alert alert-success animate-fade-in">
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold text-base">✓ Processed Petition: ${ticket.id}</div>
              <div class="text-sm font-semibold text-slate-800">${ticket.category}</div>
              <p class="text-xs text-slate-600 mt-1">
                Student: <strong>${ticket.studentName}</strong> (<code>${ticket.studentId}</code>) &bull; 
                Department: ${ticket.department} &bull; Urgency Score: <strong>${ticket.urgencyScore}/10</strong> &bull; Deadline: <strong>${ticket.deadlineDays} day(s)</strong>
              </p>
              ${ticket.notes ? `<p class="text-xs italic text-slate-700 mt-1 bg-white p-2 rounded border border-slate-200">"${ticket.notes}"</p>` : ''}
            </div>
            <span class="badge badge-success">Approved & Logged</span>
          </div>
          <div class="mt-2 text-xs text-slate-500">
            Dispatched via Registrar Priority Queue in O(log n) time. Remaining pending petitions: ${this.state.registrarQueue.size()}
          </div>
        </div>
      `;
    }

    showToast(`Dispatched petition ${ticket.id} (${ticket.category})`, "success");
    this.render();
    if (this.state.dashboardUI) this.state.dashboardUI.render();
  }

  render() {
    this.renderQueueTable();
  }

  renderQueueTable() {
    const tbody = $("#petition-queue-table-body");
    if (!tbody) return;

    const tickets = this.state.registrarQueue.getAll();
    if (tickets.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-muted">No pending student petitions in the registrar queue.</td></tr>`;
      return;
    }

    tbody.innerHTML = tickets.map((t, idx) => {
      const isUrgent = t.urgencyScore >= 8 || t.deadlineDays <= 1;

      return `
        <tr class="${idx === 0 ? 'bg-amber-50 font-semibold' : ''}">
          <td class="font-mono text-xs font-bold">
            ${idx === 0 ? '<span class="badge badge-warning mr-1">TOP PRIORITY</span>' : ''}${t.id}
          </td>
          <td>
            <div class="font-semibold text-slate-900">${t.studentName}</div>
            <div class="text-xs text-muted font-mono">${t.studentId}</div>
          </td>
          <td>
            <div class="text-slate-800 font-medium">${t.category}</div>
            <div class="text-xs text-muted">${t.department}</div>
          </td>
          <td>
            <span class="badge ${t.deadlineDays <= 1 ? 'badge-danger' : 'badge-secondary'}">
              ${t.deadlineDays} ${t.deadlineDays === 1 ? 'Day' : 'Days'}
            </span>
          </td>
          <td>
            <span class="font-bold ${isUrgent ? 'text-rose-600' : 'text-primary'}">${t.urgencyScore} / 10</span>
          </td>
          <td>
            <span class="badge badge-secondary">${t.status}</span>
          </td>
        </tr>
      `;
    }).join("");
  }
}
