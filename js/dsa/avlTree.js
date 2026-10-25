// AVL Tree Implementation with Rotations (LL, RR, LR, RL)
// Referencing Unit 1 (Section 4.4 - 4.5) of Aryan Sharma's PBL Report

export class AVLNode {
  constructor(key, data = null) {
    this.key = key; // Numeric or string key (e.g. Roll No or ID)
    this.data = data;
    this.left = null;
    this.right = null;
    this.height = 1;
  }

  getBalance() {
    const leftHeight = this.left ? this.left.height : 0;
    const rightHeight = this.right ? this.right.height : 0;
    return leftHeight - rightHeight;
  }

  updateHeight() {
    const leftHeight = this.left ? this.left.height : 0;
    const rightHeight = this.right ? this.right.height : 0;
    this.height = 1 + Math.max(leftHeight, rightHeight);
  }
}

export class AVLTree {
  constructor() {
    this.root = null;
    this.rotationLog = [];
    this.operationCount = 0;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalanceFactor(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // Right Rotation (LL Rotation)
  rightRotate(y, reason = "LL Rotation (Right Rotation)") {
    const x = y.left;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.updateHeight();
    x.updateHeight();

    this.rotationLog.push({
      type: "LL",
      description: `Right rotation at node ${y.key} (new root of subtree: ${x.key})`,
      pivot: y.key,
      newRoot: x.key,
      timestamp: Date.now()
    });

    return x;
  }

  // Left Rotation (RR Rotation)
  leftRotate(x, reason = "RR Rotation (Left Rotation)") {
    const y = x.right;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.updateHeight();
    y.updateHeight();

    this.rotationLog.push({
      type: "RR",
      description: `Left rotation at node ${x.key} (new root of subtree: ${y.key})`,
      pivot: x.key,
      newRoot: y.key,
      timestamp: Date.now()
    });

    return y;
  }

  insert(key, data = null) {
    this.operationCount++;
    this.root = this._insertNode(this.root, key, data);
  }

  _insertNode(node, key, data) {
    // 1. Normal BST insertion
    if (!node) {
      return new AVLNode(key, data);
    }

    if (key < node.key) {
      node.left = this._insertNode(node.left, key, data);
    } else if (key > node.key) {
      node.right = this._insertNode(node.right, key, data);
    } else {
      // Duplicate keys not allowed in standard BST/AVL
      node.data = data;
      return node;
    }

    // 2. Update height
    node.updateHeight();

    // 3. Get balance factor
    const balance = this.getBalanceFactor(node);

    // 4. Balance cases:
    // Case 1: Left Left (LL)
    if (balance > 1 && key < node.left.key) {
      return this.rightRotate(node, "LL Case: Left child's left subtree heavy");
    }

    // Case 2: Right Right (RR)
    if (balance < -1 && key > node.right.key) {
      return this.leftRotate(node, "RR Case: Right child's right subtree heavy");
    }

    // Case 3: Left Right (LR)
    if (balance > 1 && key > node.left.key) {
      this.rotationLog.push({
        type: "LR",
        description: `Left-Right rotation at node ${node.key}: left rotate on ${node.left.key}, then right rotate on ${node.key}`,
        pivot: node.key,
        timestamp: Date.now()
      });
      node.left = this.leftRotate(node.left, "LR: Step 1 Left Rotate");
      return this.rightRotate(node, "LR: Step 2 Right Rotate");
    }

    // Case 4: Right Left (RL)
    if (balance < -1 && key < node.right.key) {
      this.rotationLog.push({
        type: "RL",
        description: `Right-Left rotation at node ${node.key}: right rotate on ${node.right.key}, then left rotate on ${node.key}`,
        pivot: node.key,
        timestamp: Date.now()
      });
      node.right = this.rightRotate(node.right, "RL: Step 1 Right Rotate");
      return this.leftRotate(node, "RL: Step 2 Left Rotate");
    }

    return node;
  }

  search(key) {
    let current = this.root;
    const path = [];

    while (current) {
      path.push(current.key);
      if (key === current.key) {
        return { found: true, node: current, path, comparisons: path.length };
      }
      if (key < current.key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return { found: false, node: null, path, comparisons: path.length };
  }

  // Traversals
  inOrder(node = this.root, result = []) {
    if (node) {
      this.inOrder(node.left, result);
      result.push({ key: node.key, data: node.data, height: node.height, balance: this.getBalanceFactor(node) });
      this.inOrder(node.right, result);
    }
    return result;
  }

  preOrder(node = this.root, result = []) {
    if (node) {
      result.push({ key: node.key, data: node.data, height: node.height, balance: this.getBalanceFactor(node) });
      this.preOrder(node.left, result);
      this.preOrder(node.right, result);
    }
    return result;
  }

  postOrder(node = this.root, result = []) {
    if (node) {
      this.postOrder(node.left, result);
      this.postOrder(node.right, result);
      result.push({ key: node.key, data: node.data, height: node.height, balance: this.getBalanceFactor(node) });
    }
    return result;
  }

  clear() {
    this.root = null;
    this.rotationLog = [];
    this.operationCount = 0;
  }

  // Range Search: [minKey, maxKey]
  rangeSearch(minKey, maxKey, node = this.root, result = []) {
    if (!node) return result;

    if (node.key > minKey) {
      this.rangeSearch(minKey, maxKey, node.left, result);
    }

    if (node.key >= minKey && node.key <= maxKey) {
      result.push(node.data || node.key);
    }

    if (node.key < maxKey) {
      this.rangeSearch(minKey, maxKey, node.right, result);
    }

    return result;
  }
}
