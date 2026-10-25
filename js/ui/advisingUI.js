// Academic Advising & Degree Planning Tool UI
// Powered by Dynamic Programming Optimization & Degree Audit Engine

import { $, showToast } from "../utils/dom.js";
import { DPEngine } from "../dsa/dpEngine.js";
import { ELECTIVE_OPTIMIZER_ITEMS } from "../data.js";

export class AdvisingUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Elective optimizer run
    const runOptBtn = $("#btn-run-elective-opt");
    if (runOptBtn) {
      runOptBtn.addEventListener("click", () => {
        const credits = parseInt($("#input-elective-credits")?.value, 10) || 7;
        this.optimizeElectiveSelection(credits);
      });
    }

    // Degree audit student selector
    const auditSelect = $("#audit-student-select");
    if (auditSelect) {
      auditSelect.addEventListener("change", (e) => {
        this.runDegreeAudit(e.target.value);
      });
    }
  }

  render() {
    this.populateAuditDropdown();
    this.optimizeElectiveSelection(7);
    if (this.state.students.length > 0) {
      this.runDegreeAudit(this.state.students[0].studentId);
    }
  }

  optimizeElectiveSelection(capacityCredits = 7) {
    // Adapt items to knapsack format
    const items = ELECTIVE_OPTIMIZER_ITEMS.map(item => ({
      id: item.id,
      name: item.name,
      weight: item.credits,
      value: item.careerBenefitScore
    }));

    const result = DPEngine.solve01Knapsack(items, capacityCredits);
    const container = $("#elective-opt-result");

    if (container) {
      container.innerHTML = `
        <div class="alert alert-success">
          <div class="font-bold text-base mb-1">
            Optimized Degree Impact Score: <strong>${result.optimalValue} Points</strong> (Within ${capacityCredits} Elective Credits)
          </div>
          <p class="text-xs text-slate-700 mb-2">
            Recommended elective course bundle for maximum specialization value:
          </p>
          <div class="space-y-1">
            ${result.chosenItems.map(item => `
              <div class="flex justify-between items-center text-xs py-1 px-2 bg-white rounded border border-slate-200">
                <span class="font-semibold text-slate-900">${item.name}</span>
                <span class="badge badge-primary">${item.weight} Credits &bull; Score: ${item.value}</span>
              </div>
            `).join("")}
          </div>
          <div class="mt-2 text-xs text-muted">
            Total Elective Credits Used: <strong>${result.totalWeightUsed} / ${capacityCredits} Credits</strong>
          </div>
        </div>
      `;
    }
  }

  populateAuditDropdown() {
    const select = $("#audit-student-select");
    if (!select) return;

    select.innerHTML = this.state.students.map(s => 
      `<option value="${s.studentId}">${s.fullName} (${s.studentId}) &bull; ${s.program}</option>`
    ).join("");
  }

  runDegreeAudit(studentId) {
    const student = this.state.students.find(s => s.studentId === studentId);
    const container = $("#degree-audit-result");
    if (!student || !container) return;

    const requiredCourses = ["CS-101", "MATH-102", "CS-201", "CS-202", "CS-301", "CS-302", "CS-303", "CS-401", "CS-403"];
    const completed = student.enrolledCourses || [];

    const satisfied = requiredCourses.filter(c => completed.includes(c));
    const remaining = requiredCourses.filter(c => !completed.includes(c));
    const progressPercent = Math.round((satisfied.length / requiredCourses.length) * 100);

    container.innerHTML = `
      <div class="border border-slate-200 rounded-lg p-3 bg-white">
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-sm text-slate-900">Curriculum Progress: ${student.fullName}</div>
          <span class="badge badge-primary">${progressPercent}% Completed</span>
        </div>
        <div class="progress-track mb-3">
          <div class="progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div class="font-semibold text-emerald-700 mb-1">Satisfied Core Courses (${satisfied.length})</div>
            <ul class="space-y-1">
              ${satisfied.map(c => `<li class="font-mono text-emerald-800">&check; ${c}</li>`).join("")}
            </ul>
          </div>
          <div>
            <div class="font-semibold text-rose-700 mb-1">Remaining Requirements (${remaining.length})</div>
            <ul class="space-y-1">
              ${remaining.map(c => `<li class="font-mono text-slate-600">&bull; ${c}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}
