// University Student Directory & Academic Profile Management UI
// Apex University Student Information System (SIS)

import { $, $$, showToast, setupModal } from "../utils/dom.js";
import { exportStudentsToCSV, exportToJSON, printOfficialTranscript } from "../utils/export.js";

export class StudentUI {
  constructor(appState) {
    this.state = appState;
    this.studentModal = null;
    this.detailModal = null;
    this.editingStudentId = null;
    this.currentDeptFilter = "all";
    this.currentStandingFilter = "all";
  }

  init() {
    this.studentModal = setupModal("student-modal");
    this.detailModal = setupModal("student-detail-modal");

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Search input (Instant Hash Table lookup)
    const searchInput = $("#student-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.handleSearch(e.target.value.trim());
      });
    }

    // Filter by department
    const deptFilter = $("#student-dept-filter");
    if (deptFilter) {
      deptFilter.addEventListener("change", (e) => {
        this.currentDeptFilter = e.target.value;
        this.renderTable();
      });
    }

    // Filter by academic standing
    const standingFilter = $("#student-standing-filter");
    if (standingFilter) {
      standingFilter.addEventListener("change", (e) => {
        this.currentStandingFilter = e.target.value;
        this.renderTable();
      });
    }

    // Register Student Button
    const addBtn = $("#btn-add-student");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        this.openAddStudentModal();
      });
    }

    // Export CSV
    const exportCsvBtn = $("#btn-export-csv");
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener("click", () => {
        exportStudentsToCSV(this.state.students);
        showToast("Exported student registry to CSV", "success");
      });
    }

    // Export JSON
    const exportJsonBtn = $("#btn-export-json");
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener("click", () => {
        exportToJSON(this.state.students);
        showToast("Exported student dataset to JSON", "success");
      });
    }

    // Student form submit
    const studentForm = $("#student-form");
    if (studentForm) {
      studentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmit(new FormData(studentForm));
      });
    }

    // Close buttons for modals
    $$("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modalId = btn.getAttribute("data-close-modal");
        const modal = document.getElementById(modalId);
        if (modal && typeof modal.close === "function") modal.close();
      });
    });
  }

  handleSearch(query) {
    if (!query) {
      this.renderTable();
      return;
    }

    // Check O(1) primary hash table by ID
    const hashResult = this.state.studentHashTable.search(query);
    if (hashResult.found) {
      this.renderTable([hashResult.student]);
      return;
    }

    // Substring fallback on name or department
    const qLower = query.toLowerCase();
    const filtered = this.state.students.filter(s =>
      s.fullName.toLowerCase().includes(qLower) ||
      s.studentId.toLowerCase().includes(qLower) ||
      s.department.toLowerCase().includes(qLower) ||
      s.program.toLowerCase().includes(qLower)
    );

    this.renderTable(filtered);
  }

  getFilteredStudents(list = this.state.students) {
    let result = [...list];

    if (this.currentDeptFilter !== "all") {
      result = result.filter(s => s.department === this.currentDeptFilter);
    }

    if (this.currentStandingFilter !== "all") {
      result = result.filter(s => s.status === this.currentStandingFilter);
    }

    return result;
  }

  render() {
    this.renderTable();
  }

  renderTable(studentsToDisplay = null) {
    const tbody = $("#students-table-body");
    if (!tbody) return;

    const list = studentsToDisplay || this.getFilteredStudents();

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-6 text-muted">No student records found matching the criteria.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(student => {
      const gpaClass = student.gpa >= 3.80 ? 'cgpa-high' : student.gpa >= 3.20 ? 'cgpa-mid' : 'cgpa-avg';
      const statusClass = student.status === 'Active' ? 'badge-success' : student.status === 'Graduated' ? 'badge-primary' : 'badge-danger';

      return `
        <tr>
          <td>
            <div class="font-mono text-xs font-bold text-slate-900">${student.studentId}</div>
            <div class="text-xs text-muted font-mono">${student.nationalId}</div>
          </td>
          <td>
            <div class="font-semibold text-slate-900">${student.fullName}</div>
            <div class="text-xs text-muted">${student.email}</div>
          </td>
          <td>
            <div class="font-medium text-xs text-slate-800">${student.program}</div>
            <div class="text-xs text-muted">${student.department}</div>
          </td>
          <td>
            <span class="text-xs font-medium text-slate-700">${student.yearLevel}</span>
          </td>
          <td>
            <span class="cgpa-pill ${gpaClass}">${student.gpa.toFixed(2)}</span>
          </td>
          <td>
            <span class="badge ${statusClass}">${student.status}</span>
          </td>
          <td class="text-right">
            <div class="btn-group">
              <button class="btn btn-sm btn-outline" data-view-student="${student.studentId}" title="View Academic Profile">Profile</button>
              <button class="btn btn-sm btn-outline" data-edit-student="${student.studentId}" title="Edit Record">Edit</button>
              <button class="btn btn-sm btn-danger-outline" data-delete-student="${student.studentId}" title="Archive Record">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Bind action events
    $$("[data-view-student]", tbody).forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-view-student");
        this.openStudentDetailModal(id);
      });
    });

    $$("[data-edit-student]", tbody).forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-edit-student");
        this.openEditStudentModal(id);
      });
    });

    $$("[data-delete-student]", tbody).forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-delete-student");
        this.handleDeleteStudent(id);
      });
    });
  }

  openAddStudentModal() {
    this.editingStudentId = null;
    const form = $("#student-form");
    if (form) form.reset();
    $("#student-modal-title").textContent = "Register New Student Record";
    $("#input-student-id").removeAttribute("readonly");
    $("#input-student-id").value = `U2024-CS-${Math.floor(120 + Math.random() * 800)}`;
    this.studentModal.show();
  }

  openEditStudentModal(studentId) {
    const student = this.state.students.find(s => s.studentId === studentId);
    if (!student) return;

    this.editingStudentId = studentId;
    $("#student-modal-title").textContent = `Edit Academic Record - ${student.fullName}`;

    $("#input-student-id").value = student.studentId;
    $("#input-student-id").setAttribute("readonly", "true");
    $("#input-student-name").value = student.fullName;
    $("#input-student-dept").value = student.department;
    $("#input-student-prog").value = student.program;
    $("#input-student-year").value = student.yearLevel;
    $("#input-student-gpa").value = student.gpa;
    $("#input-student-email").value = student.email;
    $("#input-student-status").value = student.status;

    this.studentModal.show();
  }

  handleFormSubmit(formData) {
    const studentId = formData.get("studentId")?.trim();
    const fullName = formData.get("fullName")?.trim();
    const department = formData.get("department")?.trim();
    const program = formData.get("program")?.trim();
    const yearLevel = formData.get("yearLevel")?.trim();
    const gpa = parseFloat(formData.get("gpa")) || 3.50;
    const email = formData.get("email")?.trim();
    const status = formData.get("status") || "Active";

    if (!studentId || !fullName || !department) {
      showToast("Please provide all required student identification fields", "error");
      return;
    }

    if (this.editingStudentId) {
      const idx = this.state.students.findIndex(s => s.studentId === this.editingStudentId);
      if (idx !== -1) {
        this.state.students[idx] = {
          ...this.state.students[idx],
          fullName,
          department,
          program,
          yearLevel,
          gpa,
          email,
          status
        };
        this.state.studentHashTable.insert(studentId, this.state.students[idx]);
        showToast(`Updated record for ${fullName}`, "success");
      }
    } else {
      if (this.state.studentHashTable.search(studentId).found) {
        showToast(`Student ID ${studentId} is already registered in university registry`, "error");
        return;
      }

      const newStudent = {
        studentId,
        nationalId: `REG-${Math.floor(90000 + Math.random() * 9999)}`,
        fullName,
        department,
        program,
        yearLevel,
        semester: 1,
        gpa,
        email: email || `${studentId.toLowerCase()}@apex.edu`,
        status,
        creditsCompleted: 16,
        advisor: "Dr. Catherine Hayes",
        enrolledCourses: ["CS-101", "MATH-102"]
      };

      this.state.students.unshift(newStudent);
      this.state.studentHashTable.insert(studentId, newStudent);
      this.state.bPlusTree.insert(studentId, newStudent);
      showToast(`Registered new student ${fullName} in University SIS`, "success");
    }

    this.studentModal.close();
    this.render();
    if (this.state.dashboardUI) this.state.dashboardUI.render();
  }

  handleDeleteStudent(studentId) {
    const student = this.state.students.find(s => s.studentId === studentId);
    if (!student) return;

    if (confirm(`Archive academic record for ${student.fullName} (${student.studentId})?`)) {
      this.state.students = this.state.students.filter(s => s.studentId !== studentId);
      this.state.studentHashTable.delete(studentId);
      showToast(`Archived academic record for ${student.fullName}`, "info");
      this.render();
      if (this.state.dashboardUI) this.state.dashboardUI.render();
    }
  }

  openStudentDetailModal(studentId) {
    const student = this.state.students.find(s => s.studentId === studentId);
    if (!student) return;

    const body = $("#student-detail-body");
    if (body) {
      body.innerHTML = `
        <div class="student-id-card">
          <div class="card-header">
            <div class="university-title">Apex University &bull; Academic Identity</div>
            <div class="card-id font-mono">${student.studentId}</div>
          </div>
          <div class="card-body">
            <div class="avatar-placeholder">${student.fullName.charAt(0)}</div>
            <div class="student-info">
              <h3 class="text-xl font-bold text-slate-900">${student.fullName}</h3>
              <p class="text-sm font-medium text-slate-700">${student.program}</p>
              <p class="text-xs text-muted">${student.department} &bull; ${student.yearLevel}</p>
              <div class="stat-pills mt-2 flex gap-2">
                <span class="badge badge-primary">Cumulative GPA: ${student.gpa.toFixed(2)}</span>
                <span class="badge badge-secondary">${student.creditsCompleted} Credits Earned</span>
                <span class="badge ${student.status === 'Active' ? 'badge-success' : 'badge-danger'}">${student.status}</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="flex justify-between text-xs">
              <span><strong>Assigned Academic Advisor:</strong> ${student.advisor || 'Office of Undergraduate Studies'}</span>
              <span><strong>University Email:</strong> ${student.email}</span>
            </div>
            <div class="mt-2 text-xs">
              <strong>Active Course Registrations:</strong> ${(student.enrolledCourses || []).join(", ") || "No active course registrations"}
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button class="btn btn-outline" data-close-modal="student-detail-modal">Close</button>
          <button class="btn btn-primary" id="btn-print-official-transcript">🖨️ Print Official Transcript</button>
        </div>
      `;

      $("#btn-print-official-transcript")?.addEventListener("click", () => {
        printOfficialTranscript(student);
      });
    }

    this.detailModal.show();
  }
}
