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
    $("#app-portal-title").innerHTML = `${this.state.config.name} &bull; ${this.state.config.systemName}`;
    $("#app-portal-meta").textContent = `${this.state.config.currentAcademicYear} ${this.state.config.currentTerm} &bull; ${this.state.config.campus}`;
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

    $$("[data-tab-target]").forEach(btn => {
      if (btn.getAttribute("data-tab-target") === tabId) {
        btn.classList.add("tab-active");
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.classList.remove("tab-active");
        btn.setAttribute("aria-selected", "false");
      }
    });

    $$(".tab-content-panel").forEach(panel => {
      if (panel.id === `tab-panel-${tabId}`) {
        panel.classList.remove("hidden");
        panel.removeAttribute("inert");
      } else {
        panel.classList.add("hidden");
        panel.setAttribute("inert", "");
      }
    });

    // Render triggers
    if (tabId === "courses" && this.state.controllers.courseUI) this.state.controllers.courseUI.render();
    if (tabId === "students" && this.state.controllers.studentUI) this.state.controllers.studentUI.render();
    if (tabId === "dashboard" && this.state.controllers.dashboardUI) this.state.controllers.dashboardUI.render();
    if (tabId === "helpdesk" && this.state.controllers.helpdeskUI) this.state.controllers.helpdeskUI.render();
    if (tabId === "exams" && this.state.controllers.examScheduleUI) this.state.controllers.examScheduleUI.render();
    if (tabId === "student-portal" && this.state.controllers.studentPortalUI) this.state.controllers.studentPortalUI.render();
    if (tabId === "advisor-portal" && this.state.controllers.advisorUI) this.state.controllers.advisorUI.render();
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
          <div class="flex justify-between items-center text-xs py-2 px-4 bg-indigo-50 border-b border-indigo-200 text-indigo-900">
            <span>🧑‍🏫 <strong>Faculty View:</strong> Logged in as <strong>Dr. Catherine Hayes</strong> &bull; Senior Academic Advisor (Computer Science & AI)</span>
            <span>Assigned Advisees: <strong>4 Students</strong> &bull; Term: Fall 2026</span>
          </div>
        `;
      }
      if (navContainer) {
        navContainer.innerHTML = `
          <button class="nav-tab-btn tab-active" data-tab-target="advisor-portal"><span>🧑‍🏫</span> Advisor Workspace</button>
          <button class="nav-tab-btn" data-tab-target="advising"><span>🎓</span> Degree Audit & Electives</button>
          <button class="nav-tab-btn" data-tab-target="courses"><span>📚</span> Courses & Prerequisites</button>
          <button class="nav-tab-btn" data-tab-target="exams"><span>📅</span> Faculty Proctoring Schedule</button>
        `;
      }
      this.switchTab("advisor-portal");
      showToast("Switched to Academic Advisor (Faculty Workspace - Dr. Catherine Hayes)", "info");
    } else if (role === "Student Self-Service") {
      if (roleBanner) {
        roleBanner.classList.remove("hidden");
        roleBanner.innerHTML = `
          <div class="flex justify-between items-center text-xs py-2 px-4 bg-blue-50 border-b border-blue-200 text-blue-900">
            <span>🎓 <strong>Student Self-Service View:</strong> Logged in as <strong>Marcus Vance</strong> (<code>U2024-CS-101</code>)</span>
            <div class="flex items-center gap-2">
              <span>Switch Student Record:</span>
              <select id="student-portal-identity-select" class="form-select py-0.5 text-xs font-semibold bg-white border border-blue-300"></select>
            </div>
          </div>
        `;
      }
      if (navContainer) {
        navContainer.innerHTML = `
          <button class="nav-tab-btn tab-active" data-tab-target="student-portal"><span>🏠</span> My Student Dashboard</button>
          <button class="nav-tab-btn" data-tab-target="student-exams"><span>🎟️</span> My Exam Admit Card</button>
          <button class="nav-tab-btn" data-tab-target="advising"><span>🎓</span> My Degree Audit</button>
          <button class="nav-tab-btn" data-tab-target="courses"><span>📝</span> Register & Prerequisites</button>
          <button class="nav-tab-btn" data-tab-target="helpdesk"><span>📨</span> File a Petition</button>
        `;
      }
      this.switchTab("student-portal");
      if (this.state.controllers.studentPortalUI) this.state.controllers.studentPortalUI.render();
      showToast("Switched to Student Self-Service Portal (Marcus Vance)", "info");
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.APEX_SIS = new UniversitySISApp();
  window.APEX_SIS.init();
});
