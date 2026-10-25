// Academic Advisor & Faculty Portal UI
// Dedicated view for Faculty Members and Undergraduate Academic Advisors

import { $, showToast } from "../utils/dom.js";

export class AdvisorUI {
  constructor(appState) {
    this.state = appState;
    this.advisorName = "Dr. Catherine Hayes";
    this.department = "Computer Science & Artificial Intelligence";
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Endorse petition button clicks
    const container = $("#advisor-petitions-container");
    if (container) {
      container.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-endorse-petition]");
        if (btn) {
          const id = btn.getAttribute("data-endorse-petition");
          showToast(`Endorsed petition ${id} with positive faculty recommendation`, "success");
          btn.textContent = "✓ Endorsed";
          btn.disabled = true;
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-secondary");
        }
      });
    }
  }

  render() {
    this.renderAdvisorHeader();
    this.renderAdviseeStats();
    this.renderAdviseeRoster();
    this.renderFacultyProctoringSchedule();
    this.renderAdvisorPetitions();
  }

  getAdvisees() {
    return this.state.students.filter(s => s.advisor === this.advisorName);
  }

  renderAdvisorHeader() {
    const container = $("#advisor-header-card");
    if (!container) return;

    container.innerHTML = `
      <div class="p-4 bg-slate-900 text-white rounded-lg shadow-md mb-4 flex justify-between items-center" style="background: linear-gradient(135deg, #0f172a, #1e293b);">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-indigo-500 text-white font-bold text-xl flex items-center justify-center">
            CH
          </div>
          <div>
            <div class="text-xs text-indigo-300 uppercase font-bold tracking-wider">Faculty Advising Portal</div>
            <h2 class="text-lg font-bold">${this.advisorName}</h2>
            <div class="text-xs text-slate-300">Senior Faculty Advisor &bull; Dept of ${this.department}</div>
          </div>
        </div>
        <div class="text-right">
          <span class="badge badge-primary">Fall 2026 Term</span>
          <div class="text-xs text-slate-400 mt-1">Office: Science Complex 310</div>
        </div>
      </div>
    `;
  }

  renderAdviseeStats() {
    const advisees = this.getAdvisees();
    const deansList = advisees.filter(s => s.gpa >= 3.75).length;
    const atRisk = advisees.filter(s => s.gpa < 3.00).length;

    const container = $("#advisor-metrics-container");
    if (!container) return;

    container.innerHTML = `
      <div class="stats-grid mb-4">
        <div class="stat-card">
          <div class="stat-icon blue">👥</div>
          <div>
            <div class="stat-value">${advisees.length}</div>
            <div class="stat-label">Assigned Advisees</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">⭐</div>
          <div>
            <div class="stat-value">${deansList}</div>
            <div class="stat-label">Dean's Honor Roll</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">⚠️</div>
          <div>
            <div class="stat-value text-rose-600">${atRisk}</div>
            <div class="stat-label">At-Risk / Academic Warning</div>
          </div>
        </div>
      </div>
    `;
  }

  renderAdviseeRoster() {
    const tbody = $("#advisor-advisees-tbody");
    if (!tbody) return;

    const advisees = this.getAdvisees();

    tbody.innerHTML = advisees.map(s => {
      const gpaClass = s.gpa >= 3.80 ? 'cgpa-high' : s.gpa >= 3.20 ? 'cgpa-mid' : 'cgpa-avg';
      return `
        <tr>
          <td class="font-mono text-xs font-bold text-slate-900">${s.studentId}</td>
          <td>
            <div class="font-semibold text-slate-900">${s.fullName}</div>
            <div class="text-xs text-muted">${s.email}</div>
          </td>
          <td>${s.program}</td>
          <td>${s.yearLevel}</td>
          <td>
            <span class="cgpa-pill ${gpaClass}">${s.gpa.toFixed(2)}</span>
          </td>
          <td>
            <span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}">${s.status}</span>
          </td>
          <td class="text-right">
            <button class="btn btn-sm btn-outline" data-advisee-profile="${s.studentId}">Advise</button>
          </td>
        </tr>
      `;
    }).join("");

    $$("[data-advisee-profile]", tbody).forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-advisee-profile");
        if (this.state.controllers.studentUI) {
          this.state.controllers.studentUI.openStudentDetailModal(id);
        }
      });
    });
  }

  renderFacultyProctoringSchedule() {
    const container = $("#advisor-proctoring-schedule");
    if (!container) return;

    const myExams = (this.state.exams || []).filter(e => e.proctor === this.advisorName);

    container.innerHTML = `
      <div class="table-responsive">
        <table class="data-table text-xs">
          <thead>
            <tr>
              <th>Course</th>
              <th>Course Title</th>
              <th>Exam Date</th>
              <th>Session</th>
              <th>Venue / Room</th>
              <th>Duty Role</th>
            </tr>
          </thead>
          <tbody>
            ${myExams.length > 0 ? myExams.map(e => `
              <tr>
                <td class="font-mono font-bold">${e.courseCode}</td>
                <td>${e.courseTitle}</td>
                <td class="font-semibold">${e.date}</td>
                <td><span class="badge badge-primary">${e.session}</span></td>
                <td><strong>${e.room}</strong></td>
                <td><span class="badge badge-secondary">Chief Exam Proctor</span></td>
              </tr>
            `).join("") : '<tr><td colspan="6" class="text-center py-4 text-muted">No proctoring assignments for this examination term.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  renderAdvisorPetitions() {
    const container = $("#advisor-petitions-container");
    if (!container) return;

    const adviseeIds = this.getAdvisees().map(s => s.studentId);
    const petitions = this.state.registrarQueue.getAll().filter(t => adviseeIds.includes(t.studentId));

    container.innerHTML = `
      <div class="space-y-2">
        ${petitions.length > 0 ? petitions.map(p => `
          <div class="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex justify-between items-center text-xs">
            <div>
              <div class="font-bold text-slate-900">${p.category}</div>
              <div class="text-muted">Student: <strong>${p.studentName}</strong> (${p.studentId}) &bull; Due in ${p.deadlineDays} day(s)</div>
              ${p.notes ? `<div class="italic text-slate-600 mt-1">"${p.notes}"</div>` : ''}
            </div>
            <button class="btn btn-sm btn-primary" data-endorse-petition="${p.id}">Endorse Appeal</button>
          </div>
        `).join("") : '<div class="text-xs text-muted py-3">No student petitions currently requiring faculty advisor endorsement.</div>'}
      </div>
    `;
  }
}
