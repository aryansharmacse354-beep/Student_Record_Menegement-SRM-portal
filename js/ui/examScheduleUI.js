// University Final Examination Timetable Scheduler UI
// Solves exam clashes using Graph Coloring constraint scheduling

import { $, showToast } from "../utils/dom.js";
import { BacktrackingEngine } from "../dsa/backtrack.js";

export class ExamScheduleUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const runScheduleBtn = $("#btn-generate-exam-schedule");
    if (runScheduleBtn) {
      runScheduleBtn.addEventListener("click", () => {
        this.generateExamSchedule();
      });
    }
  }

  render() {
    this.generateExamSchedule();
  }

  generateExamSchedule() {
    const exams = [
      "CS-301: Advanced Algorithms",
      "CS-302: Operating Systems",
      "CS-303: Database Systems",
      "CS-401: Cloud Computing",
      "CS-403: Machine Learning"
    ];

    // Cohort overlaps (students enrolled in both courses)
    const conflicts = [
      [0, 1], // CS-301 and CS-302
      [0, 2], // CS-301 and CS-303
      [1, 2], // CS-302 and CS-303
      [0, 4], // CS-301 and CS-403
      [2, 4]  // CS-303 and CS-403
    ];

    const result = BacktrackingEngine.solveGraphColouring(exams, conflicts, 3);
    const container = $("#exam-schedule-container");

    const slotNames = {
      1: "Day 1 - Morning Session (09:00 - 12:00)",
      2: "Day 1 - Afternoon Session (14:00 - 17:00)",
      3: "Day 2 - Morning Session (09:00 - 12:00)"
    };

    if (container) {
      container.innerHTML = `
        <div class="alert alert-success mb-4">
          <div class="font-bold text-base mb-1">✓ Conflict-Free Examination Timetable Published</div>
          <p class="text-xs text-slate-700">
            Automated conflict resolution solved in <strong>${result.trials} constraint states</strong>. Guaranteed zero student examination clashes across all multi-course cohorts.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          ${[1, 2, 3].map(slotNum => {
            const scheduledExams = result.schedule.filter(s => s.slotNumber === slotNum);
            return `
              <div class="border border-slate-200 rounded-lg p-3 bg-white shadow-sm">
                <div class="font-bold text-xs uppercase tracking-wide text-primary border-b pb-1 mb-2">
                  ${slotNames[slotNum]}
                </div>
                <div class="space-y-2">
                  ${scheduledExams.length > 0 ? scheduledExams.map(e => `
                    <div class="p-2 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-800">
                      ${e.exam}
                    </div>
                  `).join("") : '<div class="text-xs text-muted italic">No exams in this session</div>'}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }
  }
}
