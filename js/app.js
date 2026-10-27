// Apex University Student Information System (SIS)
// Main Application Controller & Dynamic Role-Based Orchestrator

import { UNIVERSITY_CONFIG, INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_EXAMS, INITIAL_HELP_DESK_REQUESTS } from "./data.js";
import { StudentHashTable } from "./dsa/hashTable.js";
import { RegistrarPriorityQueue } from "./dsa/binaryHeap.js";
import { PrerequisiteGraph } from "./dsa/graphEngine.js";
import { BPlusTree } from "./dsa/bPlusTree.js";
import { AVLTree } from "./dsa/avlTree.js";

import { DashboardUI } from "./ui/dashboardUI.js";
import { StudentUI } from "./ui/studentUI.js";
import { CourseUI } from "./ui/courseUI.js";
import { HelpdeskUI } from "./ui/helpdeskUI.js";
import { AdvisingUI } from "./ui/advisingUI.js";
import { ExamScheduleUI } from "./ui/examScheduleUI.js";
import { AnalyticsUI } from "./ui/analyticsUI.js";
import { StudentPortalUI } from "./ui/studentPortalUI.js";
import { AdvisorUI } from "./ui/advisorUI.js";

import { $, $$, showToast } from "./utils/dom.js";

class UniversitySISApp {
  constructor() {
    this.state = {
      config: UNIVERSITY_CONFIG,
      activeUserRole: "University Registrar",
      students: [...INITIAL_STUDENTS],
      courses: [...INITIAL_COURSES],
      exams: [...INITIAL_EXAMS],
      studentHashTable: new StudentHashTable(23),
      registrarQueue: new RegistrarPriorityQueue(),
      prereqGraph: new PrerequisiteGraph(),
      bPlusTree: new BPlusTree(4),
      gpaAVLTree: new AVLTree(),
      controllers: {}
    };

    this.activeTab = "dashboard";
  }

  init() {
    this.bootstrapDataStructures();
    this.initializeControllers();
    this.bindNavigation();
    this.bindRoleSwitcher();
    this.setupBranding();

    this.applyRoleView("University Registrar");
    showToast("Apex University Student Information System active", "info");
  }

  bootstrapDataStructures() {
    // 1. Populate Hash Table, B+ Tree & AVL Tree for students
    this.state.students.forEach(student => {
      this.state.studentHashTable.insert(student.studentId, student);
      this.state.bPlusTree.insert(student.studentId, student);
      this.state.gpaAVLTree.insert(Math.round(student.gpa * 100), student);
    });

    // 2. Populate Course Prerequisite Graph
    this.state.courses.forEach(course => {
      this.state.prereqGraph.addCourse(course);
      (course.prerequisites || []).forEach(p => {
        this.state.prereqGraph.addPrerequisite(p, course.code);
      });
    });

    // 3. Populate Registrar Petition Priority Queue
    INITIAL_HELP_DESK_REQUESTS.forEach(req => {
      this.state.registrarQueue.insert(req);
    });
  }

  initializeControllers() {
    this.state.controllers.dashboardUI = new DashboardUI(this.state);
    this.state.controllers.studentUI = new StudentUI(this.state);
    this.state.controllers.courseUI = new CourseUI(this.state);
    this.state.controllers.helpdeskUI = new HelpdeskUI(this.state);
    this.state.controllers.advisingUI = new AdvisingUI(this.state);
    this.state.controllers.examScheduleUI = new ExamScheduleUI(this.state);
    this.state.controllers.analyticsUI = new AnalyticsUI(this.state);
    this.state.controllers.studentPortalUI = new StudentPortalUI(this.state);
    this.state.controllers.advisorUI = new AdvisorUI(this.state);

    this.state.dashboardUI = this.state.controllers.dashboardUI;

    Object.values(this.state.controllers).forEach(c => {
      if (typeof c.init === "function") c.init();
    });
  }

  setupBranding() {
    const titleEl = $("#app-portal-title");
    if (titleEl) {
      titleEl.innerHTML = `${this.state.config.name} &bull; ${this.state.config.systemName}`;
    }
    const metaEl = $("#app-portal-meta");
    if (metaEl) {
      metaEl.textContent = `${this.state.config.currentAcademicYear} ${this.state.config.currentTerm} &bull; ${this.state.config.campus}`;
    }
  }

