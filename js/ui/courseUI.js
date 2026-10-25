// Course Catalog, Prerequisite Dependency Network & Registration Validator UI
// Apex University Student Information System (SIS)

import { $, showToast } from "../utils/dom.js";

export class CourseUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Prerequisite eligibility verification
    const checkEligBtn = $("#btn-verify-registration");
    if (checkEligBtn) {
      checkEligBtn.addEventListener("click", () => {
        this.verifyCourseRegistrationEligibility();
      });
    }

    // Generate recommended degree sequence
    const genRoadmapBtn = $("#btn-generate-roadmap");
    if (genRoadmapBtn) {
      genRoadmapBtn.addEventListener("click", () => {
        this.generateTopologicalRoadmap();
      });
    }
  }

  render() {
    this.renderCourseTable();
    this.renderPrerequisiteNetwork();
    this.populateRegistrationDropdowns();
  }

  renderCourseTable() {
    const tbody = $("#courses-table-body");
    if (!tbody) return;

    tbody.innerHTML = this.state.courses.map(course => {
      const prereqs = course.prerequisites || [];
      const isFull = course.enrolledCount >= course.capacity;

      return `
        <tr>
          <td>
            <div class="font-mono font-bold text-slate-900">${course.code}</div>
            <div class="text-xs text-muted">${course.department}</div>
          </td>
          <td>
            <div class="font-semibold text-slate-900">${course.title}</div>
            <div class="text-xs text-muted">Instructor: ${course.instructor}</div>
          </td>
          <td><span class="badge badge-secondary">${course.credits} Credits</span></td>
          <td>Semester ${course.semester}</td>
          <td>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold ${isFull ? 'text-rose-600' : 'text-emerald-700'}">${course.enrolledCount} / ${course.capacity}</span>
              <span class="badge ${isFull ? 'badge-danger' : 'badge-success'}">${isFull ? 'Waitlist' : 'Open'}</span>
            </div>
          </td>
          <td>
            ${prereqs.length > 0 
              ? prereqs.map(p => `<span class="badge badge-primary font-mono">${p}</span>`).join(" ") 
              : '<span class="text-xs text-muted">None (Foundational)</span>'}
          </td>
        </tr>
      `;
    }).join("");
  }

  renderPrerequisiteNetwork() {
    const container = $("#course-network-container");
    if (!container) return;

    const positions = {
      "CS-101": { x: 80, y: 70 },
      "MATH-102": { x: 80, y: 210 },
      "CS-201": { x: 260, y: 70 },
      "CS-202": { x: 260, y: 210 },
      "CS-301": { x: 460, y: 50 },
      "CS-302": { x: 460, y: 140 },
      "CS-303": { x: 460, y: 230 },
      "CS-401": { x: 670, y: 140 },
      "CS-402": { x: 670, y: 50 },
      "CS-403": { x: 670, y: 230 }
    };

    const edges = [
      { from: "CS-101", to: "CS-201" },
      { from: "CS-101", to: "CS-202" },
      { from: "CS-201", to: "CS-301" },
      { from: "MATH-102", to: "CS-301" },
      { from: "CS-201", to: "CS-302" },
      { from: "CS-202", to: "CS-302" },
      { from: "CS-201", to: "CS-303" },
      { from: "CS-302", to: "CS-401" },
      { from: "CS-301", to: "CS-402" },
      { from: "CS-301", to: "CS-403" },
      { from: "CS-303", to: "CS-403" }
    ];

    let svg = `
      <svg viewBox="0 0 780 300" class="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg shadow-inner">
        <defs>
          <marker id="prereq-arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
          </marker>
        </defs>
    `;

    // Draw Edges
    for (const edge of edges) {
      const p1 = positions[edge.from];
      const p2 = positions[edge.to];
      if (p1 && p2) {
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#93c5fd" stroke-width="2" marker-end="url(#prereq-arrow)"/>`;
      }
    }

    // Draw Nodes
    for (const [code, pos] of Object.entries(positions)) {
      const course = this.state.courses.find(c => c.code === code) || { title: code, credits: 4 };
      svg += `
        <g class="dag-node" transform="translate(${pos.x}, ${pos.y})">
          <rect x="-60" y="-18" width="120" height="36" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="2" class="shadow-sm"/>
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="700" fill="#0f172a" font-family="monospace">${code}</text>
        </g>
      `;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
  }

  populateRegistrationDropdowns() {
    const studentSelect = $("#reg-student-select");
    const courseSelect = $("#reg-course-select");

    if (studentSelect) {
      studentSelect.innerHTML = this.state.students.map(s => 
        `<option value="${s.studentId}">${s.fullName} (${s.studentId}) &bull; ${s.program}</option>`
      ).join("");
    }

    if (courseSelect) {
      courseSelect.innerHTML = this.state.courses.map(c => 
        `<option value="${c.code}">${c.code}: ${c.title} (${c.credits} cr)</option>`
      ).join("");
    }
  }

  verifyCourseRegistrationEligibility() {
    const studentId = $("#reg-student-select")?.value;
    const courseCode = $("#reg-course-select")?.value;
    const resultBox = $("#reg-eligibility-result");

    if (!studentId || !courseCode || !resultBox) return;

    const student = this.state.students.find(s => s.studentId === studentId);
    const course = this.state.courses.find(c => c.code === courseCode);
    if (!student || !course) return;

    const completed = student.enrolledCourses || [];
    const missing = (course.prerequisites || []).filter(p => !completed.includes(p));

    if (missing.length === 0) {
      resultBox.innerHTML = `
        <div class="alert alert-success">
          <div class="font-bold">✓ Registration Cleared & Eligible</div>
          <p class="text-xs mt-1">
            <strong>${student.fullName}</strong> satisfies all prerequisite requirements to enroll in <strong>${course.code} (${course.title})</strong>.
          </p>
          <div class="mt-2 text-xs text-muted">Enrolled Prerequisites Satisfied: [${(course.prerequisites || []).join(", ") || "None Required"}]</div>
        </div>
      `;
      showToast(`Registration cleared for ${course.code}`, "success");
    } else {
      resultBox.innerHTML = `
        <div class="alert alert-danger">
          <div class="font-bold">✕ Registration Blocked: Prerequisite Deficit</div>
          <p class="text-xs mt-1">
            Student has not yet completed mandatory prerequisite course(s): <strong>${missing.join(", ")}</strong>.
          </p>
          <div class="mt-2 text-xs text-muted">Must successfully complete prerequisite coursework before registration can proceed.</div>
        </div>
      `;
      showToast(`Registration blocked: Missing ${missing.join(", ")}`, "error");
    }
  }

  generateTopologicalRoadmap() {
    const resultBox = $("#roadmap-result-box");
    if (!resultBox) return;

    const result = this.state.prereqGraph.topologicalSort();
    resultBox.innerHTML = `
      <div class="alert alert-info mt-3">
        <div class="font-bold mb-2">Recommended Graduation Course Pathway (Optimal Academic Sequence)</div>
        <div class="flex flex-wrap gap-2 items-center">
          ${result.order.map((code, idx) => `
            <div class="flex items-center gap-1">
              <span class="badge badge-primary px-3 py-1 font-mono">${idx + 1}. ${code}</span>
              ${idx < result.order.length - 1 ? '<span class="text-slate-400 font-bold">&rarr;</span>' : ''}
            </div>
          `).join("")}
        </div>
      </div>
    `;
    showToast("Generated recommended degree pathway sequence", "info");
  }
}
