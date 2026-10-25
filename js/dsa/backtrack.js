// Backtracking and Branch & Bound Analysis Engine
// Implements N-Queens, Graph Colouring, Sum of Subsets, and TSP Branch & Bound
// Referencing Unit 4 (Section 7) & Pseudocode B.3, B.4 of Aryan Sharma's PBL Report

export class BacktrackingEngine {
  // N-Queens Problem (Section 7.3 & Fig. 8)
  // For N=4, exactly yields 2 solutions: [1, 3, 0, 2] and [2, 0, 3, 1]
  static solveNQueens(n = 4) {
    const solutions = [];
    const board = new Array(n).fill(-1); // board[row] = col
    let deadEnds = 0;
    const history = [];

    const isSafe = (row, col) => {
      for (let prevRow = 0; prevRow < row; prevRow++) {
        const prevCol = board[prevRow];
        // Same column
        if (prevCol === col) return false;
        // Same diagonal
        if (Math.abs(prevRow - row) === Math.abs(prevCol - col)) return false;
      }
      return true;
    };

    const placeQueen = (row) => {
      if (row === n) {
        solutions.push([...board]);
        return;
      }

      let rowHadSafeSlot = false;
      for (let col = 0; col < n; col++) {
        if (isSafe(row, col)) {
          rowHadSafeSlot = true;
          board[row] = col;
          history.push({ row, col, action: "place", state: [...board] });
          placeQueen(row + 1);
          board[row] = -1; // Backtrack
          history.push({ row, col, action: "backtrack", state: [...board] });
        }
      }

      if (!rowHadSafeSlot) {
        deadEnds++;
      }
    };

    placeQueen(0);

    return {
      n,
      solutionsCount: solutions.length,
      solutions,
      deadEnds,
      historySteps: history.slice(0, 100) // Sample trace
    };
  }

  // Sum of Subsets (Section 7.2 & Pseudocode B.4)
  // For S = [3, 5, 6, 7] and target = 15
  static solveSumOfSubsets(set = [3, 5, 6, 7], target = 15) {
    const solutions = [];
    const currentSubset = [];
    let nodesExplored = 0;
    let prunedCount = 0;

    const totalRemaining = (startIndex) => {
      let sum = 0;
      for (let i = startIndex; i < set.length; i++) sum += set[i];
      return sum;
    };

    const backtrack = (index, currentSum) => {
      nodesExplored++;

      if (currentSum === target) {
        solutions.push([...currentSubset]);
        return;
      }

      if (index >= set.length || currentSum > target || currentSum + totalRemaining(index) < target) {
        prunedCount++;
        return; // Prune branch
      }

      // Option 1: Include set[index]
      currentSubset.push(set[index]);
      backtrack(index + 1, currentSum + set[index]);
      currentSubset.pop(); // Backtrack

      // Option 2: Exclude set[index]
      backtrack(index + 1, currentSum);
    };

    backtrack(0, 0);

    return {
      set,
      target,
      solutions,
      nodesExplored,
      prunedCount,
      summary: `Target ${target} reached via ${solutions.length} valid combination: [${solutions.map(s => s.join(', ')).join('; ')}]`
    };
  }

  // Graph Colouring for Exam Timetable Scheduling (Section 7.4)
  // Vertices = Exams; Edges = Common students; Colors = Examination Slots
  static solveGraphColouring(exams, conflictEdges, maxSlots = 3) {
    const n = exams.length;
    const colors = new Array(n).fill(0); // 0 = unassigned, 1..maxSlots
    let trials = 0;

    const isSafe = (examIdx, color) => {
      for (const [u, v] of conflictEdges) {
        if (u === examIdx && colors[v] === color) return false;
        if (v === examIdx && colors[u] === color) return false;
      }
      return true;
    };

    const colorGraph = (examIdx) => {
      if (examIdx === n) return true; // All exams scheduled

      for (let c = 1; c <= maxSlots; c++) {
        trials++;
        if (isSafe(examIdx, c)) {
          colors[examIdx] = c;
          if (colorGraph(examIdx + 1)) return true;
          colors[examIdx] = 0; // Backtrack
        }
      }

      return false;
    };

    const success = colorGraph(0);

    return {
      success,
      trials,
      maxSlots,
      schedule: exams.map((exam, idx) => ({
        exam,
        slotNumber: colors[idx],
        slotName: colors[idx] > 0 ? `Slot ${colors[idx]} (Day ${colors[idx]})` : "Unassigned"
      }))
    };
  }

  // TSP Branch and Bound on 5-vertex campus network (Section 7.6)
  static solveTSPBranchAndBound() {
    // 5 Campus distribution points (Admin, CSE Lab, Library, Auditorium, Hostel)
    const points = ["Admin Block", "CSE Complex", "Central Library", "Auditorium", "Campus Hostel"];
    const n = 5;
    const dist = [
      [0, 10, 15, 20, 25],
      [10, 0, 35, 25, 30],
      [15, 35, 0, 30, 20],
      [20, 25, 30, 0, 15],
      [25, 30, 20, 15, 0]
    ];

    let bestCost = Infinity;
    let bestTour = [];
    let nodesExplored = 0;
    let branchesPruned = 0;

    const visited = new Array(n).fill(false);
    visited[0] = true;

    const search = (current, count, currentCost, path) => {
      nodesExplored++;

      if (currentCost >= bestCost) {
        branchesPruned++;
        return; // Bound pruning
      }

      if (count === n) {
        const total = currentCost + dist[current][0];
        if (total < bestCost) {
          bestCost = total;
          bestTour = [...path, 0];
        }
        return;
      }

      for (let next = 0; next < n; next++) {
        if (!visited[next]) {
          visited[next] = true;
          search(next, count + 1, currentCost + dist[current][next], [...path, next]);
          visited[next] = false; // Backtrack
        }
      }
    };

    search(0, 1, 0, [0]);

    return {
      points,
      bestCost,
      bestTour: bestTour.map(idx => points[idx]),
      nodesExplored,
      branchesPruned,
      description: `Optimal courier round-trip length: ${bestCost} minutes (Pruned ${branchesPruned} subtrees using Branch & Bound bounds)`
    };
  }
}
