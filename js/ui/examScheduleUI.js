// University Final Examination Timetable & Hall Ticket System
// Enterprise features: Master timetable, Room/Proctor scheduling, Conflict detection, and Student Admit Cards

import { $, $$, showToast, setupModal } from "../utils/dom.js";

export class ExamScheduleUI {
  constructor(appState) {
    this.state = appState;
    this.exams = [...this.state.exams];
    this.hallTicketModal = null;
    this.addExamModal = null;
  }

  init() {
    this.hallTicketModal = setupModal("hall-ticket-modal");
    this.addExamModal = setupModal("add-exam-modal");

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Search exams input
    const searchInput = $("#exam-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filterExams(e.target.value.trim());
      });
    }

    // Filter by session
    const sessionFilter = $("#exam-session-filter");
    if (sessionFilter) {
      sessionFilter.addEventListener("change", (e) => {
        this.renderTable(this.getFilteredExams());
      });
    }

    // Filter by room
    const roomFilter = $("#exam-room-filter");
    if (roomFilter) {
      roomFilter.addEventListener("change", (e) => {
        this.renderTable(this.getFilteredExams());
      });
    }

    // Add Exam Modal button
    const addExamBtn = $("#btn-open-add-exam");
    if (addExamBtn) {
      addExamBtn.addEventListener("click", () => {
        this.openAddExamModal();
      });
    }

    // Add Exam Form submit
    const addExamForm = $("#add-exam-form");
    if (addExamForm) {
      addExamForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleAddExam(new FormData(addExamForm));
      });
    }

    // Check / Resolve clashes button
    const clashBtn = $("#btn-run-exam-clash-check");
    if (clashBtn) {
      clashBtn.addEventListener("click", () => {
        this.runClashDetection();
      });
    }

    // Look up Student Hall Ticket button
    const lookupTicketBtn = $("#btn-lookup-hall-ticket");
    if (lookupTicketBtn) {
      lookupTicketBtn.addEventListener("click", () => {
        const studentId = $("#hall-ticket-student-select")?.value;
        if (studentId) {
          this.showStudentHallTicket(studentId);
        }
      });
    }
  }

  render() {
    this.populateStudentDropdown();
    this.renderRoomFilterOptions();
    this.renderTable();
    this.renderSessionCards();
  }

  populateStudentDropdown() {
    const select = $("#hall-ticket-student-select");
    if (!select) return;

    select.innerHTML = this.state.students.map(s => 
      `<option value="${s.studentId}">${s.fullName} (${s.studentId}) &bull; ${(s.enrolledCourses || []).join(", ")}</option>`
    ).join("");
  }

  renderRoomFilterOptions() {
    const select = $("#exam-room-filter");
    if (!select) return;

    const rooms = Array.from(new Set(this.exams.map(e => e.room)));
    select.innerHTML = `<option value="all">All Examination Halls</option>` + 
      rooms.map(r => `<option value="${r}">${r}</option>`).join("");
  }

  getFilteredExams() {
    const session = $("#exam-session-filter")?.value || "all";
    const room = $("#exam-room-filter")?.value || "all";
    const query = $("#exam-search-input")?.value?.trim().toLowerCase() || "";

    return this.exams.filter(e => {
      const matchSession = session === "all" || (session === "Morning" && e.session.includes("Morning")) || (session === "Afternoon" && e.session.includes("Afternoon"));
      const matchRoom = room === "all" || e.room === room;
      const matchQuery = !query || e.courseCode.toLowerCase().includes(query) || e.courseTitle.toLowerCase().includes(query) || e.proctor.toLowerCase().includes(query);
      return matchSession && matchRoom && matchQuery;
    });
  }

  filterExams() {
    this.renderTable(this.getFilteredExams());
  }

  renderTable(list = this.exams) {
    const tbody = $("#exam-timetable-tbody");
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-muted">No examination sessions match the selected filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(exam => {
      const isMorning = exam.session.includes("Morning");
      return `
        <tr>
          <td>
            <div class="font-mono font-bold text-slate-900">${exam.courseCode}</div>
            <div class="text-xs text-muted font-mono">${exam.id}</div>
          </td>
          <td>
            <div class="font-semibold text-slate-900">${exam.courseTitle}</div>
            <div class="text-xs text-muted">Chief Proctor: ${exam.proctor}</div>
          </td>
          <td>
            <div class="font-bold text-xs text-slate-800">${exam.date}</div>
            <div class="text-xs text-slate-500">${this.getDayOfWeek(exam.date)}</div>
          </td>
          <td>
            <span class="badge ${isMorning ? 'badge-primary' : 'badge-warning'}">
              ${exam.session}
            </span>
          </td>
          <td>
            <div class="font-medium text-xs text-slate-800">${exam.room}</div>
            <div class="text-xs text-muted">${exam.candidates} Registered Examinees</div>
          </td>
          <td>
            <span class="badge badge-success">${exam.status}</span>
          </td>
          <td class="text-right">
            <button class="btn btn-sm btn-outline" data-exam-details="${exam.id}">Details</button>
          </td>
        </tr>
      `;
    }).join("");

    $$("[data-exam-details]", tbody).forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-exam-details");
        const ex = this.exams.find(e => e.id === id);
        if (ex) {
          showToast(`Exam ${ex.courseCode}: Scheduled on ${ex.date} (${ex.session}) in ${ex.room}.`, "info");
        }
      });
    });
  }

  renderSessionCards() {
    const container = $("#exam-daily-session-cards");
    if (!container) return;

    // Group exams by session
    const morningExams = this.exams.filter(e => e.session.includes("Morning"));
    const afternoonExams = this.exams.filter(e => e.session.includes("Afternoon"));

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="border border-slate-200 rounded-lg p-3 bg-white shadow-sm">
          <div class="flex justify-between items-center border-b pb-2 mb-2">
            <span class="font-bold text-xs uppercase tracking-wide text-primary">🌅 Morning Exam Sessions (09:00 - 12:00)</span>
            <span class="badge badge-primary">${morningExams.length} Courses</span>
          </div>
          <div class="space-y-1.5 max-h-48 overflow-y-auto">
            ${morningExams.map(e => `
              <div class="flex justify-between items-center text-xs p-1.5 bg-slate-50 rounded border border-slate-100">
                <div>
                  <strong class="font-mono text-slate-900">${e.courseCode}:</strong> ${e.courseTitle}
                  <div class="text-muted text-[11px]">${e.date} &bull; ${e.room}</div>
                </div>
                <span class="badge badge-secondary">${e.candidates} Stud.</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="border border-slate-200 rounded-lg p-3 bg-white shadow-sm">
          <div class="flex justify-between items-center border-b pb-2 mb-2">
            <span class="font-bold text-xs uppercase tracking-wide text-amber-700">🌇 Afternoon Exam Sessions (14:00 - 17:00)</span>
            <span class="badge badge-warning">${afternoonExams.length} Courses</span>
          </div>
          <div class="space-y-1.5 max-h-48 overflow-y-auto">
            ${afternoonExams.map(e => `
              <div class="flex justify-between items-center text-xs p-1.5 bg-slate-50 rounded border border-slate-100">
                <div>
                  <strong class="font-mono text-slate-900">${e.courseCode}:</strong> ${e.courseTitle}
                  <div class="text-muted text-[11px]">${e.date} &bull; ${e.room}</div>
                </div>
                <span class="badge badge-secondary">${e.candidates} Stud.</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  runClashDetection() {
    const banner = $("#exam-clash-status-banner");
    
    // Check conflicts: For each student, check if they have 2 exams on same date and same session
    const conflictsFound = [];

    this.state.students.forEach(student => {
      const studentExams = this.exams.filter(e => (student.enrolledCourses || []).includes(e.courseCode));
      const seenSlots = {};

      studentExams.forEach(e => {
        const key = `${e.date}_${e.session}`;
        if (seenSlots[key]) {
          conflictsFound.push({
            student: student.fullName,
            studentId: student.studentId,
            exam1: seenSlots[key],
            exam2: e.courseCode,
            slot: key
          });
        } else {
          seenSlots[key] = e.courseCode;
        }
      });
    });

    if (banner) {
      if (conflictsFound.length === 0) {
        banner.innerHTML = `
          <div class="alert alert-success animate-fade-in mb-4">
            <div class="flex items-center gap-2">
              <span class="text-lg">✓</span>
              <div>
                <strong class="font-bold text-sm">Automated Conflict Resolution Certified: ZERO Schedule Clashes!</strong>
                <p class="text-xs text-slate-700 mt-0.5">
                  Verified all ${this.state.students.length} enrolled undergraduate cohorts across ${this.exams.length} examination courses. Every multi-course student has strictly separated morning and afternoon sessions.
                </p>
              </div>
            </div>
          </div>
        `;
        showToast("Timetable clash scan passed: 0 conflicts detected!", "success");
      } else {
        banner.innerHTML = `
          <div class="alert alert-danger mb-4">
            <strong class="font-bold">⚠️ Warning: Detected ${conflictsFound.length} Schedule Conflicts!</strong>
            <p class="text-xs mt-1">The following students have overlapping examination timings:</p>
            <ul class="text-xs list-disc pl-5 mt-1 space-y-0.5">
              ${conflictsFound.map(c => `<li>${c.student} (${c.studentId}) enrolled in both ${c.exam1} & ${c.exam2} on ${c.slot}</li>`).join("")}
            </ul>
          </div>
        `;
        showToast(`Detected ${conflictsFound.length} exam clashes!`, "error");
      }
    }
  }

  showStudentHallTicket(studentId) {
    const student = this.state.students.find(s => s.studentId === studentId);
    if (!student) return;

    const studentExams = this.exams.filter(e => (student.enrolledCourses || []).includes(e.courseCode));
    const container = $("#hall-ticket-modal-body");

    if (container) {
      container.innerHTML = `
        <div class="hall-ticket-card border-2 border-primary rounded-lg p-4 bg-white shadow-md">
          <div class="flex justify-between items-center border-b-2 border-primary pb-3 mb-3">
            <div>
              <div class="text-xs uppercase font-bold text-primary tracking-wider">Apex University &bull; Division of Examinations</div>
              <h3 class="text-lg font-bold text-slate-900">Official Final Examination Admit Card (Hall Ticket)</h3>
              <div class="text-xs text-muted">Fall Semester 2026 Examination Session</div>
            </div>
            <div class="text-right">
              <span class="badge badge-success text-xs">Clearance Approved</span>
              <div class="text-xs font-mono text-muted mt-1">Ticket #: ADM-${student.studentId.replace('U2024-', '')}-2026</div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-200 mb-3">
            <div><strong>Candidate Name:</strong><div class="text-slate-900 font-semibold">${student.fullName}</div></div>
            <div><strong>Student ID:</strong><div class="font-mono font-bold text-slate-900">${student.studentId}</div></div>
            <div><strong>Degree Program:</strong><div class="text-slate-800">${student.program}</div></div>
            <div><strong>Academic Standing:</strong><div class="text-emerald-700 font-semibold">${student.status}</div></div>
          </div>

          <h4 class="font-bold text-xs uppercase text-slate-700 mb-1.5">Scheduled Examination Papers & Venue Allocation</h4>
          <div class="table-responsive mb-3">
            <table class="data-table text-xs">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Paper Title</th>
                  <th>Exam Date</th>
                  <th>Time Slot</th>
                  <th>Assigned Hall / Desk</th>
                </tr>
              </thead>
              <tbody>
                ${studentExams.length > 0 ? studentExams.map((e, idx) => `
                  <tr>
                    <td class="font-mono font-bold">${e.courseCode}</td>
                    <td>${e.courseTitle}</td>
                    <td class="font-semibold">${e.date} (${this.getDayOfWeek(e.date)})</td>
                    <td><span class="badge badge-primary">${e.session}</span></td>
                    <td><strong class="text-indigo-800">${e.room}</strong> &bull; Desk #${idx * 14 + 12}</td>
                  </tr>
                `).join("") : '<tr><td colspan="5" class="text-center py-4 text-muted">No scheduled exams found for active course registrations.</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded p-2.5 text-[11px] text-amber-900 leading-relaxed mb-3">
            <strong>Examinee Rules:</strong> Candidates must report to the allocated examination hall at least 15 minutes before the session starts. A physical university photo ID and this printed admit card are mandatory. Electronic devices are strictly prohibited.
          </div>

          <div class="flex justify-between items-center text-xs text-muted border-t pt-2">
            <span>Verified by Office of the Registrar &bull; Digitally Signed</span>
            <span>Controller of Examinations</span>
          </div>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button class="btn btn-outline" data-close-modal="hall-ticket-modal">Close</button>
          <button class="btn btn-primary" id="btn-print-hall-ticket-now">🖨️ Print Admit Card</button>
        </div>
      `;

      $("#btn-print-hall-ticket-now")?.addEventListener("click", () => {
        this.printHallTicketWindow(student, studentExams);
      });
    }

    this.hallTicketModal.show();
  }

  printHallTicketWindow(student, studentExams) {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Examination Admit Card - ${student.fullName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .header h1 { font-size: 22px; margin: 0; color: #1e3a8a; }
            .meta { background: #f8fafc; border: 1px solid #cbd5e1; padding: 14px; border-radius: 6px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th { background: #f1f5f9; padding: 8px 10px; text-align: left; border-bottom: 2px solid #cbd5e1; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
            .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Apex University</h1>
              <p style="margin: 3px 0 0; font-size: 13px; color: #475569;">Final Examination Admit Card &bull; Fall Semester 2026</p>
            </div>
            <div style="text-align: right; font-size: 12px;">
              <strong>Admit Card #: ADM-${student.studentId.replace('U2024-', '')}</strong>
            </div>
          </div>
          <div class="meta">
            <div><strong>Candidate Name:</strong> ${student.fullName}</div>
            <div><strong>Student ID:</strong> ${student.studentId}</div>
            <div><strong>Major:</strong> ${student.program}</div>
            <div><strong>Department:</strong> ${student.department}</div>
          </div>
          <h3>Allocated Examination Papers & Timings</h3>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Course Title</th>
                <th>Exam Date</th>
                <th>Time Session</th>
                <th>Examination Hall & Desk</th>
              </tr>
            </thead>
            <tbody>
              ${studentExams.map((e, idx) => `
                <tr>
                  <td style="font-family: monospace; font-weight: bold;">${e.courseCode}</td>
                  <td>${e.courseTitle}</td>
                  <td>${e.date}</td>
                  <td>${e.session}</td>
                  <td><strong>${e.room}</strong> (Desk #${idx * 14 + 12})</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer">
            <span>Verified by University Examination Board</span>
            <span>Controller of Examinations</span>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  openAddExamModal() {
    const form = $("#add-exam-form");
    if (form) form.reset();
    this.addExamModal.show();
  }

  handleAddExam(formData) {
    const courseCode = formData.get("courseCode")?.trim();
    const courseTitle = formData.get("courseTitle")?.trim();
    const date = formData.get("date")?.trim();
    const session = formData.get("session")?.trim();
    const room = formData.get("room")?.trim();
    const proctor = formData.get("proctor")?.trim() || "Faculty Proctor";
    const candidates = parseInt(formData.get("candidates"), 10) || 50;

    if (!courseCode || !courseTitle || !date || !room) {
      showToast("Please fill all required examination scheduling fields", "error");
      return;
    }

    const newExam = {
      id: `EXAM-${Math.floor(500 + Math.random() * 400)}`,
      courseCode,
      courseTitle,
      date,
      session,
      room,
      proctor,
      candidates,
      status: "Scheduled"
    };

    this.exams.push(newExam);
    this.state.exams = this.exams;
    showToast(`Scheduled exam session for ${courseCode} on ${date}`, "success");
    this.addExamModal.close();
    this.render();
  }

  getDayOfWeek(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return isNaN(d.getDay()) ? "" : days[d.getDay()];
  }
}
