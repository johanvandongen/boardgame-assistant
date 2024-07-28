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
                    break;
                case "backtrack":
                    result.push(SudokuSolver.bruteforceChoice);
                    break;
            }
        }
        return result;
    }

    private static bruteforceChoice(notes: Notes): Step | null {
        console.log("backtracking!", SudokuSolver.getNextEmptyCell(notes));
        const emptyCell = SudokuSolver.getNextEmptyCell(notes);
        const r = emptyCell ? emptyCell[0] : -1;
        const c = emptyCell ? emptyCell[1] : -1;
        if (emptyCell !== null && notes[r][c] !== null) {
            const step: Step = {
                row: r,
                col: c,
                value: notes[r][c][0],
                method: "backtrack",
                backtrackValues: notes[r][c],
                backtrackIdx: 0,
            };
            return step;
        }
        return null;
    }

    public static prev(grid: number[][], steps: Step[]): number[][] {
        const copyGrid = grid.map((r) => r.slice());
        if (steps.length <= 0) {
            return copyGrid;
        }
        const lastStep = steps.slice(-1)[0];
        copyGrid[lastStep.row][lastStep.col] = 0;
        return copyGrid;
    }

    /** Returns false if cannot be solved further, true, if solved, step otherwise. */
    public static step(
        grid: number[][],
        steps: Step[],
        solverOptions: Solver[]
    ): [Step | boolean, number[][]] {
        const copyGrid = grid.map((r) => r.slice());
        const copySteps: Step[] = steps.map((step) => ({
            ...step,
            backtrackValues: [...step.backtrackValues],
        }));
        const notes = SudokuSolver.calculateNotes(grid);

        // Grid already solved
        if (SudokuChecker.isSolved(grid)) {
            console.log("solved", SudokuChecker.isValid(grid), steps.length);
            return [true, copyGrid];
        }

        // Backtracking
        const lastStep = copySteps.slice(-1)[0];
        if (!SudokuChecker.isSolvable(notes) && lastStep !== undefined) {
            console.log("not a valid grid, backtrack");
            if (
                lastStep.method === "backtrack" &&
                lastStep.backtrackIdx < lastStep.backtrackValues.length - 1
            ) {
                const newstep: Step = {
                    ...lastStep,
                    value: lastStep.backtrackValues[lastStep.backtrackIdx + 1],
                    backtrackIdx: lastStep.backtrackIdx + 1,
                };
                copyGrid[newstep.row][newstep.col] = newstep.value;
                return [newstep, copyGrid];
            } else {
                const newstep: Step = {
                    ...lastStep,
                    value: 0,
                };
                copyGrid[lastStep.row][lastStep.col] = 0;
                return [newstep, copyGrid];
            }
        }

        // Apply solvers
        const solvers: ((notes: Notes) => Step | null)[] = SudokuSolver.getSolvers(solverOptions);
        for (const solver of solvers) {
            const result = solver(notes);
            if (result !== null) {
                copyGrid[result.row][result.col] = result.value;
                return [result, copyGrid];
            }
        }

        console.log("Cannot solve further");
        return [false, copyGrid];
    }
}
