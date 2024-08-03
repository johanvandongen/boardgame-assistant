export interface Solver {
    enabled: boolean;
    label: SolverMethod;
}

export const enum SolverMethod {
    ROW = "row",
    COL = "column",
    BOX = "box",
    ELIMINATION = "elimination",
    BOXBEAM = "box beam",
    BACKTRACK = "backtrack",
    MANUAL = "manual",
}

export type Notes = (null | number[])[][]; // 2d grid with: null if cell is occupied, list of possible options otherwise

export interface Step {
    row: number;
    col: number;
    value: number;
    method: SolverMethod;
    backtrackValues: number[];
    backtrackIdx: number;
}
