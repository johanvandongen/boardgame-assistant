import { Notes } from "./SudokuSolver";

export class SudokuChecker {
    private static rowConflict(grid: number[][], r: number, value: number): boolean {
        return grid[r].includes(value);
    }

    private static boxConflict(grid: number[][], r: number, c: number, value: number): boolean {
        const sr = Math.floor(r / 3) * 3;
        const sc = Math.floor(c / 3) * 3;
        for (let row = sr; row < sr + 3; row++) {
            for (let col = sc; col < sc + 3; col++) {
                if (grid[row][col] === value) {
                    return true;
                }
            }
        }
        return false;
    }

    private static colConflict(grid: number[][], c: number, value: number): boolean {
        for (let r = 0; r < 9; r++) {
            if (grid[r][c] === value) {
                return true;
            }
        }
        return false;
    }

    public static conflict(grid: number[][], r: number, c: number, value: number): boolean {
        return (
            SudokuChecker.rowConflict(grid, r, value) ||
            SudokuChecker.colConflict(grid, c, value) ||
            SudokuChecker.boxConflict(grid, r, c, value)
        );
    }

    /** Checks if a cell with no options exists (does not check if the grid is a valid configuration!). */
    public static isSolvable(notes: Notes): boolean {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (notes[r][c] === null || notes[r][c] === undefined) {
                    continue;
                }
                if (notes[r][c]?.length === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    public static isSolved(grid: number[][]): boolean {
        return !grid.flat().includes(0);
    }

    public static isValid(grid: number[][]): boolean {
        const copyGrid = grid.map((r) => r.slice());
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const temp = copyGrid[r][c];
                if (temp === 0) {
                    continue;
                }

                copyGrid[r][c] = 0;
                if (SudokuChecker.conflict(copyGrid, r, c, temp)) {
                    return false;
                }
                copyGrid[r][c] = temp;
            }
        }
        return true;
    }
}
