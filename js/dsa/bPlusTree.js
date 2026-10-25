// B+ Tree Multiway Index Simulator for High-Performance Student Range Queries
// Referencing Unit 5 (Section 8.2 & Figure 10) of Aryan Sharma's PBL Report

export class BPlusTreeNode {
  constructor(isLeaf = false) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.children = []; // Child nodes if internal, student records if leaf
    this.next = null;   // Linked list pointer to next leaf node
  }
}

export class BPlusTree {
  constructor(order = 3) {
    this.order = order; // Maximum children per internal node
    this.root = new BPlusTreeNode(true);
  }

  insert(key, record) {
    // Simplified multiway leaf insertion with leaf linking
    let leaf = this._findLeaf(key);
    
    // Insert in sorted order in leaf
    let idx = 0;
    while (idx < leaf.keys.length && leaf.keys[idx] < key) {
      idx++;
    }

    if (idx < leaf.keys.length && leaf.keys[idx] === key) {
      leaf.children[idx] = record; // Update
      return;
    }

    leaf.keys.splice(idx, 0, key);
    leaf.children.splice(idx, 0, record);

    // If leaf overflows order, split
    if (leaf.keys.length >= this.order) {
      this._splitLeaf(leaf);
    }
  }

  _findLeaf(key) {
    let current = this.root;
    while (!current.isLeaf) {
      let i = 0;
      while (i < current.keys.length && key >= current.keys[i]) {
        i++;
      }
      current = current.children[i];
    }
    return current;
  }

  _splitLeaf(leaf) {
    const mid = Math.floor(leaf.keys.length / 2);
    const newLeaf = new BPlusTreeNode(true);

    newLeaf.keys = leaf.keys.splice(mid);
    newLeaf.children = leaf.children.splice(mid);
    newLeaf.next = leaf.next;
    leaf.next = newLeaf;

    if (leaf === this.root) {
      const newRoot = new BPlusTreeNode(false);
      newRoot.keys = [newLeaf.keys[0]];
      newRoot.children = [leaf, newLeaf];
      this.root = newRoot;
    } else {
      this._insertIntoParent(leaf, newLeaf.keys[0], newLeaf);
    }
  }

  _insertIntoParent(oldChild, key, newChild) {
    const parent = this._findParent(this.root, oldChild);
    if (!parent) return;

    let idx = 0;
    while (idx < parent.keys.length && parent.keys[idx] < key) {
      idx++;
    }

    parent.keys.splice(idx, 0, key);
    parent.children.splice(idx + 1, 0, newChild);

    if (parent.keys.length >= this.order) {
      this._splitInternal(parent);
    }
  }

  _findParent(current, target) {
    if (current.isLeaf || current.children.includes(target)) {
      return current.isLeaf ? null : current;
    }

    for (const child of current.children) {
      const found = this._findParent(child, target);
      if (found) return found;
    }
    return null;
  }

  _splitInternal(node) {
    const mid = Math.floor(node.keys.length / 2);
    const splitKey = node.keys[mid];

    const newInternal = new BPlusTreeNode(false);
    newInternal.keys = node.keys.splice(mid + 1);
    newInternal.children = node.children.splice(mid + 1);
    node.keys.splice(mid, 1); // Remove the promoted key

    if (node === this.root) {
      const newRoot = new BPlusTreeNode(false);
      newRoot.keys = [splitKey];
      newRoot.children = [node, newInternal];
      this.root = newRoot;
    } else {
      this._insertIntoParent(node, splitKey, newInternal);
    }
  }

  // High-performance Range Query O(log_m N + K) via leaf linked-list
  rangeQuery(startKey, endKey) {
    const results = [];
    let leaf = this._findLeaf(startKey);
    let diskBlockReads = 1; // Direct descent to first leaf

    while (leaf) {
      for (let i = 0; i < leaf.keys.length; i++) {
        const k = leaf.keys[i];
        if (k >= startKey && k <= endKey) {
          results.push({ key: k, record: leaf.children[i] });
        } else if (k > endKey) {
          return { results, diskBlockReads, completedViaLinkedLeaf: true };
        }
      }
      leaf = leaf.next;
      if (leaf) diskBlockReads++;
    }

    return { results, diskBlockReads, completedViaLinkedLeaf: true };
  }

  // Get first leaf node to traverse the linked list
  getFirstLeaf() {
    let current = this.root;
    while (!current.isLeaf) {
      current = current.children[0];
    }
    return current;
  }
}
