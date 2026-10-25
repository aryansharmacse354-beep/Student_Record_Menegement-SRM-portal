# Apex University &bull; Student Information & Academic Records System (SIS)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Portal-000?style=for-the-badge&logo=vercel)](https://studentportal-five-eta.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Live Production URL:** [https://studentportal-five-eta.vercel.app](https://studentportal-five-eta.vercel.app)

An enterprise-grade, responsive University Student Information System (SIS) and Academic Record Management Portal. Designed for university registrars, academic advisors, and students.

---

## 🏛️ Core Features

- **📊 Executive Registrar Dashboard:** High-level institutional metrics, department enrollment breakdown, and live registrar activity logs.
- **👥 Student Records Registry:** Canonical student database with instant \(O(1)\) Hash Table search by Student ID or Name, department & standing filters, add/edit records, and official academic profile cards.
- **🖨️ Official Academic Transcripts:** Instant generation and print-ready verified official university transcripts with digital security seals.
- **📚 Course Catalog & Prerequisite Network:** Interactive visual prerequisite dependency map, automated registration clearance and prerequisite verification, and recommended graduation pathway generation.
- **📋 Registrar Petitions & Triage Queue:** Priority Queue (Binary Min-Heap) triage for student petitions (transcript requests, prerequisite overrides, credit overloads, grade disputes) prioritized by urgency score and deadlines.
- **🎓 Academic Advising & Degree Planner:** Specialization elective credit optimizer and real-time degree audit progress tracker.
- **📅 Final Examination Scheduler:** Conflict-free exam timetable generator resolving multi-course student cohort schedule clashes.
- **📈 Institutional Analytics & Cohort Reports:** 1-click generators for Dean's Honor Roll (\(\text{GPA} \ge 3.75\)), Academic Probation rosters, and Senior Graduation candidates with CSV export.

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
