// Student Self-Service Portal UI
// Dedicated personalized view for enrolled university students

import { $, $$, showToast } from "../utils/dom.js";
import { printOfficialTranscript } from "../utils/export.js";

export class StudentPortalUI {
  constructor(appState) {
    this.state = appState;
    this.activeStudentId = "U2024-CS-101"; // Default: Marcus Vance
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Student switcher dropdown
    const select = $("#student-portal-identity-select");
    if (select) {
      select.addEventListener("change", (e) => {
        this.activeStudentId = e.target.value;
        this.render();
        const student = this.getActiveStudent();
        showToast(`Switched active student session to: ${student.fullName}`, "info");
      });
    }

    // Print Transcript from Student Portal
    const printTranscriptBtn = $("#btn-student-print-transcript");
    if (printTranscriptBtn) {
      printTranscriptBtn.addEventListener("click", () => {
        const student = this.getActiveStudent();
        if (student) printOfficialTranscript(student);
      });
    }

    // Student self-petition submission
    const petForm = $("#student-self-petition-form");
    if (petForm) {
      petForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleStudentPetition(new FormData(petForm));
      });
    }

    // Sub-tab navigation inside student portal
    $$("[data-student-subtab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-student-subtab");
        this.switchSubtab(target);
      });
    });
  }

  getActiveStudent() {
    return this.state.students.find(s => s.studentId === this.activeStudentId) || this.state.students[0];
  }

  render() {
    this.populateStudentSwitcher();
    this.renderStudentHeader();
    this.renderAcademicOverview();
    this.renderHallTicketSection();
    this.renderDegreeAuditSection();
    this.renderPetitionsHistory();
  }

  populateStudentSwitcher() {
    const select = $("#student-portal-identity-select");
    if (!select) return;

    select.innerHTML = this.state.students.map(s => 
      `<option value="${s.studentId}" ${s.studentId === this.activeStudentId ? 'selected' : ''}>
        ${s.fullName} (${s.studentId}) &bull; ${s.program}
      </option>`
    ).join("");
  }

  renderStudentHeader() {
    const student = this.getActiveStudent();
    const container = $("#student-portal-header-card");
    if (!container || !student) return;

    container.innerHTML = `
      <div class="flex flex-wrap justify-between items-center gap-4 p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg shadow-md" style="background: linear-gradient(135deg, #1e3a8a, #312e81);">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-full bg-blue-100 text-blue-900 font-bold text-2xl flex items-center justify-center border-2 border-white shadow">
            ${student.fullName.charAt(0)}
          </div>
          <div>
            <div class="text-xs text-blue-200 uppercase tracking-wider font-semibold">Student Self-Service Portal</div>
            <h2 class="text-xl font-bold">${student.fullName}</h2>
            <div class="text-xs text-blue-100 font-mono">${student.studentId} &bull; ${student.program} &bull; ${student.yearLevel}</div>
          </div>
        </div>

        <div class="flex items-center gap-3 text-right">
          <div class="bg-white/10 px-3 py-1.5 rounded border border-white/20">
            <div class="text-[10px] text-blue-200 uppercase font-bold">Cumulative GPA</div>
            <div class="text-lg font-bold text-white">${student.gpa.toFixed(2)} / 4.00</div>
          </div>
          <div class="bg-white/10 px-3 py-1.5 rounded border border-white/20">
            <div class="text-[10px] text-blue-200 uppercase font-bold">Completed Credits</div>
            <div class="text-lg font-bold text-white">${student.creditsCompleted} / 128</div>
          </div>
          <div class="bg-white/10 px-3 py-1.5 rounded border border-white/20">
            <div class="text-[10px] text-blue-200 uppercase font-bold">Standing</div>
            <div class="text-sm font-bold text-emerald-300">${student.status}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderAcademicOverview() {
    const student = this.getActiveStudent();
    const container = $("#student-enrolled-courses-list");
    if (!container || !student) return;

    const enrolled = student.enrolledCourses || [];
    const courses = this.state.courses.filter(c => enrolled.includes(c.code));

    container.innerHTML = `
      <div class="table-responsive">
        <table class="data-table text-xs">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Instructor</th>
              <th>Credits</th>
              <th>Term</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${courses.length > 0 ? courses.map(c => `
              <tr>
                <td class="font-mono font-bold text-slate-900">${c.code}</td>
                <td class="font-semibold">${c.title}</td>
                <td>${c.instructor}</td>
                <td><span class="badge badge-secondary">${c.credits} Credits</span></td>
                <td>Fall Semester 2026</td>
                <td><span class="badge badge-success">Enrolled & Active</span></td>
              </tr>
            `).join("") : '<tr><td colspan="6" class="text-center py-4 text-muted">No active course registrations for this term.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;

    // Advisor info box
    const advisorBox = $("#student-advisor-card-content");
    if (advisorBox) {
      advisorBox.innerHTML = `
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
          <div class="font-bold text-slate-900 text-sm">${student.advisor || 'Office of Undergraduate Studies'}</div>
          <div class="text-slate-600">Faculty Academic Advisor &bull; Dept of ${student.department}</div>
          <div class="text-muted">Office Hours: Mon/Wed 14:00 - 16:00 &bull; Hall of Sciences Room 310</div>
          <div class="text-primary font-mono pt-1">advisor.${student.department.toLowerCase().replace(/\s+/g, '')}@apex.edu</div>
        </div>
      `;
    }
  }

  renderHallTicketSection() {
    const student = this.getActiveStudent();
    const container = $("#student-hall-ticket-display");
    if (!container || !student) return;

    const studentExams = (this.state.exams || []).filter(e => (student.enrolledCourses || []).includes(e.courseCode));

    container.innerHTML = `
      <div class="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
        <div class="flex justify-between items-center border-b pb-2 mb-3">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Fall 2026 Final Examination Admit Card</h4>
            <div class="text-xs text-muted">Verified examination hall and desk assignments for ${student.fullName}</div>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-student-quick-print-hallticket">🖨️ Print Admit Card</button>
        </div>

        <div class="table-responsive mb-3">
          <table class="data-table text-xs">
            <thead>
              <tr>
                <th>Course</th>
                <th>Course Name</th>
                <th>Exam Date</th>
                <th>Session Time</th>
                <th>Allocated Room & Desk</th>
              </tr>
            </thead>
            <tbody>
              ${studentExams.length > 0 ? studentExams.map((e, idx) => `
                <tr>
                  <td class="font-mono font-bold text-slate-900">${e.courseCode}</td>
                  <td class="font-semibold">${e.courseTitle}</td>
                  <td><strong>${e.date}</strong></td>
                  <td><span class="badge badge-primary">${e.session}</span></td>
                  <td><strong class="text-indigo-800">${e.room}</strong> &bull; Desk #${idx * 14 + 12}</td>
                </tr>
              `).join("") : '<tr><td colspan="5" class="text-center py-4 text-muted">No scheduled examinations found for enrolled courses.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;

    $("#btn-student-quick-print-hallticket")?.addEventListener("click", () => {
      if (this.state.controllers.examScheduleUI) {
        this.state.controllers.examScheduleUI.printHallTicketWindow(student, studentExams);
      }
    });
  }

  renderDegreeAuditSection() {
    const student = this.getActiveStudent();
    const container = $("#student-degree-audit-container");
    if (!container || !student) return;

    const coreCourses = ["CS-101", "MATH-102", "CS-201", "CS-202", "CS-301", "CS-302", "CS-303", "CS-401", "CS-403"];
    const completed = student.enrolledCourses || [];
    const satisfied = coreCourses.filter(c => completed.includes(c));
    const percent = Math.round((student.creditsCompleted / 128) * 100);

    container.innerHTML = `
      <div class="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-sm text-slate-900">Graduation Progress (${student.creditsCompleted} of 128 Credits)</div>
          <span class="badge badge-primary">${percent}% Completed</span>
        </div>
        <div class="progress-track mb-3">
          <div class="progress-fill" style="width: ${percent}%;"></div>
        </div>

        <div class="text-xs text-slate-700">
          <strong>Satisfied Core Requirements:</strong> ${satisfied.join(", ") || "None"}
        </div>
      </div>
    `;
  }

  renderPetitionsHistory() {
    const student = this.getActiveStudent();
    const container = $("#student-petitions-history-container");
    if (!container || !student) return;

    const tickets = this.state.registrarQueue.getAll().filter(t => t.studentId === student.studentId);

    container.innerHTML = `
      <div class="border border-slate-200 rounded-lg p-3 bg-white shadow-sm">
        <div class="font-bold text-xs uppercase tracking-wide text-slate-700 mb-2">My Submitted Registrar Petitions</div>
        ${tickets.length > 0 ? tickets.map(t => `
          <div class="flex justify-between items-center p-2 bg-slate-50 border border-slate-200 rounded text-xs mb-1.5">
            <div>
              <strong class="font-mono text-slate-900">${t.id}:</strong> ${t.category}
              <div class="text-[11px] text-muted">Submitted on ${t.submissionDate || 'Recently'} &bull; Priority Score: ${t.urgencyScore}/10</div>
            </div>
            <span class="badge badge-warning">${t.status}</span>
          </div>
        `).join("") : '<div class="text-xs text-muted py-2">No active petitions filed under this student ID.</div>'}
      </div>
    `;
  }

  handleStudentPetition(formData) {
    const student = this.getActiveStudent();
    const category = formData.get("category")?.trim();
    const notes = formData.get("notes")?.trim() || "";

    if (!category) return;

    const newReq = {
      id: `REQ-${Math.floor(4000 + Math.random() * 900)}`,
      studentId: student.studentId,
      studentName: student.fullName,
      category,
      department: student.department,
      urgencyScore: 7,
      deadlineDays: 3,
      status: "Pending",
      submissionDate: new Date().toISOString().split("T")[0],
      notes
    };

    this.state.registrarQueue.insert(newReq);
    showToast(`Filed petition ${newReq.id}: ${category}`, "success");
    $("#student-self-petition-form")?.reset();
    this.renderPetitionsHistory();
  }

  switchSubtab(target) {
    $$("[data-student-subtab]").forEach(btn => {
      btn.classList.toggle("tab-active", btn.getAttribute("data-student-subtab") === target);
    });

    $$(".student-subpanel").forEach(p => {
      p.classList.toggle("hidden", p.id !== `subpanel-${target}`);
    });
  }
}
