// Academic Advisor & Faculty Portal UI
// Dedicated view for Faculty Members and Undergraduate Academic Advisors
// Manages Advisee Roster, Degree Audits, Proctoring Duties, Petitions & Departmental Curriculum

import { $, $$, showToast } from "../utils/dom.js";

export class AdvisorUI {
  constructor(appState) {
    this.state = appState;
    this.advisorName = "Dr. Catherine Hayes";
    this.department = "Computer Science & Artificial Intelligence";
    this.selectedAdviseeId = "U2024-CS-101"; // Default advisee: Marcus Vance
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Endorse petition button clicks
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-endorse-petition]");
      if (btn) {
        const id = btn.getAttribute("data-endorse-petition");
        const ticket = this.state.registrarQueue.getAll().find(t => t.id === id);
        if (ticket) {
          ticket.status = "Approved";
          ticket.notes = (ticket.notes || "") + ` [Endorsed by ${this.advisorName} - Academic Advisor Approval Certified]`;
        }
        showToast(`Endorsed petition ${id} with official faculty advisor recommendation!`, "success");
        this.renderPetitionsTab();
      }

      // Certify proctoring readiness button
      if (e.target.closest("#btn-certify-all-proctoring")) {
        showToast("All assigned examination halls certified ready for invigilation!", "success");
      }

