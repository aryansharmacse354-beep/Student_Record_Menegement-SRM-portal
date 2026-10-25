// University Executive Dashboard UI
// Apex University Student Information & Records System

import { $ } from "../utils/dom.js";

export class DashboardUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.render();
  }

  render() {
    this.renderMetrics();
    this.renderDepartmentBreakdown();
    this.renderRecentActivity();
  }

  renderMetrics() {
    const totalStudents = this.state.students.length;
    const avgGpa = (this.state.students.reduce((acc, s) => acc + s.gpa, 0) / totalStudents).toFixed(2);
    const activeCourses = this.state.courses.length;
    const pendingRequests = this.state.registrarQueue.size();

    $("#metric-total-students").textContent = totalStudents;
    $("#metric-avg-gpa").textContent = `${avgGpa} / 4.00`;
    $("#metric-total-courses").textContent = activeCourses;
    $("#metric-pending-requests").textContent = pendingRequests;
  }

  renderDepartmentBreakdown() {
    const container = $("#dashboard-dept-breakdown");
    if (!container) return;

    const deptCounts = {};
    this.state.students.forEach(s => {
      deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
    });

    const total = this.state.students.length;

    container.innerHTML = Object.entries(deptCounts).map(([dept, count]) => {
      const percentage = Math.round((count / total) * 100);
      return `
        <div class="dept-progress-item">
          <div class="flex justify-between text-xs font-semibold mb-1">
            <span class="text-slate-800">${dept}</span>
            <span class="text-slate-500">${count} Students (${percentage}%)</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${percentage}%;"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  renderRecentActivity() {
    const container = $("#dashboard-recent-activity");
    if (!container) return;

    const activities = [
      { text: "Official transcript generated for Marcus Vance (CS-101)", time: "10 mins ago", icon: "📄" },
      { text: "Prerequisite verification cleared for CS-301 registration", time: "32 mins ago", icon: "✓" },
      { text: "New urgent petition filed: Credit overload authorization", time: "1 hour ago", icon: "⚡" },
      { text: "Dean's Honor Roll roster generated for Fall 2026", time: "3 hours ago", icon: "⭐" },
      { text: "Final examination timetable conflict scan completed", time: "5 hours ago", icon: "📅" }
    ];

    container.innerHTML = activities.map(act => `
      <div class="activity-item">
        <span class="activity-icon">${act.icon}</span>
        <div class="activity-details">
          <div class="activity-text">${act.text}</div>
          <div class="activity-time">${act.time}</div>
        </div>
      </div>
    `).join("");
  }
}
