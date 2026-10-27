// Student Self-Service Portal UI
// Dedicated personalized view for enrolled university students
// Handles Profile, Course Self-Registration, Final Exam Admit Cards, Degree Audit & Petitions

import { $, $$, showToast } from "../utils/dom.js";
import { printOfficialTranscript } from "../utils/export.js";
import { DPEngine } from "../dsa/dpEngine.js";
import { ELECTIVE_OPTIMIZER_ITEMS } from "../data.js";

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
    // Student switcher change (delegated to document so it works when banner is updated)
    document.addEventListener("change", (e) => {
      if (e.target.id === "student-portal-identity-select") {
        this.activeStudentId = e.target.value;
        this.render();
        const student = this.getActiveStudent();
        showToast(`Active student session switched to: ${student.fullName} (${student.studentId})`, "info");
      }
    });

    // Student self-petition submission
    document.addEventListener("submit", (e) => {
      if (e.target.id === "student-self-petition-form") {
        e.preventDefault();
        this.handleStudentPetition(new FormData(e.target));
      }
    });

    // Delegated clicks for student portal actions
    document.addEventListener("click", (e) => {
      // Print Transcript
      if (e.target.closest("#btn-student-print-transcript")) {
        const student = this.getActiveStudent();
        if (student) printOfficialTranscript(student);
      }

      // Print Admit Card
      if (e.target.closest("#btn-student-quick-print-hallticket")) {
        const student = this.getActiveStudent();
        const studentExams = (this.state.exams || []).filter(ex => (student.enrolledCourses || []).includes(ex.courseCode));
        if (this.state.controllers.examScheduleUI) {
          this.state.controllers.examScheduleUI.printHallTicketWindow(student, studentExams);
        }
      }

      // Course self-enrollment button click
      const enrollBtn = e.target.closest("[data-student-enroll-course]");
      if (enrollBtn) {
        const courseCode = enrollBtn.getAttribute("data-student-enroll-course");
        this.handleSelfEnrollment(courseCode);
      }

      // Course drop button click
      const dropBtn = e.target.closest("[data-student-drop-course]");
      if (dropBtn) {
        const courseCode = dropBtn.getAttribute("data-student-drop-course");
        this.handleDropCourse(courseCode);
      }

      // Run elective optimization in student portal
      if (e.target.closest("#btn-student-run-elective-opt")) {
        const credits = parseInt($("#student-elective-credits-input")?.value, 10) || 7;
        this.renderStudentElectiveOptimizer(credits);
      }
    });
  }

  getActiveStudent() {
    return this.state.students.find(s => s.studentId === this.activeStudentId) || this.state.students[0];
  }

  render() {
    this.populateStudentSwitcher();
    this.renderStudentHeader();
    this.renderAcademicOverview();
    this.renderRegistrationSection();
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
      <div class="flex flex-wrap justify-between items-center gap-4 p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg shadow-md" style="background: linear-gradient(135deg, #1e3a8a, #312e81);">
        <div class="flex items-center gap-3.5">
          <div class="w-14 h-14 rounded-full bg-blue-100 text-blue-900 font-bold text-2xl flex items-center justify-center border-2 border-white shadow">
            ${student.fullName.charAt(0)}
          </div>
          <div>
            <div class="text-xs text-blue-200 uppercase tracking-wider font-semibold">Student Self-Service Portal &bull; Official Record</div>
            <h2 class="text-xl font-bold">${student.fullName}</h2>
            <div class="text-xs text-blue-100 font-mono">${student.studentId} &bull; ${student.program} &bull; ${student.yearLevel}</div>
          </div>
        </div>

        <div class="flex items-center gap-3 text-right">
          <div class="bg-white/10 px-3.5 py-1.5 rounded border border-white/20">
            <div class="text-[10px] text-blue-200 uppercase font-bold">Cumulative GPA</div>
            <div class="text-lg font-bold text-white">${student.gpa.toFixed(2)} / 4.00</div>
          </div>
          <div class="bg-white/10 px-3.5 py-1.5 rounded border border-white/20">
            <div class="text-[10px] text-blue-200 uppercase font-bold">Earned Credits</div>
            <div class="text-lg font-bold text-white">${student.creditsCompleted} / 128</div>
          </div>
          <div class="bg-white/10 px-3.5 py-1.5 rounded border border-white/20">
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
              <th class="text-right">Action</th>
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
                <td class="text-right">
                  <button class="btn btn-sm btn-outline text-rose-600 hover:bg-rose-50" data-student-drop-course="${c.code}">Drop</button>
                </td>
              </tr>
            `).join("") : '<tr><td colspan="7" class="text-center py-4 text-muted">No active course registrations for this term. Click "+ Add Course" to self-enroll.</td></tr>'}
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
          <div class="text-primary font-mono pt-1 text-[11px]">advisor.${student.department.toLowerCase().replace(/\s+/g, '')}@apex.edu</div>
        </div>
      `;
    }
  }

  renderRegistrationSection() {
    const student = this.getActiveStudent();
    const container = $("#student-registration-container");
    if (!container || !student) return;

    const completed = student.enrolledCourses || [];

    container.innerHTML = `
      <div class="card mb-4">
        <div class="card-header-flex">
          <div>
            <h3 class="card-title">Course Self-Enrollment & Prerequisite Clearance Engine</h3>
            <p class="card-subtitle">Clearance evaluated in real-time for candidate <strong>${student.fullName}</strong> (${student.studentId})</p>
          </div>
          <span class="badge badge-primary font-mono">${completed.length} Currently Enrolled</span>
        </div>

        <div class="table-responsive">
          <table class="data-table text-xs">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title & Faculty Instructor</th>
                <th>Credits</th>
                <th>Term</th>
                <th>Prerequisites Required</th>
                <th>Clearance Status</th>
                <th class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.state.courses.map(course => {
                const isAlreadyEnrolled = completed.includes(course.code);
                const prereqs = course.prerequisites || [];
                const missing = prereqs.filter(p => !completed.includes(p));
                const isEligible = missing.length === 0;

                return `
                  <tr>
                    <td class="font-mono font-bold text-slate-900">${course.code}</td>
                    <td>
                      <div class="font-semibold text-slate-900">${course.title}</div>
                      <div class="text-muted text-[11px]">${course.instructor} &bull; Dept of ${course.department}</div>
                    </td>
                    <td><span class="badge badge-secondary">${course.credits} Credits</span></td>
                    <td>Fall 2026</td>
                    <td>
                      ${prereqs.length > 0 
                        ? prereqs.map(p => `<span class="badge ${completed.includes(p) ? 'badge-success' : 'badge-danger'} font-mono">${p}</span>`).join(" ") 
                        : '<span class="text-muted text-[11px]">No Prerequisites</span>'}
                    </td>
                    <td>
                      ${isAlreadyEnrolled 
                        ? '<span class="badge badge-primary">Active Registration</span>'
                        : isEligible 
                        ? '<span class="badge badge-success">✓ Eligible to Register</span>'
                        : `<span class="badge badge-danger">✕ Missing: ${missing.join(", ")}</span>`}
                    </td>
                    <td class="text-right">
                      ${isAlreadyEnrolled 
                        ? `<button class="btn btn-sm btn-outline text-rose-600 hover:bg-rose-50" data-student-drop-course="${course.code}">Drop</button>`
                        : isEligible 
                        ? `<button class="btn btn-sm btn-primary" data-student-enroll-course="${course.code}">+ Enroll</button>`
                        : '<button class="btn btn-sm btn-outline text-muted" disabled title="Prerequisites not satisfied">Prereq Required</button>'}
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  handleSelfEnrollment(courseCode) {
    const student = this.getActiveStudent();
    if (!student) return;

    if (!student.enrolledCourses) student.enrolledCourses = [];
    if (student.enrolledCourses.includes(courseCode)) {
      showToast(`Already enrolled in ${courseCode}`, "info");
      return;
    }

    const course = this.state.courses.find(c => c.code === courseCode);
    if (!course) return;

    // Prerequisite check
    const missing = (course.prerequisites || []).filter(p => !student.enrolledCourses.includes(p));
    if (missing.length > 0) {
      showToast(`Registration blocked for ${courseCode}: Missing prerequisites: ${missing.join(", ")}`, "error");
      return;
    }

    student.enrolledCourses.push(courseCode);
    course.enrolledCount = (course.enrolledCount || 0) + 1;
    showToast(`Successfully enrolled ${student.fullName} in ${courseCode}: ${course.title}!`, "success");

    this.render();
    if (this.state.controllers.courseUI) this.state.controllers.courseUI.render();
    if (this.state.controllers.examScheduleUI) this.state.controllers.examScheduleUI.render();
  }

  handleDropCourse(courseCode) {
    const student = this.getActiveStudent();
    if (!student || !student.enrolledCourses) return;

    student.enrolledCourses = student.enrolledCourses.filter(c => c !== courseCode);
    const course = this.state.courses.find(c => c.code === courseCode);
    if (course && course.enrolledCount > 0) {
      course.enrolledCount -= 1;
    }

    showToast(`Dropped ${courseCode} from active course schedule for ${student.fullName}.`, "info");

    this.render();
    if (this.state.controllers.courseUI) this.state.controllers.courseUI.render();
    if (this.state.controllers.examScheduleUI) this.state.controllers.examScheduleUI.render();
  }

  renderHallTicketSection() {
    const student = this.getActiveStudent();
    const container = $("#student-hall-ticket-display");
    if (!container || !student) return;

    const studentExams = (this.state.exams || []).filter(e => (student.enrolledCourses || []).includes(e.courseCode));

    container.innerHTML = `
      <div class="card mb-4">
        <div class="hall-ticket-card border-2 border-primary rounded-lg p-5 bg-white shadow-md">
          <div class="flex justify-between items-center border-b-2 border-primary pb-3 mb-4">
            <div>
              <div class="text-xs uppercase font-bold text-primary tracking-wider">Apex University &bull; Division of Examinations</div>
              <h3 class="text-lg font-bold text-slate-900">Official Final Examination Admit Card (Hall Ticket)</h3>
              <div class="text-xs text-muted">Fall Semester 2026 Examination Session</div>
            </div>
            <div class="flex items-center gap-3">
              <button class="btn btn-primary btn-sm" id="btn-student-quick-print-hallticket">🖨️ Print Admit Card</button>
              <div class="text-right">
                <span class="badge badge-success text-xs">Clearance Approved</span>
                <div class="text-xs font-mono text-muted mt-1">Pass #: ADM-${student.studentId.replace('U2024-', '')}-2026</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200 mb-4">
            <div><strong>Candidate Name:</strong><div class="text-slate-900 font-semibold">${student.fullName}</div></div>
            <div><strong>Student ID:</strong><div class="font-mono font-bold text-slate-900">${student.studentId}</div></div>
            <div><strong>Degree Program:</strong><div class="text-slate-800">${student.program}</div></div>
            <div><strong>Academic Standing:</strong><div class="text-emerald-700 font-semibold">${student.status}</div></div>
          </div>

          <h4 class="font-bold text-xs uppercase text-slate-700 mb-2">Scheduled Examination Papers & Venue Allocations</h4>
          <div class="table-responsive mb-4">
            <table class="data-table text-xs">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Paper Title</th>
                  <th>Exam Date</th>
                  <th>Time Session</th>
                  <th>Allocated Room & Desk</th>
                  <th>Chief Proctor</th>
                </tr>
              </thead>
              <tbody>
                ${studentExams.length > 0 ? studentExams.map((e, idx) => `
                  <tr>
                    <td class="font-mono font-bold text-primary">${e.courseCode}</td>
                    <td class="font-medium">${e.courseTitle}</td>
                    <td class="font-semibold">${e.date} (${this.getDayOfWeek(e.date)})</td>
                    <td><span class="badge ${e.session.includes('Morning') ? 'badge-primary' : 'badge-warning'}">${e.session}</span></td>
                    <td><strong class="text-indigo-800">${e.room}</strong> &bull; Desk #${idx * 14 + 12}</td>
                    <td>${e.proctor}</td>
                  </tr>
                `).join("") : '<tr><td colspan="6" class="text-center py-4 text-muted">No scheduled examinations found for active course registrations. Register for courses to generate examination papers.</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded p-3 text-[11px] text-amber-900 leading-relaxed mb-3">
            <strong>Examinee Rules:</strong> Candidates must report to the allocated examination hall at least 15 minutes before the session starts. A physical university photo ID and this printed admit card are mandatory for admission. Mobile devices, smartwatches, and programmable calculators are strictly prohibited.
          </div>

          <div class="flex justify-between items-center text-xs text-muted border-t pt-2">
            <span>Verified by Office of the Registrar &bull; Digitally Signed</span>
            <span>Controller of Examinations, Apex University</span>
          </div>
        </div>
      </div>
    `;
  }

  renderDegreeAuditSection() {
    const student = this.getActiveStudent();
    const container = $("#student-degree-audit-container");
    if (!container || !student) return;

    const coreCourses = ["CS-101", "MATH-102", "CS-201", "CS-202", "CS-301", "CS-302", "CS-303", "CS-401", "CS-403"];
    const completed = student.enrolledCourses || [];
    const satisfied = coreCourses.filter(c => completed.includes(c));
    const remaining = coreCourses.filter(c => !completed.includes(c));
    const percent = Math.min(100, Math.round((student.creditsCompleted / 128) * 100));

    container.innerHTML = `
      <div class="card mb-4">
        <div class="card-header-flex">
          <div>
            <h3 class="card-title">Official Curricular Degree Audit</h3>
            <p class="card-subtitle">Degree requirements evaluation for <strong>${student.fullName}</strong> (${student.program})</p>
          </div>
          <span class="badge badge-primary font-bold">${student.creditsCompleted} / 128 Credits (${percent}%)</span>
        </div>

        <div class="progress-track mb-4">
          <div class="progress-fill" style="width: ${percent}%;"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
            <div class="font-bold text-emerald-900 mb-2">Satisfied Core Courses (${satisfied.length})</div>
            <ul class="space-y-1">
              ${satisfied.map(c => `<li class="font-mono text-emerald-800 font-semibold">&check; ${c}</li>`).join("")}
            </ul>
          </div>
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div class="font-bold text-slate-800 mb-2">Remaining Core Requirements (${remaining.length})</div>
            <ul class="space-y-1">
              ${remaining.map(c => `<li class="font-mono text-slate-600">&bull; ${c}</li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- Elective Specialization Optimizer -->
        <div class="border-t pt-4">
          <div class="flex justify-between items-center mb-2">
            <div>
              <h4 class="font-bold text-sm text-slate-900">Elective Specialization Planner (0/1 Knapsack Optimizer)</h4>
              <p class="text-xs text-muted">Algorithmically calculates highest career-impact course package within your remaining elective credit allowance</p>
            </div>
            <div class="flex items-center gap-2">
              <label for="student-elective-credits-input" class="text-xs font-semibold text-slate-700">Allowance:</label>
              <input type="number" id="student-elective-credits-input" class="form-input text-xs w-16 py-1 text-center" value="7" min="1" max="14" />
              <button class="btn btn-primary btn-sm" id="btn-student-run-elective-opt">Optimize</button>
            </div>
          </div>
          <div id="student-elective-opt-result"></div>
        </div>
      </div>
    `;

    this.renderStudentElectiveOptimizer(7);
  }

  renderStudentElectiveOptimizer(capacityCredits = 7) {
    const items = ELECTIVE_OPTIMIZER_ITEMS.map(item => ({
      id: item.id,
      name: item.name,
      weight: item.credits,
      value: item.careerBenefitScore
    }));

    const result = DPEngine.solve01Knapsack(items, capacityCredits);
    const container = $("#student-elective-opt-result");

    if (container) {
      container.innerHTML = `
        <div class="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 mt-2">
          <div class="font-bold mb-1.5">Recommended Electives for Maximum Career Impact (Optimal Score: ${result.optimalValue} Points &bull; ${result.totalWeightUsed}/${capacityCredits} Credits):</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            ${result.chosenItems.map(item => `
              <div class="flex justify-between items-center bg-white p-2 rounded border border-indigo-100 text-xs">
                <span class="font-semibold text-slate-800">${item.name}</span>
                <span class="badge badge-success font-mono">${item.weight} Credits &bull; Score: ${item.value}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
  }

  renderPetitionsHistory() {
    const student = this.getActiveStudent();
    const container = $("#student-petitions-history-container");
    if (!container || !student) return;

    const tickets = this.state.registrarQueue.getAll().filter(t => t.studentId === student.studentId);

    container.innerHTML = `
      <div class="space-y-2">
        ${tickets.length > 0 ? tickets.map(t => `
          <div class="p-3 bg-white border border-slate-200 rounded-lg shadow-sm text-xs flex justify-between items-start">
            <div>
              <div class="font-bold text-slate-900 text-sm">${t.category}</div>
              <div class="text-[11px] text-muted font-mono mt-0.5">Ticket ID: ${t.id} &bull; Submitted: ${t.submissionDate || 'Recently'} &bull; Due in ${t.deadlineDays} day(s)</div>
              ${t.notes ? `<div class="italic text-slate-700 bg-slate-50 p-1.5 rounded mt-1.5 border border-slate-100">"${t.notes}"</div>` : ''}
            </div>
            <span class="badge ${t.status === 'Approved' ? 'badge-success' : 'badge-warning'} whitespace-nowrap ml-2">${t.status}</span>
          </div>
        `).join("") : '<div class="text-xs text-muted py-4 text-center">No active petitions on file for this student record. Use the form to file a new petition.</div>'}
      </div>
    `;
  }

  handleStudentPetition(formData) {
    const student = this.getActiveStudent();
    const category = formData.get("category")?.trim();
    const deadlineDays = parseInt(formData.get("deadlineDays"), 10) || 3;
    const notes = formData.get("notes")?.trim() || "";

    if (!category || !notes) {
      showToast("Please provide justification notes for your petition", "error");
      return;
    }

    const newReq = {
      id: `REQ-${Math.floor(4000 + Math.random() * 900)}`,
      studentId: student.studentId,
      studentName: student.fullName,
      category,
      department: student.department,
      urgencyScore: 7,
      deadlineDays,
      status: "Pending",
      submissionDate: new Date().toISOString().split("T")[0],
      notes
    };

    this.state.registrarQueue.insert(newReq);
    showToast(`Submitted petition ${newReq.id} to the Office of the Registrar!`, "success");
    $("#student-self-petition-form")?.reset();
    this.renderPetitionsHistory();
  }

  getDayOfWeek(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return isNaN(d.getDay()) ? "" : days[d.getDay()];
  }
}
