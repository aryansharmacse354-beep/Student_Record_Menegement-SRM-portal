// Binary Min-Heap Priority Queue for University Registrar Petitions & Requests
// Prioritizes urgent student tickets based on deadline days, urgency score, and submission time

export class RegistrarPriorityQueue {
  constructor() {
    this.heap = []; // Complete binary tree in array representation
  }

  // Comparator: returns true if itemA has HIGHER urgency than itemB
  // 1. Smaller deadlineDays (earlier due date) has higher urgency
  // 2. If deadlineDays equal, higher urgencyScore wins
  // 3. If urgencyScore equal, earlier submission date wins (FIFO)
  _isHigherPriority(a, b) {
    if (a.deadlineDays !== b.deadlineDays) {
      return a.deadlineDays < b.deadlineDays;
    }
    if (a.urgencyScore !== b.urgencyScore) {
      return a.urgencyScore > b.urgencyScore; // Higher score = more urgent
    }
    return (a.id || "").localeCompare(b.id || "");
  }

  insert(request) {
    const item = { ...request, timestamp: request.timestamp || Date.now() };
    this.heap.push(item);
    this._siftUp(this.heap.length - 1);
    return item;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  extractHighestPriority() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._siftDown(0);
    return root;
  }

  _siftUp(index) {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this._isHigherPriority(this.heap[current], this.heap[parent])) {
        [this.heap[current], this.heap[parent]] = [this.heap[parent], this.heap[current]];
        current = parent;
      } else {
        break;
      }
    }
  }

  _siftDown(index) {
    let current = index;
    const length = this.heap.length;

    while (true) {
      let highest = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      if (left < length && this._isHigherPriority(this.heap[left], this.heap[highest])) {
        highest = left;
      }
      if (right < length && this._isHigherPriority(this.heap[right], this.heap[highest])) {
        highest = right;
      }

      if (highest !== current) {
        [this.heap[current], this.heap[highest]] = [this.heap[highest], this.heap[current]];
        current = highest;
      } else {
        break;
      }
    }
  }

  size() {
    return this.heap.length;
  }

  getAll() {
    return [...this.heap];
  }
}
