# Apex University &bull; Student Information & Academic Records System (SIS)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Portal-000?style=for-the-badge&logo=vercel)](https://studentportal-five-eta.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Live Production URL:** [https://studentportal-five-eta.vercel.app](https://studentportal-five-eta.vercel.app)

An enterprise-grade, responsive University Student Information System (SIS) and Academic Record Management Portal. Designed for university registrars, academic advisors, and students.

---

## 🏛️ Core Features & Distinct User Roles

### 1. 🏛️ University Registrar (Full Administrative Authority)
- **Executive Registrar Dashboard:** High-level institutional metrics, department enrollment breakdown, and live registrar activity logs.
- **Student Records Registry:** Canonical student database with instant Hash Table search by Student ID or Name, department & standing filters, add/edit records, and official academic profile cards.
- **Official Academic Transcripts:** Instant generation and print-ready verified official university transcripts with digital security seals.
- **Course Catalog & Prerequisite Network:** Interactive visual prerequisite dependency map, automated registration clearance and prerequisite verification, and recommended graduation pathway generation.
- **Registrar Petitions & Triage Queue:** Priority Queue (Binary Min-Heap) triage for student petitions (transcript requests, prerequisite overrides, credit overloads, grade disputes) prioritized by urgency score and deadlines.
- **Master Examination Timetable & Clash Detector:** Conflict-free exam timetable with room and session filters, morning & afternoon daily breakdown cards, and automated clash detection certifying zero schedule conflicts.
- **Institutional Analytics & Cohort Reports:** 1-click generators for Dean's Honor Roll, Academic Probation rosters, and Senior Graduation candidates with CSV/JSON export.

### 2. 🧑‍🏫 Academic Advisor (Faculty Workspace - Dr. Catherine Hayes)
- **Assigned Advisees Roster:** Cohort tracking for assigned students, GPA analytics, and at-risk academic warnings.
- **Advisee Degree Audits:** Filtered degree progress inspections with milestone checklists and customized faculty elective recommendations.
- **Faculty Proctoring Schedule:** Assigned chief invigilation duties, examination halls, candidate counts, and hall readiness certification.
- **Advisee Appeals Endorsement:** Fast-track faculty endorsement workflow for student petitions.
- **Departmental Course Offerings:** Curriculum oversight for courses instructed by faculty.

### 3. 🎓 Student Self-Service Portal (Enrolled Undergraduates)
- **Student Profile Dashboard:** Enrolled course portfolio, cumulative GPA tracking, and assigned academic advisor directory.
- **Course Self-Registration:** Interactive course enrollment portal with real-time prerequisite clearance checking and one-click enrollment or dropping.
- **Official Examination Hall Ticket (Admit Card):** Personalized examination pass with assigned rooms, dates, session slots, desk allocations, and printable admit card generator.
- **Degree Audit & Elective Optimizer:** Curricular graduation progress bar and 0/1 Knapsack elective planner maximizing career benefit points within remaining credit allowances.
- **My Petitions & Appeals:** Direct petition filing to the registrar with real-time status tracking.

---

## 🚀 Technology Stack

- **Frontend:** Modern Semantic HTML5, CSS3 Custom Properties (Design Tokens), Vanilla ES Modules
- **Bundler & Tooling:** Vite, Node.js
- **Hosting & Deployment:** Vercel

---

## 💻 Local Development

### 1. Fast Start (Zero Dependencies)
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Development Mode (Vite with Hot Reload)
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
Released under the MIT License.