  bindNavigation() {
    document.addEventListener("click", (e) => {
      const tabBtn = e.target.closest("[data-tab-target]");
      if (tabBtn) {
        const targetTab = tabBtn.getAttribute("data-tab-target");
        this.switchTab(targetTab);
      }

      const quickNavBtn = e.target.closest("[data-quick-navigate]");
      if (quickNavBtn) {
        const targetTab = quickNavBtn.getAttribute("data-quick-navigate");
        this.switchTab(targetTab);
      }
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update tab bar buttons
    $$("[data-tab-target]").forEach(btn => {
      if (btn.getAttribute("data-tab-target") === tabId) {
        btn.classList.add("tab-active");
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.classList.remove("tab-active");
        btn.setAttribute("aria-selected", "false");
      }
    });

    // Toggle panels
    $$(".tab-content-panel").forEach(panel => {
      if (panel.id === `tab-panel-${tabId}`) {
        panel.classList.remove("hidden");
        panel.removeAttribute("inert");
      } else {
        panel.classList.add("hidden");
        panel.setAttribute("inert", "");
      }
    });

    // Render triggers for Registrar
    if (tabId === "dashboard" && this.state.controllers.dashboardUI) this.state.controllers.dashboardUI.render();
    if (tabId === "students" && this.state.controllers.studentUI) this.state.controllers.studentUI.render();
    if (tabId === "courses" && this.state.controllers.courseUI) this.state.controllers.courseUI.render();
    if (tabId === "helpdesk" && this.state.controllers.helpdeskUI) this.state.controllers.helpdeskUI.render();
    if (tabId === "advising" && this.state.controllers.advisingUI) this.state.controllers.advisingUI.render();
    if (tabId === "exams" && this.state.controllers.examScheduleUI) this.state.controllers.examScheduleUI.render();
    if (tabId === "analytics" && this.state.controllers.analyticsUI) this.state.controllers.analyticsUI.render();

    // Render triggers for Advisor
    if (tabId === "advisor-portal" && this.state.controllers.advisorUI) this.state.controllers.advisorUI.render();
    if (tabId === "advisor-audit" && this.state.controllers.advisorUI) this.state.controllers.advisorUI.renderAuditTab();
    if (tabId === "advisor-proctoring" && this.state.controllers.advisorUI) this.state.controllers.advisorUI.renderProctoringTab();
    if (tabId === "advisor-petitions" && this.state.controllers.advisorUI) this.state.controllers.advisorUI.renderPetitionsTab();
    if (tabId === "advisor-courses" && this.state.controllers.advisorUI) this.state.controllers.advisorUI.renderCoursesTab();

    // Render triggers for Student
    if (tabId === "student-portal" && this.state.controllers.studentPortalUI) this.state.controllers.studentPortalUI.render();
    if (tabId === "student-registration" && this.state.controllers.studentPortalUI) this.state.controllers.studentPortalUI.renderRegistrationSection();
    if (tabId === "student-exams" && this.state.controllers.studentPortalUI) this.state.controllers.studentPortalUI.renderHallTicketSection();
    if (tabId === "student-audit" && this.state.controllers.studentPortalUI) this.state.controllers.studentPortalUI.renderDegreeAuditSection();
    if (tabId === "student-petitions" && this.state.controllers.studentPortalUI) this.state.controllers.studentPortalUI.renderPetitionsHistory();
  }

  bindRoleSwitcher() {
    const roleSelect = $("#app-role-select");
    if (!roleSelect) return;

    roleSelect.addEventListener("change", (e) => {
      const newRole = e.target.value;
      this.applyRoleView(newRole);
    });
  }

  applyRoleView(role) {
    this.state.activeUserRole = role;
    const badge = $("#current-role-badge");
    if (badge) badge.textContent = role;

    const navContainer = $("#main-portal-nav");
    const roleBanner = $("#role-context-banner");

    // Dynamic Navigation Tabs based on Role
    if (role === "University Registrar") {
      if (roleBanner) roleBanner.classList.add("hidden");
      if (navContainer) {
        navContainer.innerHTML = `
          <button class="nav-tab-btn tab-active" data-tab-target="dashboard"><span>📊</span> Dashboard</button>
          <button class="nav-tab-btn" data-tab-target="students"><span>👥</span> Student Records</button>
          <button class="nav-tab-btn" data-tab-target="courses"><span>📚</span> Course Catalog</button>
          <button class="nav-tab-btn" data-tab-target="helpdesk"><span>📋</span> Registrar Petitions</button>
          <button class="nav-tab-btn" data-tab-target="advising"><span>🎓</span> Degree Advising</button>
          <button class="nav-tab-btn" data-tab-target="exams"><span>📅</span> Examination Timetable</button>
          <button class="nav-tab-btn" data-tab-target="analytics"><span>📈</span> Institutional Reports</button>
        `;
      }
      this.switchTab("dashboard");
      showToast("Switched to University Registrar (Full Administrative Authority)", "info");
    } else if (role === "Academic Advisor") {
      if (roleBanner) {
        roleBanner.classList.remove("hidden");
        roleBanner.innerHTML = `
          <div class="flex flex-wrap justify-between items-center text-xs py-2 px-4 bg-indigo-50 border-b border-indigo-200 text-indigo-900 gap-2">
            <span>🧑‍🏫 <strong>Faculty Advisor Session:</strong> Logged in as <strong>Dr. Catherine Hayes</strong> &bull; Dept of Computer Science & AI</span>
            <span>Assigned Advisees: <strong>4 Undergraduates</strong> &bull; Term: Fall 2026</span>
          </div>
        `;
      }
      if (navContainer) {
        navContainer.innerHTML = `
          <button class="nav-tab-btn tab-active" data-tab-target="advisor-portal"><span>🧑‍🏫</span> Advisee Roster</button>
          <button class="nav-tab-btn" data-tab-target="advisor-audit"><span>🎓</span> Advisee Degree Audits</button>
          <button class="nav-tab-btn" data-tab-target="advisor-proctoring"><span>📅</span> Proctoring Duties</button>
          <button class="nav-tab-btn" data-tab-target="advisor-petitions"><span>📝</span> Advisee Petitions</button>
          <button class="nav-tab-btn" data-tab-target="advisor-courses"><span>📚</span> Faculty Courses</button>
        `;
      }
      this.switchTab("advisor-portal");
      showToast("Switched to Academic Advisor (Faculty Workspace - Dr. Catherine Hayes)", "info");
    } else if (role === "Student Self-Service") {
      if (roleBanner) {
        roleBanner.classList.remove("hidden");
        const currentStudentId = this.state.controllers.studentPortalUI?.activeStudentId || "U2024-CS-101";
        const currentStudent = this.state.students.find(s => s.studentId === currentStudentId) || this.state.students[0];

        roleBanner.innerHTML = `
          <div class="flex flex-wrap justify-between items-center text-xs py-2 px-4 bg-blue-50 border-b border-blue-200 text-blue-900 gap-2">
            <span>🎓 <strong>Student Self-Service View:</strong> Currently viewing record for <strong>${currentStudent.fullName}</strong> (<code>${currentStudent.studentId}</code>)</span>
            <div class="flex items-center gap-2">
              <label for="student-portal-identity-select" class="font-semibold text-slate-700">Switch Student Record:</label>
              <select id="student-portal-identity-select" class="form-select py-1 text-xs font-semibold bg-white border border-blue-300">
                ${this.state.students.map(s => `
                  <option value="${s.studentId}" ${s.studentId === currentStudentId ? 'selected' : ''}>
                    ${s.fullName} (${s.studentId}) - ${s.program}
                  </option>
                `).join("")}
              </select>
            </div>
          </div>
        `;
      }
      if (navContainer) {
        navContainer.innerHTML = `
          <button class="nav-tab-btn tab-active" data-tab-target="student-portal"><span>🏠</span> My Student Profile</button>
          <button class="nav-tab-btn" data-tab-target="student-registration"><span>📝</span> Course Registration</button>
          <button class="nav-tab-btn" data-tab-target="student-exams"><span>🎟️</span> My Exam Admit Card</button>
          <button class="nav-tab-btn" data-tab-target="student-audit"><span>🎓</span> My Degree Audit</button>
          <button class="nav-tab-btn" data-tab-target="student-petitions"><span>📨</span> My Petitions</button>
        `;
      }
      this.switchTab("student-portal");
      if (this.state.controllers.studentPortalUI) this.state.controllers.studentPortalUI.render();
      showToast("Switched to Student Self-Service Portal", "info");
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.APEX_SIS = new UniversitySISApp();
  window.APEX_SIS.init();
});
