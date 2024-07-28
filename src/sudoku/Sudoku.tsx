import { SudokuGrid } from "./SudokuGrid";
import { Button, Checkbox, FormControlLabel, FormGroup, styled, Switch } from "@mui/material";
import { Step, SudokuSolver } from "./SudokuSolver";
import { useState } from "react";

export interface Solver {
    enabled: boolean;
    label: string;
}

const solvers: Solver[] = [
    { enabled: true, label: "row check" },
    { enabled: true, label: "col check" },
    { enabled: true, label: "box check" },
    { enabled: true, label: "backtrack" },
];

const grid = [
    [0, 0, 4, 0, 0, 1, 0, 6, 0],
    [0, 0, 0, 9, 2, 0, 0, 0, 0],
    [7, 8, 0, 0, 0, 6, 5, 1, 0],
    [0, 6, 0, 0, 7, 0, 4, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 3],
    [0, 9, 0, 0, 0, 4, 2, 5, 1],
    [4, 3, 1, 0, 0, 9, 0, 8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 0, 5],
];
export function Sudoku() {
    const [showNotes, setShowNotes] = useState(false);
    const [sud, setSud] = useState<{ grid: number[][]; steps: Step[]; options: Solver[] }>({
        grid: grid,
        steps: [],
        options: solvers,
    });
    // const notes = SudokuSolver.calculateNotes(sud.grid);

    const handleStep = () => {
        setSud((prev) => {
            const [step, grid] = SudokuSolver.step(prev.grid, prev.steps, prev.options);
            if (!(typeof step === "boolean")) {
                return { grid: grid, steps: [...prev.steps, step], options: prev.options };
            }
            return prev;
        });
    };

    const handlePrev = () => {
        setSud((prev) => {
            if (prev.steps.length <= 0) {
                return prev;
            }
            const grid = SudokuSolver.prev(prev.grid, prev.steps);
            return { ...prev, grid: grid, steps: prev.steps.slice(0, -1) };
        });
    };

    const handleSolvers = (label: string) => {
        setSud((prev) => ({
            ...prev,
            options: prev.options.map((solver) =>
                solver.label === label ? { ...solver, enabled: !solver.enabled } : solver
            ),
        }));
    };

    return (
        <Container>
            <div>
                <BoardGeneratorContainer>
                    <SudokuGrid sudoku={sud.grid} showNotes={showNotes} steps={sud.steps} />
                </BoardGeneratorContainer>
                <ButtonContainer>
                    <Button variant="outlined" onClick={handlePrev}>
                        Prev
                    </Button>
                    <Button variant="outlined" onClick={handleStep}>
                        Step
                    </Button>
                </ButtonContainer>
            </div>
            <div>
                <p>Solvers applied</p>
                <FormGroup>
                    {sud.options.map((solver) => (
                        <FormControlLabel
                            key={solver.label}
                            control={
                                <Checkbox
                                    sx={{ paddingTop: 0, paddingBottom: 0 }}
                                    checked={solver.enabled}
                                    onChange={() => handleSolvers(solver.label)}
                                />
                            }
                            label={solver.label}
                        />
                    ))}
                    <FormControlLabel
                        key={"Last remaining"}
                        control={<Checkbox sx={{ paddingTop: 0, paddingBottom: 0 }} disabled />}
                        label={"Last remaining"}
                    />
                    <FormControlLabel
                        key={"naked pair"}
                        control={<Checkbox sx={{ paddingTop: 0, paddingBottom: 0 }} disabled />}
                        label={"naked pair"}
                    />
                </FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showNotes}
                            onChange={() => setShowNotes((prev) => !prev)}
                        />
                    }
                    label={"show notes"}
                ></FormControlLabel>
                <div>
                    <p>Solution info</p>
                    <p>Solve size: {sud.steps.length}</p>
                    <p>
                        {/* Last step: {sud.steps.length > 0 && sud.steps.slice(-1)[0].method} */}
                    </p>
                    <p>Last step</p>
                    {sud.steps.length > 0 && (
                        <p>
                            {sud.steps.slice(-1)[0].value} using {sud.steps.slice(-1)[0].method}{" "}
                            method
                        </p>
                    )}
                </div>
                {/* <p>check notes version</p> */}
            </div>
        </Container>
    );
}

const Container = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "80%",
    [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
        height: "70dvh",
    },
    justifyContent: "space-between",
    gap: "1rem",
    marginTop: "1rem",
}));

const ButtonContainer = styled("div")(() => ({
    display: "flex",
    gap: "1rem",
}));

const BoardGeneratorContainer = styled("div")(() => ({
    height: "100%",
    aspectRatio: "1 / 1",
    display: "flex",
    gap: "1rem",
    flexDirection: "column",
    alignItems: "center",
}));
