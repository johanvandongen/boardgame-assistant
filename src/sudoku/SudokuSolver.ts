import { Solvers } from "./Sudoku";

export type Notes = (null | number[])[][]; // 2d grid with: null if cell is occupied, list of possible options otherwise

export interface Step {
    row: number;
    col: number;
    value: number;
    method: string;
    backtrackValues: number[];
    backtrackIdx: number;
}

class Tree<T> {
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

export class SudokuSolver {
    private grid: number[][];
    private notes: Notes;
    private readonly boxes: [number, number][] = [
        [0, 0],
        [3, 0],
        [6, 0],
        [0, 3],
        [3, 3],
        [6, 3],
        [0, 6],
        [3, 6],
        [6, 6],
    ];
    private steps: Step[];
    private solveTree: Tree<number>;
    private solverOptions: Solvers | undefined = undefined;

    constructor(grid: number[][], notes?: Notes, steps?: Step[], tree?: Tree<number>) {
        this.grid = grid.map((r) => r.slice());
        if (notes === undefined) {
            const g = [];
            for (let r = 0; r < 9; r++) {
                g.push(new Array(9).fill(undefined));
            }
            this.notes = g;
        } else {
            this.notes = notes;
        }
        this.steps = steps === undefined ? [] : JSON.parse(JSON.stringify(steps));
        this.solveTree = tree === undefined ? new Tree(null, -1) : tree;
    }

    public setSolverOptions(solverOptions: Solvers) {
        this.solverOptions = solverOptions;
    }

    public getTree() {
        return this.solveTree;
    }

    public getGrid() {
        return this.grid;
    }

    private rowConflict(r: number, value: number): boolean {
        return this.grid[r].includes(value);
    }

    private boxConflict(r: number, c: number, value: number): boolean {
        const sr = Math.floor(r / 3) * 3;
        const sc = Math.floor(c / 3) * 3;
        for (let row = sr; row < sr + 3; row++) {
            for (let col = sc; col < sc + 3; col++) {
                if (this.grid[row][col] === value) {
                    return true;
                }
            }
        }
        return false;
    }

    private colConflict(c: number, value: number): boolean {
        for (let r = 0; r < 9; r++) {
            if (this.grid[r][c] === value) {
                return true;
            }
        }
        return false;
    }

    private conflict(r: number, c: number, value: number): boolean {
        return (
            this.rowConflict(r, value) ||
            this.colConflict(c, value) ||
            this.boxConflict(r, c, value)
        );
    }

