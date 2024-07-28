import { Solver } from "./Sudoku";
import { SudokuChecker } from "./SudokuChecker";

export type Notes = (null | number[])[][]; // 2d grid with: null if cell is occupied, list of possible options otherwise

export interface Step {
    row: number;
    col: number;
    value: number;
    method: string;
    backtrackValues: number[];
    backtrackIdx: number;
}

export abstract class SudokuSolver {
    private static readonly boxes: [number, number][] = [
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

    static calculateNotes(grid: number[][]) {
        // const notes: (number[] | null)[][] = [];
        const notes: Notes = [];
        for (let r = 0; r < 9; r++) {
            notes.push(new Array(9).fill(undefined));
        }
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] !== 0) {
                    notes[r][c] = null;
                } else {
                    const options: number[] = [];
                    for (let option = 1; option <= 9; option++) {
                        if (!SudokuChecker.conflict(grid, r, c, option)) {
                            options.push(option);
                        }
                    }
                    notes[r][c] = options;
                }
            }
        }
        return notes;
    }

    private static getNextEmptyCell(notes: Notes): [number, number] | null {
        let minOptions: number = 9;
        let nextCell: null | [number, number] = null;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (notes[r][c] === null || notes[r][c] === undefined) {
                    continue;
                }
                const options = notes[r][c]?.length;
                if (options !== undefined && options < minOptions) {
                    minOptions = options;
                    nextCell = [r, c];
                }
            }
        }
        return nextCell;
    }

    private static boxCheck = (notes: Notes): Step | null => {
        for (const box of SudokuSolver.boxes) {
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
                        if (notes[r][c] === null || notes[r][c] === undefined) {
                            continue;
                        }
                        if (notes[r][c]?.includes(option)) {
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

    private static rowCheck = (notes: Notes): Step | null => {
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
                    if (notes[r][c] === null || notes[r][c] === undefined) {
                        continue;
                    }
                    if (notes[r][c]?.includes(option)) {
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

    private static colCheck = (notes: Notes): Step | null => {
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
                    if (notes[r][c] === null || notes[r][c] === undefined) {
                        continue;
                    }
                    if (notes[r][c]?.includes(option)) {
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

    private static lastPossibleNumberCheck() {
        // ...
    }

    private static getSolvers(solverOptions: Solver[]): ((notes: Notes) => Step | null)[] {
        const result: ((notes: Notes) => Step | null)[] = [];
        if (solverOptions === undefined) {
            return [SudokuSolver.rowCheck, SudokuSolver.colCheck, SudokuSolver.boxCheck];
        }
        for (const solver of solverOptions) {
            if (!solver.enabled) {
                continue;
            }

            switch (solver.label) {
                case "row check":
                    result.push(SudokuSolver.rowCheck);
                    break;
                case "col check":
                    result.push(SudokuSolver.colCheck);
                    break;
                case "box check":
                    result.push(SudokuSolver.boxCheck);
            }
        }
        return result;
    }

    public static step(grid: number[][], solverOptions: Solver[]): [Step | boolean, number[][]] {
        const copyGrid = grid.map((r) => r.slice());
        const notes = SudokuSolver.calculateNotes(grid);
        // console.log(this.steps.map((step) => step.value).join());
        if (SudokuChecker.isSolved(grid)) {
            console.log("solved", SudokuChecker.isValid(grid));
            return [true, copyGrid];
        }
        // console.log(this.solverOptions);
        // if (!SudokuChecker.isSolvable(notes)) {
        //     console.log("not a valid grid, backtrack");
        //     const goBack = true;
        //     while (goBack) {
        //         const lastStep = this.steps.slice(-1)[0];
        //         if (this.solveTree.parent !== null) {
        //             this.solveTree = this.solveTree.parent;
        //         }
        //         if (lastStep === undefined) {
        //             return [false, this.grid];
        //         }
        //         if (
        //             lastStep.method === "backtrack" &&
        //             lastStep.backtrackIdx < lastStep.backtrackValues.length - 1
        //         ) {
        //             const newstep: Step = {
        //                 ...lastStep,
        //                 value: lastStep.backtrackValues[lastStep.backtrackIdx + 1],
        //                 backtrackIdx: lastStep.backtrackIdx + 1,
        //             };
        //             this.grid[newstep.row][newstep.col] = newstep.value;
        //             this.steps.push(newstep);
        //             const child = new Tree(this.solveTree, -1);
        //             this.solveTree.children.push(child);
        //             this.solveTree = child;
        //             return [newstep, this.grid];
        //         } else {
        //             const newstep: Step = {
        //                 ...lastStep,
        //                 value: 0,
        //             };
        //             this.steps.push(newstep);
        //             this.grid[lastStep.row][lastStep.col] = 0;
        //             return [newstep, this.grid];
        //         }
        //     }
        // }
        const solvers: ((notes: Notes) => Step | null)[] = SudokuSolver.getSolvers(solverOptions); //[this.rowCheck, this.colCheck, this.boxCheck];
        // const solvers: (() => Step | null)[] = [this.rowCheck, this.colCheck, this.boxCheck];
        for (const solver of solvers) {
            const result = solver(notes);
            if (result !== null) {
                copyGrid[result.row][result.col] = result.value;
                // this.steps.push(result);
                return [result, copyGrid];
            }
        }

        // Backtrack
        // if (this.solverOptions === undefined || this.solverOptions.backtrack.enabled) {
        //     console.log("No simple solution, start backtracking!", this.getNextEmptyCell());
        //     const emptyCell = this.getNextEmptyCell();
        //     const r = emptyCell ? emptyCell[0] : -1;
        //     const c = emptyCell ? emptyCell[1] : -1;
        //     if (emptyCell !== null && this.notes[r][c] !== null) {
        //         this.grid[r][c] = this.notes[r][c][0];

        //         this.steps.push({
        //             row: r,
        //             col: c,
        //             value: this.notes[r][c][0],
        //             method: "backtrack",
        //             backtrackValues: this.notes[r][c],
        //             backtrackIdx: 0,
        //         });
        //         const child = new Tree(this.solveTree, this.notes[r][c][0]);
        //         this.solveTree.children.push(child);
        //         this.solveTree = child;
        //         return [
        //             {
        //                 row: r,
        //                 col: c,
        //                 value: this.notes[r][c][0],
        //                 method: "backtrack",
        //                 backtrackValues: this.notes[r][c],
        //                 backtrackIdx: 0,
        //             },
        //             this.grid,
        //         ];
        //     }
        // }

        console.log("Cannot solve further");
        return [false, copyGrid];
    }
}
