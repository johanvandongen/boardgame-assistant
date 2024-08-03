import { Notes, Solver, SolverMethod, Step } from "./model";
import { SudokuChecker } from "./SudokuChecker";

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

    public static getEmptyGrid(): number[][] {
        const grid: number[][] = [];
        for (let r = 0; r < 9; r++) {
            grid.push(new Array(9).fill(0));
        }
        return grid;
    }

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
        let minOptions: number = 10;
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
                    method: SolverMethod.BOX,
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
                method: SolverMethod.ROW,
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
                method: SolverMethod.COL,
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

    private static lastPossibleNumberCheck(notes: Notes): Step | null {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const options = notes[r][c];
                if (options === null || options === undefined) {
                    continue;
                }
                if (options.length === 1) {
                    const step: Step = {
                        row: r,
                        col: c,
                        value: options[0],
                        method: SolverMethod.ELIMINATION,
                        backtrackValues: [],
                        backtrackIdx: 0,
                    };
                    return step;
                }
            }
        }
        return null;
    }

    private static getBoxBeams(
        notes: Notes
    ): { val: number; cnt: number; box: [number, number]; row: number; col: number }[] {
        const beams: {
            val: number;
            cnt: number;
            box: [number, number];
            row: number;
            col: number;
        }[] = [];
        for (const box of SudokuSolver.boxes) {
            for (let option = 1; option <= 9; option++) {
                const beam = { val: option, box: box, cnt: 0, row: -1, col: -1 };
                for (let r = box[0]; r < box[0] + 3; r++) {
                    for (let c = box[1]; c < box[1] + 3; c++) {
                        if (notes[r][c]?.includes(option)) {
                            if (beam.cnt >= 1) {
                                if (c !== beam.col) {
                                    beam.col = -1;
                                }
                                if (r !== beam.row) {
                                    beam.row = -1;
                                }
                            } else {
                                beam.row = r;
                                beam.col = c;
                            }
                            beam.cnt += 1;
                        }
                    }
                }
                if (beam.cnt >= 2 && (beam.row !== -1 || beam.col !== -1)) {
                    beams.push(beam);
                }
            }
        }
        return beams;
    }

    public static boxbeamNotes(notes: Notes): Notes {
        const notesCopy = SudokuSolver.deepCopyNotes(notes);
        const beams = SudokuSolver.getBoxBeams(notes);
        for (const beam of beams) {
            let affectedBoxes = SudokuSolver.boxes.filter((box) => box !== beam.box);
            if (beam.row !== -1) {
                affectedBoxes = affectedBoxes.filter(
                    (box) => beam.row >= box[0] && beam.row < box[0] + 3
                );
            }
            if (beam.col !== -1) {
                affectedBoxes = affectedBoxes.filter(
                    (box) => beam.col >= box[1] && beam.col < box[1] + 3
                );
            }
            for (const box of affectedBoxes) {
                for (let r = box[0]; r < box[0] + 3; r++) {
                    for (let c = box[1]; c < box[1] + 3; c++) {
                        if (r === beam.row || c == beam.col) {
                            notesCopy[r][c] =
                                notesCopy[r][c]?.filter((val) => val !== beam.val) ?? null;
                        }
                    }
                }
            }
        }
        return notesCopy;
    }

    public static boxbeam(notes: Notes): Step | null {
        const boxbeamNotes = SudokuSolver.boxbeamNotes(notes);
        const solvers: ((notes: Notes) => Step | null)[] = [
            SudokuSolver.rowCheck,
            SudokuSolver.colCheck,
            SudokuSolver.boxCheck,
            SudokuSolver.lastPossibleNumberCheck,
        ];
        for (const solver of solvers) {
            const step = solver(boxbeamNotes);
            if (step !== null) {
                step.method = SolverMethod.BOXBEAM;
                return step;
            }
        }
        return null;
    }

    private static arrayEqual(cells1: [number, number][], cells2: [number, number][]) {
        if (cells1.length !== cells2.length) {
            return false;
        }

        for (let k = 0; k < cells1.length; k++) {
            if (cells1[k][0] !== cells2[k][0] || cells1[k][1] !== cells2[k][1]) {
                return false;
            }
        }
        return true;
    }

    public static getNakedPairNotes(notes: Notes): Notes {
        const notesCopy = SudokuSolver.deepCopyNotes(notes);
        for (const box of SudokuSolver.boxes) {
            // Get list of occupied cells for each option in this box
            const cells: { val: number; cells: [number, number][] }[] = [];
            for (let option = 1; option <= 9; option++) {
                const pos: [number, number][] = [];
                for (let r = box[0]; r < box[0] + 3; r++) {
                    for (let c = box[1]; c < box[1] + 3; c++) {
                        if (notes[r][c]?.includes(option)) {
                            pos.push([r, c]);
                        }
                    }
                }
                if (pos.length > 1) {
                    cells.push({ val: option, cells: pos });
                }
            }
            // Get hidden pairs
            let hiddenPairs: { vals: number[]; pos: [number, number][] }[] = [];
            for (let i = 0; i < cells.length; i++) {
                const hiddenpair: { vals: number[]; pos: [number, number][] } = {
                    vals: [cells[i].val],
                    pos: cells[i].cells,
                };
                for (let j = 0; j < cells.length; j++) {
                    if (cells[i].val === cells[j].val) {
                        continue;
                    }
                    if (SudokuSolver.arrayEqual(cells[i].cells, cells[j].cells)) {
                        hiddenpair.vals.push(cells[j].val);
                    }
                }
                if (hiddenpair.vals.length > 1) {
                    hiddenPairs.push(hiddenpair);
                }
            }
            hiddenPairs = hiddenPairs.filter((pair) => pair.pos.length === pair.vals.length);

            //Update notes
            for (const pair of hiddenPairs) {
                for (const pos of pair.pos) {
                    const options = notesCopy[pos[0]][pos[1]];
                    if (options === null) {
                        continue;
                    }
                    notesCopy[pos[0]][pos[1]] = options.filter((val) => pair.vals.includes(val));
                }
            }
        }
        return notesCopy;
    }

    public static hiddenPair(notes: Notes): Step | null {
        const hiddenPairNotes = SudokuSolver.getNakedPairNotes(notes);
        const solvers: ((notes: Notes) => Step | null)[] = [
            SudokuSolver.rowCheck,
            SudokuSolver.colCheck,
            SudokuSolver.boxCheck,
            SudokuSolver.lastPossibleNumberCheck,
        ];
        for (const solver of solvers) {
            const step = solver(hiddenPairNotes);
            if (step !== null) {
                step.method = SolverMethod.HIDDENPAIR;
                return step;
            }
        }
        return null;
    }

    private static deepCopyNotes(notes: Notes): Notes {
        return notes.map((row) => row.map((col) => (col === null ? null : [...col])));
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
                case SolverMethod.ROW:
                    result.push(SudokuSolver.rowCheck);
                    break;
                case SolverMethod.COL:
                    result.push(SudokuSolver.colCheck);
                    break;
                case SolverMethod.BOX:
                    result.push(SudokuSolver.boxCheck);
                    break;
                case SolverMethod.ELIMINATION:
                    result.push(SudokuSolver.lastPossibleNumberCheck);
                    break;
                case SolverMethod.BOXBEAM:
                    result.push(SudokuSolver.boxbeam);
                    break;
                case SolverMethod.HIDDENPAIR:
                    result.push(SudokuSolver.hiddenPair);
                    break;
                case SolverMethod.BACKTRACK:
                    result.push(SudokuSolver.bruteforceChoice);
                    break;
            }
        }
        return result;
    }

    private static bruteforceChoice(notes: Notes): Step | null {
        const emptyCell = SudokuSolver.getNextEmptyCell(notes);
        const r = emptyCell ? emptyCell[0] : -1;
        const c = emptyCell ? emptyCell[1] : -1;
        const cellNotes = notes[r][c];
        if (emptyCell !== null && cellNotes !== null) {
            const step: Step = {
                row: r,
                col: c,
                value: cellNotes[0],
                method: SolverMethod.BACKTRACK,
                backtrackValues: cellNotes,
                backtrackIdx: 0,
            };
            return step;
        }
        return null;
    }

    public static reset(grid: number[][], steps: Step[]): [Step[], number[][]] {
        let copyGrid = grid.map((r) => r.slice());
        const copySteps: Step[] = steps.map((step) => ({
            ...step,
            backtrackValues: [...step.backtrackValues],
        }));
        while (copySteps.length) {
            const grid = SudokuSolver.prev(copyGrid, copySteps);
            const step = copySteps.pop();
            if (step === undefined) {
                return [copySteps, copyGrid];
            } else if (step.method === SolverMethod.MANUAL) {
                copyGrid[step.row][step.col] = step.value;
                return [[...copySteps, step], copyGrid];
            }
            copyGrid = grid;
        }
        return [copySteps, copyGrid];
    }

    public static prev(grid: number[][], steps: Step[]): number[][] {
        const copyGrid = grid.map((r) => r.slice());
        if (steps.length <= 0) {
            return copyGrid;
        }
        const lastStep = steps.slice(-1)[0];
        const copySteps: Step[] = steps.map((step) => ({
            ...step,
            backtrackValues: [...step.backtrackValues],
        }));
        if (lastStep.method === SolverMethod.MANUAL && lastStep.value === 0) {
            const val = copySteps
                .slice(0, -1)
                .reverse()
                .find((step) => step.col === lastStep.col && step.row === lastStep.row);
            copyGrid[lastStep.row][lastStep.col] = val === undefined ? 0 : val.value;
        } else {
            copyGrid[lastStep.row][lastStep.col] = 0;
        }
        return copyGrid;
    }

    /** Check if grid is solvable. */
    public static isSolveable(grid: number[][], steps: Step[]): boolean {
        const copyGrid = grid.map((r) => r.slice());
        const copySteps: Step[] = steps.map((step) => ({
            ...step,
            backtrackValues: [...step.backtrackValues],
        }));
        const newGrid = SudokuSolver.solve(copyGrid, copySteps, [
            { enabled: true, label: SolverMethod.BACKTRACK },
        ])[1];
        return SudokuChecker.isSolved(newGrid);
    }

    public static solve(
        grid: number[][],
        steps: Step[],
        solverOptions: Solver[]
    ): [Step[], number[][]] {
        const newSteps: Step[] = [];
        let copyGrid = grid.map((r) => r.slice());
        const copySteps: Step[] = steps.map((step) => ({
            ...step,
            backtrackValues: [...step.backtrackValues],
        }));
        let step: Step | boolean;
        let newGrid: number[][];
        const running = true;
        do {
            [step, newGrid] = SudokuSolver.step(
                copyGrid,
                [...copySteps, ...newSteps],
                solverOptions
            );
            if (step === true || step == false) {
                break;
            }
            newSteps.push(step);
            copyGrid = newGrid;
        } while (running);
        return [newSteps, copyGrid];
    }

    /** Check if backtrack step already exists in steps list where all options have been tried. */
    private static exhausted(steps: Step[], step: Step, idx: number): boolean {
        // start from -idx, because otherwise it can return true from previous branches while
        // the current step is not exhausted in this backtracking branch
        for (let i = steps.length - idx; i < steps.length; i++) {
            const s = steps[i];
            if (s.col === step.col && s.row === step.row) {
                if (s.backtrackIdx === s.backtrackValues.length - 1) {
                    return true;
                }
            }
        }
        return false;
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
            // console.log("solved", SudokuChecker.isValid(grid), steps.length);
            return [true, copyGrid];
        }

        // Backtracking
        // Backtrack never removes steps, so after options has failed a new step will be added on top.
        const lastStep = copySteps.slice(-1)[0];
        if (!SudokuChecker.isSolvable(notes) && lastStep !== undefined) {
            console.log("not a valid grid, backtrack");
            let idx = 1;
            console.log(copySteps);
            while (copySteps.length - idx >= 0) {
                const lastStep = copySteps[copySteps.length - idx];
                // Dont backtrack manually filled in cells (return user feedback)
                if (lastStep.method === SolverMethod.MANUAL) {
                    return [false, copyGrid];
                }

                if (
                    lastStep.method === SolverMethod.BACKTRACK &&
                    lastStep.backtrackIdx < lastStep.backtrackValues.length - 1 &&
                    !SudokuSolver.exhausted(copySteps, lastStep, idx)
                ) {
                    const newstep: Step = {
                        ...lastStep,
                        value: lastStep.backtrackValues[lastStep.backtrackIdx + 1],
                        backtrackIdx: lastStep.backtrackIdx + 1,
                    };
                    copyGrid[newstep.row][newstep.col] = newstep.value;
                    return [newstep, copyGrid];
                }
                copyGrid[lastStep.row][lastStep.col] = 0;
                idx += 1;
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
