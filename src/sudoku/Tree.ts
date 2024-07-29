export class Tree<T> {
    value: T;
    parent: Tree<T> | null;
    children: Tree<T>[] = [];

    constructor(parent: Tree<T> | null, value: T) {
        this.parent = parent;
        this.value = value;
    }

    getRoot(): Tree<T> {
        let root = this.parent;
        if (root === null) {
            return this;
        }

        while (root.parent !== null) {
            root = root.parent;
        }
        return root;
    }

    getStr(): string {
        if (this.children.length === 0) {
            console.log(this.value);
            return (this.value as number).toString();
        }
        let str = this.parent === null ? "root: " : (this.value as number).toString();
        for (const child of this.children) {
            str += child.getStr();
        }
        return str;
    }

    getSize(): number {
        if (this.children.length === 0) {
            return 1;
        }
        let size = 0;
        for (const child of this.children) {
            size += 1 + child.getSize();
        }
        return size;
    }
}
