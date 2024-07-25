import { SudokuGrid } from "./SudokuGrid";
import { Button, Checkbox, FormControlLabel, FormGroup, styled, Switch } from "@mui/material";
import { SudokuSolver } from "./SudokuSolver";
import { useEffect, useState } from "react";

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
    rowCheck: { enabled: true, label: "row check" },
    colCheck: { enabled: true, label: "col check" },
    boxCheck: { enabled: true, label: "box check" },
    backtrack: { enabled: true, label: "backtrack" },
};

export function Sudoku() {
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
    const [sudoku, setSudoku] = useState<SudokuSolver>(new SudokuSolver(grid));
    const [solver, setSolvers] = useState<Solvers>(solvers);
    const [solveSize, setSolveSize] = useState<number | undefined>(undefined);
    const [showNotes, setShowNotes] = useState(false);

    const handleStep = () => {
        setSudoku((prev) => {
            const n: SudokuSolver | boolean = prev.step();
            if (n === true || n === false) {
                return prev;
            }
            const result = new SudokuSolver(n.getGrid(), undefined, n.getSteps(), n.getTree());
            return result;
        }); // create new class instance, because react
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

    useEffect(() => {
        setSolveSize(sudoku.getTree().getRoot().getSize());
    }, [sudoku]);

    useEffect(() => {
        sudoku.setSolverOptions(solver);
    }, [sudoku, solver]);

    return (
        <Container>
            <div>
                <BoardGeneratorContainer>
                    <SudokuGrid sudoku={sudoku} showNotes={showNotes} />
                </BoardGeneratorContainer>
                <ButtonContainer>
                    <Button variant="outlined" onClick={handleStep}>
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
                    <p>Solve size: {solveSize}</p>
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
