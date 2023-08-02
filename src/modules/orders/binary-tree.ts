// binary-tree.ts

interface Node {
    id : number | null
    left: Node | null;
    right: Node | null;
    price: number;
    side: string;
  }
  
  export class BinaryTree {
    root: Node | null = null;
  
    insert(price: number, side: string) {
      const newNode: Node = {
        id : null,
        left: null,
        right: null,
        price,
        side,
      };
  
      if (!this.root) {
        this.root = newNode;
      } else {
        this.insertNode(this.root, newNode);
      }
    }
  
    private insertNode(current: Node, newNode: Node) {
      if (newNode.price < current.price) {
        if (!current.left) {
          current.left = newNode;
        } else {
          this.insertNode(current.left, newNode);
        }
      } else if (newNode.price > current.price) {
        if (!current.right) {
          current.right = newNode;
        } else {
          this.insertNode(current.right, newNode);
        }
      }
    }
  }
  