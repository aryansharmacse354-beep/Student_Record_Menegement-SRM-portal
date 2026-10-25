// Dynamic Programming Analysis Engine
// Implements 0/1 Knapsack, LCS, and Matrix Chain Multiplication
// Referencing Unit 3 (Section 6) of Aryan Sharma's PBL Report

export class DPEngine {
  // 0/1 Knapsack for Academic Support Activities (Section 6.2)
  // Candidate activities: A1(2,6), A2(3,10), A3(1,3), A4(4,12), A5(2,5); capacity W=7
  // Returns DP table, optimal value (22), and backtracked items
  static solve01Knapsack(activities, capacity) {
    const n = activities.length;
    // dp[i][w] stores maximum value with first i items and capacity w
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    // Fill table
    for (let i = 1; i <= n; i++) {
      const item = activities[i - 1];
      const weight = item.weight;
      const val = item.value;

      for (let w = 0; w <= capacity; w++) {
        if (weight <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], val + dp[i - 1][w - weight]);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Backtrack to find chosen items
    let w = capacity;
    const chosenItems = [];
    for (let i = n; i > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        chosenItems.push(activities[i - 1]);
        w -= activities[i - 1].weight;
      }
    }

    chosenItems.reverse();

    return {
      capacity,
      activities,
      dpTable: dp,
      optimalValue: dp[n][capacity],
      chosenItems,
      totalWeightUsed: capacity - w,
      recurrenceExplanation: "dp[i][c] = max(dp[i-1][c], v_i + dp[i-1][c-w_i]) when w_i <= c, else dp[i-1][c]"
    };
  }

  // Longest Common Subsequence (LCS) (Section 6.3 & Table 5)
  // Compares curriculum sequence with student completion log
  static solveLCS(seq1, seq2) {
    const m = seq1.length;
    const n = seq2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (seq1[i - 1] === seq2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to extract common subsequence
    let i = m;
    let j = n;
    const lcsElements = [];

    while (i > 0 && j > 0) {
      if (seq1[i - 1] === seq2[j - 1]) {
        lcsElements.push(seq1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    lcsElements.reverse();

    return {
      seq1,
      seq2,
      dpTable: dp,
      lcsLength: dp[m][n],
      lcsElements,
      similarityScore: ((2 * dp[m][n]) / (m + n) * 100).toFixed(1)
    };
  }

  // Matrix Chain Multiplication (Section 6.4)
  // Computes minimum scalar multiplications for analytics matrices
  static solveMatrixChain(dimensions) {
    const n = dimensions.length - 1; // Number of matrices
    const m = Array.from({ length: n }, () => Array(n).fill(0));
    const s = Array.from({ length: n }, () => Array(n).fill(0));

    // l is chain length
    for (let l = 2; l <= n; l++) {
      for (let i = 0; i < n - l + 1; i++) {
        const j = i + l - 1;
        m[i][j] = Infinity;
        for (let k = i; k < j; k++) {
          const q = m[i][k] + m[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
          if (q < m[i][j]) {
            m[i][j] = q;
            s[i][j] = k;
          }
        }
      }
    }

    // Helper to construct optimal parenthesization
    const getParenthesization = (i, j) => {
      if (i === j) return `M${i + 1}`;
      return `(${getParenthesization(i, s[i][j])} × ${getParenthesization(s[i][j] + 1, j)})`;
    };

    return {
      dimensions,
      matrixCount: n,
      costTable: m,
      splitTable: s,
      minOperations: m[0][n - 1],
      optimalParentheses: getParenthesization(0, n - 1)
    };
  }
}