    private calculateNotes() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.grid[r][c] !== 0) {
                    this.notes[r][c] = null;
                } else {
                    const options: number[] = [];
                    for (let option = 1; option <= 9; option++) {
                        if (!this.conflict(r, c, option)) {
                            options.push(option);
                        }
                    }
                    this.notes[r][c] = options;
                }
            }
        }
    }

    public getNotes() {
        // this.calculateNotes();
        return this.notes;
    }

    public getLastStep(): Step | null {
        if (this.steps.length === 0) {
            return null;
        }
        return this.steps[this.steps.length - 1];
    }

    public getSteps(): Step[] {
        return this.steps;
    }

    private getNextEmptyCell(): [number, number] | null {
        let minOptions: number = 9;
        let nextCell: null | [number, number] = null;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.notes[r][c] === null || this.notes[r][c] === undefined) {
                    continue;
                }
                const options = this.notes[r][c]?.length;
                if (options !== undefined && options < minOptions) {
                    minOptions = options;
                    nextCell = [r, c];
                }
            }
        }
        return nextCell;
    }

    private boxCheck = (): Step | null => {
        for (const box of this.boxes) {
            for (let option = 1; option <= 9; option++) {
                let cnt = 0;
                const step: Step = {
                    row: 0,
                    col: 0,
                    value: 0,
                    method: "box",
                    backtrackValues: [],
                    backtrackIdx: 0,
                };
                for (let r = box[0]; r < box[0] + 3; r++) {
                    for (let c = box[1]; c < box[1] + 3; c++) {
                        if (this.notes[r][c] === null || this.notes[r][c] === undefined) {
                            continue;
                        }
                        if (this.notes[r][c]?.includes(option)) {
                            cnt += 1;
                            [step.row, step.col, step.value] = [r, c, option];
                        }
                    }
                }
                if (cnt === 1) {
                    return step;
                }
            }
        }
        return null;
    };

    private rowCheck = (): Step | null => {
        for (let r = 0; r < 9; r++) {
            let cnt = 0;
            const step: Step = {
                row: 0,
                col: 0,
                value: 0,
                method: "row",
                backtrackValues: [],
                backtrackIdx: 0,
            };
            for (let option = 1; option <= 9; option++) {
                for (let c = 0; c < 9; c++) {
                    if (this.notes[r][c] === null || this.notes[r][c] === undefined) {
                        continue;
                    }
                    if (this.notes[r][c]?.includes(option)) {
                        cnt += 1;
                        [step.row, step.col, step.value] = [r, c, option];
                    }
                }
            }
            if (cnt === 1) {
                return step;
            }
        }
        return null;
    };

    private colCheck = (): Step | null => {
        for (let c = 0; c < 9; c++) {
            let cnt = 0;
            const step: Step = {
                row: 0,
                col: 0,
                value: 0,
                method: "col",
                backtrackValues: [],
                backtrackIdx: 0,
            };
            for (let option = 1; option <= 9; option++) {
                for (let r = 0; r < 9; r++) {
                    if (this.notes[r][c] === null || this.notes[r][c] === undefined) {
                        continue;
                    }
                    if (this.notes[r][c]?.includes(option)) {
                        cnt += 1;
                        [step.row, step.col, step.value] = [r, c, option];
                    }
                }
            }
            if (cnt === 1) {
                return step;
            }
        }
        return null;
    };

    private lastPossibleNumberCheck() {
        // ...
    }

    /** Checks if a cell with no options exists (does not check if the grid is a valid configuration!). */
    private isSolvable(): boolean {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.notes[r][c] === null || this.notes[r][c] === undefined) {
                    continue;
                }
                if (this.notes[r][c]?.length === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    public isSolved(): boolean {
        return !this.grid.flat().includes(0);
    }

    public isValid(): boolean {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const temp = this.grid[r][c];
                this.grid[r][c] = 0;
                if (this.conflict(r, c, temp)) {
                    return false;
                }
                this.grid[r][c] = temp;
            }
        }
        return true;
    }

    private getSolvers(): (() => Step | null)[] {
        const result = [];
        if (this.solverOptions === undefined || this.solverOptions.rowCheck.enabled) {
            result.push(this.rowCheck);
        }
        if (this.solverOptions === undefined || this.solverOptions.colCheck.enabled) {
            result.push(this.colCheck);
        }
        if (this.solverOptions === undefined || this.solverOptions.boxCheck.enabled) {
            result.push(this.boxCheck);
        }
        return result;
    }

    public solve() {
        this.step();
    }

    public step() {
        this.calculateNotes();
        console.log(this.steps.map((step) => step.value).join());
        if (this.isSolved()) {
            console.log(
                "solved",
                this.isValid(),
                this.steps.length,
                this.getTree().getRoot().getSize()
            );
            return true;
        }
        // console.log(this.solverOptions);
        if (!this.isSolvable()) {
            console.log("not a valid grid, backtrack");
            const goBack = true;
            while (goBack) {
                const lastStep = this.steps.slice(-1)[0];
                if (this.solveTree.parent !== null) {
                    this.solveTree = this.solveTree.parent;
                }
                if (lastStep === undefined) {
                    return this;
                }
                if (
                    lastStep.method === "backtrack" &&
                    lastStep.backtrackIdx < lastStep.backtrackValues.length - 1
                ) {
                    const newstep: Step = {
                        ...lastStep,
                        value: lastStep.backtrackValues[lastStep.backtrackIdx + 1],
                        backtrackIdx: lastStep.backtrackIdx + 1,
                    };
                    this.grid[newstep.row][newstep.col] = newstep.value;
                    this.steps.push(newstep);
                    const child = new Tree(this.solveTree, -1);
                    this.solveTree.children.push(child);
                    this.solveTree = child;
                    return this;
                } else {
                    const newstep: Step = {
                        ...lastStep,
                        value: 0,
                    };
                    this.steps.push(newstep);
                    this.grid[lastStep.row][lastStep.col] = 0;
                }
            }
        }
        const solvers: (() => Step | null)[] = this.getSolvers(); //[this.rowCheck, this.colCheck, this.boxCheck];
        // const solvers: (() => Step | null)[] = [this.rowCheck, this.colCheck, this.boxCheck];
        for (const solver of solvers) {
            const result = solver();
            if (result !== null) {
                this.grid[result.row][result.col] = result.value;
                this.steps.push(result);
                return this;
            }
        }

        // Backtrack
        if (this.solverOptions === undefined || this.solverOptions.backtrack.enabled) {
            console.log("No simple solution, start backtracking!", this.getNextEmptyCell());
            const emptyCell = this.getNextEmptyCell();
            const r = emptyCell ? emptyCell[0] : -1;
            const c = emptyCell ? emptyCell[1] : -1;
            if (emptyCell !== null && this.notes[r][c] !== null) {
                this.grid[r][c] = this.notes[r][c][0];
                this.steps.push({
                    row: r,
                    col: c,
                    value: this.notes[r][c][0],
                    method: "backtrack",
                    backtrackValues: this.notes[r][c],
                    backtrackIdx: 0,
                });
                const child = new Tree(this.solveTree, this.notes[r][c][0]);
                this.solveTree.children.push(child);
                this.solveTree = child;
                return this;
            }
        }

        console.log("Cannot solve further");
        return false;
    }
}
