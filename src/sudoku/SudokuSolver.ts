export type Notes = (null | number[])[][]; // 2d grid with: null if cell is occupied, list of possible options otherwise

export interface Step {
    row: number;
    col: number;
    value: number;
    method: string;
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

    constructor(grid: number[][], notes?: Notes, steps?: Step[]) {
        this.grid = grid;
        if (notes === undefined) {
            const g = [];
            for (let r = 0; r < 9; r++) {
                g.push(new Array(9).fill(undefined));
            }
            this.notes = g;
        } else {
            this.notes = notes;
        }
        this.steps = steps === undefined ? [] : steps;
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
        this.calculateNotes();
        return this.notes;
    }

    public getLastStep(): Step | null {
        console.log(this.steps.length);
        if (this.steps.length === 0) {
            return null;
        }
        return this.steps[this.steps.length - 1];
    }

    public getSteps(): Step[] {
        return this.steps;
    }

    private boxCheck(): Step | null {
        for (const box of this.boxes) {
            for (let option = 1; option <= 9; option++) {
                let cnt = 0;
                const step: Step = {
                    row: 0,
                    col: 0,
                    value: 0,
                    method: "box",
                };
                for (let r = box[0]; r < box[0] + 3; r++) {
                    for (let c = box[1]; c < box[1] + 3; c++) {
                        if (this.notes[r][c] === null || this.notes[r][c] === undefined) {
                            continue;
                        }
                        if (this.notes[r][c]?.includes(option)) {
                            cnt += 1;
                            [step.row, step.col, step.value] = [r, c, option];
                            step.col = c;
                        }
                    }
                }
                if (cnt === 1) {
                    return step;
                }
            }
        }
        return null;
    }

    public step() {
        const resultBox = this.boxCheck();
        if (resultBox !== null) {
            this.grid[resultBox.row][resultBox.col] = resultBox.value;
            this.steps.push(resultBox);
            return this;
        }
        console.log(resultBox);

        return this;
    }
}
