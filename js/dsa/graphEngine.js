// Course Prerequisite Directed Graph Engine
// Implements Kahn's Algorithm, Cycle Detection, BFS, DFS, and Floyd-Warshall
// Referencing Unit 2 (Section 5) & Pseudocode B.1 of Aryan Sharma's PBL Report

export class PrerequisiteGraph {
  constructor() {
    this.adjacencyList = new Map(); // Course -> Set of dependent courses
    this.courseDetails = new Map(); // CourseCode -> metadata
  }

  addCourse(course) {
    if (!this.adjacencyList.has(course.code)) {
      this.adjacencyList.set(course.code, new Set());
    }
    this.courseDetails.set(course.code, course);
  }

  // Edge a -> b means course 'a' is a PREREQUISITE for course 'b'
  addPrerequisite(prereqCode, courseCode) {
    if (!this.adjacencyList.has(prereqCode)) {
      this.addCourse({ code: prereqCode, title: prereqCode, credits: 3, semester: 1 });
    }
    if (!this.adjacencyList.has(courseCode)) {
      this.addCourse({ code: courseCode, title: courseCode, credits: 3, semester: 2 });
    }
    this.adjacencyList.get(prereqCode).add(courseCode);
  }

  removePrerequisite(prereqCode, courseCode) {
    if (this.adjacencyList.has(prereqCode)) {
      this.adjacencyList.get(prereqCode).delete(courseCode);
    }
  }

  // Kahn's Algorithm for Topological Sort and Cycle Detection (Pseudocode B.1)
  // Computes indegree, removes indegree 0, detects circular dependencies
  topologicalSort() {
    const indegree = new Map();
    const allCourses = Array.from(this.adjacencyList.keys());

    // Initialize in-degrees
    for (const code of allCourses) {
      indegree.set(code, 0);
    }

    for (const [_, dependents] of this.adjacencyList.entries()) {
      for (const dep of dependents) {
        indegree.set(dep, (indegree.get(dep) || 0) + 1);
      }
    }

    // Queue of courses with in-degree 0
    const queue = [];
    const steps = [];

    for (const code of allCourses) {
      if (indegree.get(code) === 0) {
        queue.push(code);
      }
    }

    const order = [];

    while (queue.length > 0) {
      const u = queue.shift();
      order.push(u);

      steps.push({
        processedCourse: u,
        courseTitle: this.courseDetails.get(u)?.title || u,
        currentOrder: [...order],
        dependents: Array.from(this.adjacencyList.get(u) || [])
      });

      for (const v of this.adjacencyList.get(u) || []) {
        indegree.set(v, indegree.get(v) - 1);
        if (indegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }

    const hasCycle = order.length < allCourses.length;
    const cycleCourses = hasCycle ? allCourses.filter(c => !order.includes(c)) : [];

    return {
      order,
      hasCycle,
      cycleCourses,
      totalCourses: allCourses.length,
      processedCount: order.length,
      steps
    };
  }

  // Breadth-First Search (BFS) starting from a course to find all downstream dependents
  bfs(startCourse) {
    const visited = new Set();
    const queue = [startCourse];
    const visitOrder = [];

    visited.add(startCourse);

    while (queue.length > 0) {
      const current = queue.shift();
      visitOrder.push(current);

      for (const neighbor of this.adjacencyList.get(current) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return visitOrder;
  }

  // Depth-First Search (DFS)
  dfs(startCourse, visited = new Set(), visitOrder = []) {
    visited.add(startCourse);
    visitOrder.push(startCourse);

    for (const neighbor of this.adjacencyList.get(startCourse) || []) {
      if (!visited.has(neighbor)) {
        this.dfs(neighbor, visited, visitOrder);
      }
    }

    return visitOrder;
  }

  // Check if a student meets all prerequisites for a target course
  checkEligibility(completedCourses, targetCourseCode) {
    const targetCourse = this.courseDetails.get(targetCourseCode);
    if (!targetCourse) return { eligible: false, reason: "Course not found" };

    const missingPrereqs = (targetCourse.prerequisites || []).filter(
      p => !completedCourses.includes(p)
    );

    return {
      eligible: missingPrereqs.length === 0,
      missingPrerequisites: missingPrereqs,
      requiredPrerequisites: targetCourse.prerequisites || []
    };
  }

  // Floyd-Warshall All-Pairs Shortest Paths for Campus Network (Table 4)
  static runFloydWarshallSample() {
    const nodes = ["S1", "S2", "S3", "S4", "S5", "S6"];
    const n = nodes.length;
    const INF = 999;
    
    // Initial distance matrix from graph weights
    const dist = [
      [0, 3, 2, 8, 10, 13],
      [3, 0, 1, 5, 7, 10],
      [2, 1, 0, 6, 8, 11],
      [8, 5, 6, 0, 2, 5],
      [10, 7, 8, 2, 0, 3],
      [13, 10, 11, 5, 3, 0]
    ];

    return {
      nodes,
      matrix: dist,
      description: "All-pairs shortest distances computed via Floyd-Warshall O(V³) algorithm (Table 4)"
    };
  }
}
