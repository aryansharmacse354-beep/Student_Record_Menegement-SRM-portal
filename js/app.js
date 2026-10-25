// Apex University Student Information System (SIS)
// Main Application Controller & State Orchestrator

import { UNIVERSITY_CONFIG, INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_HELP_DESK_REQUESTS } from "./data.js";
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

import { $, $$, showToast } from "./utils/dom.js";

class UniversitySISApp {
  constructor() {
    this.state = {
      config: UNIVERSITY_CONFIG,
      activeUserRole: "University Registrar",
      students: [...INITIAL_STUDENTS],
      courses: [...INITIAL_COURSES],
      studentHashTable: new StudentHashTable(23),
      registrarQueue: new RegistrarPriorityQueue(),
      prereqGraph: new PrerequisiteGraph(),
      bPlusTree: new BPlusTree(4),
      gpaAVLTree: new AVLTree()
    };

    this.activeTab = "dashboard";
    this.controllers = {};
  }

  init() {
    this.bootstrapDataStructures();
    this.initializeControllers();
    this.bindNavigation();
    this.bindRoleSwitcher();
    this.setupBranding();

    this.switchTab("dashboard");
    showToast("Apex University Student Information System ready", "info");
  }

  bootstrapDataStructures() {
    // 1. Populate Hash Table & B+ Tree & AVL Tree for students
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
    this.controllers.dashboardUI = new DashboardUI(this.state);
    this.controllers.studentUI = new StudentUI(this.state);
    this.controllers.courseUI = new CourseUI(this.state);
    this.controllers.helpdeskUI = new HelpdeskUI(this.state);
    this.controllers.advisingUI = new AdvisingUI(this.state);
    this.controllers.examScheduleUI = new ExamScheduleUI(this.state);
    this.controllers.analyticsUI = new AnalyticsUI(this.state);

    this.state.dashboardUI = this.controllers.dashboardUI;

    Object.values(this.controllers).forEach(c => {
      if (typeof c.init === "function") c.init();
    });
  }

  setupBranding() {
    $("#app-portal-title").textContent = `${this.state.config.name} &bull; ${this.state.config.systemName}`;
    $("#app-portal-meta").textContent = `${this.state.config.currentAcademicYear} ${this.state.config.currentTerm} &bull; ${this.state.config.campus}`;
  }

  bindNavigation() {
    $$("[data-tab-target]").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab-target");
        this.switchTab(targetTab);
      });
    });

    // Quick action buttons in dashboard
    $$("[data-quick-navigate]").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-quick-navigate");
        this.switchTab(targetTab);
      });
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

    // Trigger re-renders if appropriate
    if (tabId === "courses" && this.controllers.courseUI) this.controllers.courseUI.render();
    if (tabId === "students" && this.controllers.studentUI) this.controllers.studentUI.render();
    if (tabId === "dashboard" && this.controllers.dashboardUI) this.controllers.dashboardUI.render();
    if (tabId === "helpdesk" && this.controllers.helpdeskUI) this.controllers.helpdeskUI.render();
  }

  bindRoleSwitcher() {
    const roleSelect = $("#app-role-select");
    if (!roleSelect) return;

    roleSelect.addEventListener("change", (e) => {
      this.state.activeUserRole = e.target.value;
      $("#current-role-badge").textContent = this.state.activeUserRole;
      showToast(`Active Session Role: ${this.state.activeUserRole}`, "info");

      const adminControls = $$(".admin-only");
      if (this.state.activeUserRole === "Student Self-Service") {
        adminControls.forEach(el => el.classList.add("hidden"));
      } else {
        adminControls.forEach(el => el.classList.remove("hidden"));
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.APEX_SIS = new UniversitySISApp();
  window.APEX_SIS.init();
});