      const singleCertBtn = e.target.closest("[data-certify-hall]");
      if (singleCertBtn) {
        const hallName = singleCertBtn.getAttribute("data-certify-hall");
        showToast(`Certified exam hall readiness for ${hallName}`, "success");
        singleCertBtn.textContent = "✓ Hall Certified";
        singleCertBtn.classList.remove("btn-primary");
        singleCertBtn.classList.add("btn-secondary");
        singleCertBtn.disabled = true;
      }
    });

    // Advisee change inside advisor degree audit tab
    document.addEventListener("change", (e) => {
      if (e.target.id === "advisor-advisee-select") {
        this.selectedAdviseeId = e.target.value;
        this.renderAuditTab();
      }
    });
  }

  render() {
    this.renderAdvisorHeader();
    this.renderAdviseeStats();
    this.renderAdviseeRoster();
    this.renderAuditTab();
    this.renderProctoringTab();
    this.renderPetitionsTab();
    this.renderCoursesTab();
  }

  getAdvisees() {
    return this.state.students.filter(s => s.advisor === this.advisorName);
  }

  renderAdvisorHeader() {
    const container = $("#advisor-header-card");
    if (!container) return;

    container.innerHTML = `
      <div class="p-5 bg-slate-900 text-white rounded-lg shadow-md mb-4 flex flex-wrap justify-between items-center gap-3" style="background: linear-gradient(135deg, #0f172a, #1e293b);">
        <div class="flex items-center gap-3.5">
          <div class="w-13 h-13 rounded-full bg-indigo-500 text-white font-bold text-xl flex items-center justify-center border-2 border-indigo-300">
            CH
          </div>
          <div>
            <div class="text-xs text-indigo-300 uppercase font-bold tracking-wider">Faculty Advising Portal &bull; Academic Year 2026-2027</div>
            <h2 class="text-xl font-bold">${this.advisorName}</h2>
            <div class="text-xs text-slate-300">Senior Faculty Advisor &bull; Department of ${this.department}</div>
          </div>
        </div>
        <div class="text-right">
          <span class="badge badge-primary">Fall Semester 2026</span>
          <div class="text-xs text-slate-400 mt-1">Office: Science Complex 310 &bull; Extension: #4812</div>
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
            <div class="stat-value">${advisees.length} Undergraduates</div>
            <div class="stat-label">Assigned Advisees</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">⭐</div>
          <div>
            <div class="stat-value">${deansList} Students</div>
            <div class="stat-label">Dean's Honor Roll (GPA &ge; 3.75)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">⚠️</div>
          <div>
            <div class="stat-value ${atRisk > 0 ? 'text-rose-600' : 'text-emerald-700'}">${atRisk} Students</div>
            <div class="stat-label">Academic Probation / Warning</div>
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
            <button class="btn btn-sm btn-outline" data-advisee-profile="${s.studentId}">Profile & Transcript</button>
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

  renderAuditTab() {
    const select = $("#advisor-advisee-select");
    const container = $("#advisor-audit-detail-container");
    const advisees = this.getAdvisees();
    if (!container || advisees.length === 0) return;

    if (select) {
      select.innerHTML = advisees.map(s => 
        `<option value="${s.studentId}" ${s.studentId === this.selectedAdviseeId ? 'selected' : ''}>
          ${s.fullName} (${s.studentId}) &bull; ${s.program}
        </option>`
      ).join("");
    }

    const student = advisees.find(s => s.studentId === this.selectedAdviseeId) || advisees[0];
    const coreCourses = ["CS-101", "MATH-102", "CS-201", "CS-202", "CS-301", "CS-302", "CS-303", "CS-401", "CS-403"];
    const completed = student.enrolledCourses || [];
    const satisfied = coreCourses.filter(c => completed.includes(c));
    const remaining = coreCourses.filter(c => !completed.includes(c));
    const percent = Math.min(100, Math.round((student.creditsCompleted / 128) * 100));

    container.innerHTML = `
      <div class="card mb-4">
        <div class="flex justify-between items-center border-b pb-3 mb-3">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Official Curricular Standing & Audit for ${student.fullName}</h4>
            <div class="text-xs text-muted">ID: <code>${student.studentId}</code> &bull; Standing: <strong class="text-emerald-700">${student.status}</strong> &bull; Cumulative GPA: <strong>${student.gpa.toFixed(2)}</strong></div>
          </div>
          <span class="badge badge-primary font-bold">${student.creditsCompleted} / 128 Credits (${percent}%)</span>
        </div>

        <div class="progress-track mb-4">
          <div class="progress-fill" style="width: ${percent}%;"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
            <div class="font-bold text-emerald-900 mb-2">Satisfied Program Requirements (${satisfied.length})</div>
            <ul class="space-y-1">
              ${satisfied.map(c => `<li class="font-mono text-emerald-800 font-semibold">&check; ${c}</li>`).join("")}
            </ul>
          </div>
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div class="font-bold text-slate-800 mb-2">Remaining Degree Milestones (${remaining.length})</div>
            <ul class="space-y-1">
              ${remaining.map(c => `<li class="font-mono text-slate-600">&bull; ${c}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
          <strong>Faculty Advisor Recommendation Note:</strong> Student is currently on target for timely graduation. Recommended next term courses: ${remaining.slice(0, 2).join(", ") || "General Capstone & Electives"}.
        </div>
      </div>
    `;
  }

  renderProctoringTab() {
    const container = $("#advisor-proctoring-schedule");
    if (!container) return;

    const myExams = (this.state.exams || []).filter(e => e.proctor === this.advisorName);

    container.innerHTML = `
      <div class="table-responsive">
        <table class="data-table text-xs">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Paper Title</th>
              <th>Exam Date</th>
              <th>Time Slot</th>
              <th>Allocated Hall / Venue</th>
              <th>Registered Candidates</th>
              <th>Duty Role</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            ${myExams.length > 0 ? myExams.map(e => `
              <tr>
                <td class="font-mono font-bold text-primary">${e.courseCode}</td>
                <td class="font-medium">${e.courseTitle}</td>
                <td class="font-semibold">${e.date}</td>
                <td><span class="badge ${e.session.includes('Morning') ? 'badge-primary' : 'badge-warning'}">${e.session}</span></td>
                <td><strong class="text-indigo-800">${e.room}</strong></td>
                <td>${e.candidates} Students</td>
                <td><span class="badge badge-secondary">Chief Exam Proctor</span></td>
                <td class="text-right">
                  <button class="btn btn-sm btn-primary" data-certify-hall="${e.room}">Certify Hall</button>
                </td>
              </tr>
            `).join("") : '<tr><td colspan="8" class="text-center py-4 text-muted">No invigilation duties scheduled for this term.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  renderPetitionsTab() {
    const container = $("#advisor-petitions-container");
    if (!container) return;

    const adviseeIds = this.getAdvisees().map(s => s.studentId);
    const petitions = this.state.registrarQueue.getAll().filter(t => adviseeIds.includes(t.studentId));

    container.innerHTML = `
      <div class="space-y-2.5">
        ${petitions.length > 0 ? petitions.map(p => `
          <div class="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-wrap justify-between items-center text-xs gap-2">
            <div>
              <div class="font-bold text-slate-900 text-sm">${p.category}</div>
              <div class="text-muted mt-0.5">Student: <strong>${p.studentName}</strong> (<code>${p.studentId}</code>) &bull; Due in ${p.deadlineDays} day(s) &bull; Status: <span class="badge ${p.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${p.status}</span></div>
              ${p.notes ? `<div class="italic text-slate-700 bg-slate-50 p-1.5 rounded mt-1 border border-slate-100">"${p.notes}"</div>` : ''}
            </div>
            <div>
              ${p.status === 'Approved' 
                ? '<button class="btn btn-sm btn-secondary" disabled>✓ Endorsed</button>'
                : `<button class="btn btn-sm btn-primary" data-endorse-petition="${p.id}">Endorse Appeal</button>`}
            </div>
          </div>
        `).join("") : '<div class="text-xs text-muted py-4 text-center">No student petitions currently requiring faculty advisor endorsement.</div>'}
      </div>
    `;
  }

  renderCoursesTab() {
    const container = $("#advisor-courses-container");
    if (!container) return;

    const myCourses = this.state.courses.filter(c => c.instructor === this.advisorName);
    const otherCourses = this.state.courses.filter(c => c.instructor !== this.advisorName);

    container.innerHTML = `
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-sm text-slate-900 mb-2">My Instructed Courses (Lead Faculty: ${this.advisorName})</h4>
          <div class="table-responsive">
            <table class="data-table text-xs">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Credits</th>
                  <th>Enrollment / Capacity</th>
                  <th>Prerequisites Required</th>
                </tr>
              </thead>
              <tbody>
                ${myCourses.map(c => `
                  <tr>
                    <td class="font-mono font-bold text-primary">${c.code}</td>
                    <td class="font-semibold text-slate-900">${c.title}</td>
                    <td><span class="badge badge-secondary">${c.credits} Credits</span></td>
                    <td><strong>${c.enrolledCount}</strong> / ${c.capacity} Students</td>
                    <td>${(c.prerequisites || []).map(p => `<span class="badge badge-primary font-mono">${p}</span>`).join(" ") || 'None'}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 class="font-bold text-sm text-slate-900 mb-2">Other Departmental Curriculum Offerings</h4>
          <div class="table-responsive">
            <table class="data-table text-xs">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title & Instructor</th>
                  <th>Credits</th>
                  <th>Enrollment</th>
                </tr>
              </thead>
              <tbody>
                ${otherCourses.map(c => `
                  <tr>
                    <td class="font-mono font-bold text-slate-700">${c.code}</td>
                    <td>${c.title} &bull; <span class="text-muted">${c.instructor}</span></td>
                    <td>${c.credits} Credits</td>
                    <td>${c.enrolledCount} / ${c.capacity}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}
