import { SudokuGrid } from "./SudokuGrid";
import { Button, Checkbox, FormControlLabel, FormGroup, styled, Switch } from "@mui/material";
import { Step, SudokuSolver } from "./SudokuSolver";
import { useState } from "react";

export interface Solver {
    enabled: boolean;
    label: string;
}
export interface Solvers {
    boxCheck: Solver;
    rowCheck: Solver;
    colCheck: Solver;
    backtrack: Solver;
}
const solvers: Solvers = {
    rowCheck: { enabled: false, label: "row check" },
    colCheck: { enabled: false, label: "col check" },
    boxCheck: { enabled: false, label: "box check" },
    backtrack: { enabled: true, label: "backtrack" },
};

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
    const [solver, setSolvers] = useState<Solvers>(solvers);
    const [showNotes, setShowNotes] = useState(false);
    const [sud, setSud] = useState<{ grid: number[][]; steps: Step[]; options: Solvers }>({
        grid: grid,
        steps: [],
        options: solvers,
    });
    // const notes = SudokuSolver.calculateNotes(sud.grid);

    const handleStep = () => {
        setSud((prev) => {
            const [step, grid] = SudokuSolver.step(prev.grid, prev.options);
            if (!(typeof step === "boolean")) {
                return { grid: grid, steps: [...prev.steps, step], options: prev.options };
            }
            return prev;
        });
    };

    const handleSolvers = (solverToUpdate: Solver) => {
        setSolvers((prev) => {
            const res: Solvers = { ...prev };
            for (const solver in prev) {
                if (prev[solver as keyof typeof prev].label === solverToUpdate.label) {
                    res[solver as keyof typeof prev].enabled = !solverToUpdate.enabled;
                }
            }
            return { ...res };
        });
    };

    return (
        <Container>
            <div>
                <BoardGeneratorContainer>
                    <SudokuGrid sudoku={sud.grid} showNotes={showNotes} steps={sud.steps} />
                </BoardGeneratorContainer>
                <ButtonContainer>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            handleStep();
                        }}
                    >
                        Step
                    </Button>
                    <p>slider</p>
                    <p>prev, next</p>
                </ButtonContainer>
            </div>
            <div>
                <p>Solvers applied</p>
                <FormGroup>
                    {Object.keys(solver).map((key) => (
                        <FormControlLabel
                            key={solvers[key as keyof typeof solvers].label}
                            control={
                                <Checkbox
                                    checked={solvers[key as keyof typeof solvers].enabled}
                                    onChange={() =>
                                        handleSolvers(solvers[key as keyof typeof solvers])
                                    }
                                />
                            }
                            label={solvers[key as keyof typeof solvers].label}
                        />
                    ))}
                    <FormControlLabel
                        key={"Last remaining"}
                        control={<Checkbox disabled />}
                        label={"Last remaining"}
                    />
                    <FormControlLabel
                        key={"naked pair"}
                        control={<Checkbox disabled />}
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
                    <p>Metadata</p>
                    <p>Solve size: {sud.steps.length}</p>
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
