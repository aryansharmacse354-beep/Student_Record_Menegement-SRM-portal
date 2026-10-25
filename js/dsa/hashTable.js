// Fast O(1) Hash Table for Student Unique Identifiers (Roll No & ERP ID)
// Referencing Section 1 & Section 10 of the SRMS PBL Report

export class StudentHashTable {
  constructor(size = 19) {
    this.size = size;
    this.buckets = new Array(size).fill(null).map(() => []);
    this.count = 0;
    this.collisionCount = 0;
  }

  _hash(key) {
    let hash = 0;
    const str = String(key);
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % this.size;
    }
    return Math.abs(hash);
  }

  insert(key, student) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    
    // Check if key already exists
    const existingIndex = bucket.findIndex(item => item.key === key);
    if (existingIndex !== -1) {
      bucket[existingIndex].student = student;
      return { success: true, updated: true, index };
    }

    if (bucket.length > 0) {
      this.collisionCount++;
    }

    bucket.push({ key, student });
    this.count++;
    return { success: true, updated: false, index, bucketLength: bucket.length };
  }

  search(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    const comparisonSteps = [];

    for (let i = 0; i < bucket.length; i++) {
      comparisonSteps.push(bucket[i].key);
      if (bucket[i].key === key) {
        return {
          found: true,
          student: bucket[i].student,
          bucketIndex: index,
          steps: i + 1,
          bucketContent: bucket.map(b => b.key)
        };
      }
    }

    return {
      found: false,
      bucketIndex: index,
      steps: bucket.length,
      bucketContent: bucket.map(b => b.key)
    };
  }

  delete(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    const itemIndex = bucket.findIndex(item => item.key === key);

    if (itemIndex !== -1) {
      const removed = bucket.splice(itemIndex, 1)[0];
      this.count--;
      return { success: true, student: removed.student, index };
    }
    return { success: false, index };
  }

  getAll() {
    const all = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) {
        all.push(item.student);
      }
    }
    return all;
  }

  getBucketStats() {
    return {
      size: this.size,
      totalEntries: this.count,
      loadFactor: (this.count / this.size).toFixed(2),
      collisions: this.collisionCount,
      distribution: this.buckets.map((b, i) => ({
        bucketIndex: i,
        count: b.length,
        keys: b.map(item => item.key)
      }))
    };
  }
}
