// Institutional Analytics & Academic Standing Reports UI
// Apex University Student Information System (SIS)

import { $, showToast } from "../utils/dom.js";
import { exportStudentsToCSV } from "../utils/export.js";

export class AnalyticsUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Generate Dean's Honor Roll
    const deansBtn = $("#btn-gen-deans-list");
    if (deansBtn) {
      deansBtn.addEventListener("click", () => {
        this.generateDeansList();
      });
    }

    // Generate Probation Roster
    const probationBtn = $("#btn-gen-probation");
    if (probationBtn) {
      probationBtn.addEventListener("click", () => {
        this.generateProbationRoster();
      });
    }

    // Graduation Candidates
    const gradBtn = $("#btn-gen-graduation");
    if (gradBtn) {
      gradBtn.addEventListener("click", () => {
        this.generateGraduationRoster();
      });
    }
  }

  render() {
    this.generateDeansList();
  }

  generateDeansList() {
    // GPA >= 3.75
    const list = this.state.students.filter(s => s.gpa >= 3.75);
    this.renderReportResults("Dean's Honor Roll (Term GPA &ge; 3.75)", list, "deans-list");
  }

  generateProbationRoster() {
    // GPA < 3.00
    const list = this.state.students.filter(s => s.gpa < 3.00);
    this.renderReportResults("Academic Probation & Counseling Roster (GPA &lt; 3.00)", list, "probation");
  }

  generateGraduationRoster() {
    // Senior credits >= 100
    const list = this.state.students.filter(s => s.creditsCompleted >= 100);
    this.renderReportResults("Senior Graduation Candidates (Credits &ge; 100)", list, "graduation");
  }

  renderReportResults(title, students, type) {
    const container = $("#analytics-report-container");
    if (!container) return;

    container.innerHTML = `
      <div class="card">
        <div class="card-header-flex">
          <div>
            <h3 class="card-title">${title}</h3>
            <p class="card-subtitle">Official Institutional Cohort Query &bull; Found ${students.length} Student Records</p>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-export-cohort-csv">Export Cohort CSV</button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Program / Major</th>
                <th>Year Level</th>
                <th>Cumulative GPA</th>
                <th>Credits Earned</th>
                <th>Assigned Advisor</th>
              </tr>
            </thead>
            <tbody>
              ${students.length > 0 ? students.map(s => `
                <tr>
                  <td class="font-mono text-xs font-bold">${s.studentId}</td>
                  <td class="font-semibold text-slate-900">${s.fullName}</td>
                  <td>${s.program}</td>
                  <td>${s.yearLevel}</td>
                  <td>
                    <span class="cgpa-pill ${s.gpa >= 3.75 ? 'cgpa-high' : s.gpa >= 3.20 ? 'cgpa-mid' : 'cgpa-avg'}">${s.gpa.toFixed(2)}</span>
                  </td>
                  <td>${s.creditsCompleted} Units</td>
                  <td class="text-xs text-muted">${s.advisor || 'Office of Registrar'}</td>
                </tr>
              `).join("") : '<tr><td colspan="7" class="text-center py-4 text-muted">No students in this cohort criteria.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;

    $("#btn-export-cohort-csv")?.addEventListener("click", () => {
      exportStudentsToCSV(students, `${type}_cohort.csv`);
      showToast(`Exported ${title} to CSV`, "success");
    });
  }
}
