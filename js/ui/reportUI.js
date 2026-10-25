// PBL Report & Project Documentation Viewer
// Directly renders the verified report content for Aryan Sharma

import { PROJECT_METADATA } from "../data.js";

export class ReportUI {
  constructor(appState) {
    this.state = appState;
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById("report-view-container");
    if (!container) return;

    container.innerHTML = `
      <div class="report-document">
        <header class="report-header">
          <div class="report-badge">Project-Based Learning (PBL) Final Report</div>
          <h1 class="report-title">${PROJECT_METADATA.title}</h1>
          <div class="report-meta-grid">
            <div><strong>Student Name:</strong> ${PROJECT_METADATA.studentName}</div>
            <div><strong>Roll Number:</strong> ${PROJECT_METADATA.rollNo}</div>
            <div><strong>ERP ID:</strong> ${PROJECT_METADATA.erpId}</div>
            <div><strong>Programme / Branch:</strong> ${PROJECT_METADATA.programme}</div>
            <div><strong>Course:</strong> ${PROJECT_METADATA.courseName} (${PROJECT_METADATA.courseCode})</div>
            <div><strong>Faculty Guide:</strong> ${PROJECT_METADATA.faculty}</div>
            <div><strong>Institution:</strong> ${PROJECT_METADATA.institution}</div>
            <div><strong>Submission Date:</strong> ${PROJECT_METADATA.submissionDate}</div>
          </div>
        </header>

        <section class="report-section">
          <h2>Student Declaration</h2>
          <blockquote class="report-quote">
            "I certify that this assignment is my own work, with all sources appropriately acknowledged. I understand that academic penalties may apply if the content is plagiarised or submitted in violation of institute policy. I have reviewed this report and accept responsibility for verifying the technical explanations and any implementation results."
            <footer class="mt-2 font-semibold">&mdash; ${PROJECT_METADATA.studentName} (Date: ${PROJECT_METADATA.submissionDate})</footer>
          </blockquote>
        </section>

        <section class="report-section">
          <h2>Abstract</h2>
          <p>
            Universities need to maintain student profiles, course enrolments, semester details, results and academic status while preserving data accuracy and privacy. This project adapts a <strong>Student Record Management System (SRMS)</strong> for a University to demonstrate how DSA-II structures and algorithms can support efficient record storage, search, update, ordering and relationship analysis.
          </p>
          <p class="mt-2">
            The proposed design combines a <strong>hash table</strong> for exact identifier lookup, <strong>balanced trees (AVL / Red-Black)</strong> for ordered retrieval, <strong>graph algorithms</strong> for course prerequisites and enrolment relationships, <strong>dynamic programming</strong> for bounded academic-resource examples, and <strong>backtracking</strong> for constraint-based exam planning.
          </p>
        </section>

        <section class="report-section">
          <h2>System Architecture & Algorithm Mapping</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div class="card p-4">
              <h3 class="font-bold text-primary mb-2">Unit 1: Tree-Based Analysis</h3>
              <p class="text-xs text-slate-700 leading-relaxed">
                Evaluates BST degeneration on sequential roll numbers and demonstrates AVL balancing with LL, RR, LR, and RL rotations. Introduces binary min-heaps for priority scheduling of administrative requests.
              </p>
            </div>
            <div class="card p-4">
              <h3 class="font-bold text-primary mb-2">Unit 2: Graph-Based Analysis</h3>
              <p class="text-xs text-slate-700 leading-relaxed">
                Constructs a Directed Acyclic Graph (DAG) for course prerequisite enforcement. Implements Kahn's topological sort in O(V + E) time with cycle trap detection to prevent circular prerequisites.
              </p>
            </div>
            <div class="card p-4">
              <h3 class="font-bold text-primary mb-2">Unit 3: Dynamic Programming</h3>
              <p class="text-xs text-slate-700 leading-relaxed">
                Solves 0/1 Knapsack optimization for elective/support activities with capacity W=7 hours (optimal value = 22). Analyzes Longest Common Subsequence (LCS) to track curriculum alignment.
              </p>
            </div>
            <div class="card p-4">
              <h3 class="font-bold text-primary mb-2">Unit 4: Backtracking & B&B</h3>
              <p class="text-xs text-slate-700 leading-relaxed">
                Applies Graph Colouring to resolve timetable exam conflicts without clashes, N-Queens constraint evaluation, Sum of Subsets credit matching, and TSP Branch & Bound courier routing.
              </p>
            </div>
          </div>
        </section>

        <section class="report-section">
          <h2>Key Findings & Implementation Recommendations</h2>
          <ul class="list-disc pl-5 space-y-2 text-sm text-slate-700">
            <li><strong>No Single Structure:</strong> Exact lookups require O(1) hash tables, whereas range reports demand balanced search trees or B+ trees. Heaps must be reserved for priority queues rather than arbitrary lookups.</li>
            <li><strong>Prerequisite Safety:</strong> Kahn's algorithm effectively guarantees that students cannot register for advanced courses before satisfying foundational prerequisites.</li>
            <li><strong>Deterministic Bounds:</strong> Combinatorial extensions (Branch and Bound, Graph Colouring) require budget constraints to remain responsive.</li>
          </ul>
        </section>

        <section class="report-section">
          <h2>Academic References</h2>
          <ol class="list-decimal pl-5 text-xs text-slate-600 space-y-1">
            <li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, and C. Stein, <em>Introduction to Algorithms</em>, 4th ed. MIT Press, 2022.</li>
            <li>M. T. Goodrich, R. Tamassia, and M. H. Goldwasser, <em>Data Structures and Algorithms in Java</em>, 6th ed. Wiley, 2014.</li>
            <li>A. Silberschatz, H. F. Korth, and S. Sudarshan, <em>Database System Concepts</em>, 7th ed. McGraw-Hill, 2019.</li>
            <li>G. M. Adelson-Velsky and E. M. Landis, "An algorithm for the organization of information," 1962.</li>
            <li>A. B. Kahn, "Topological sorting of large networks," <em>Commun. ACM</em>, 1962.</li>
            <li>R. Bayer and E. McCreight, "Organization and maintenance of large ordered indexes," <em>Acta Informatica</em>, 1972.</li>
          </ol>
        </section>
      </div>
    `;
  }
}
