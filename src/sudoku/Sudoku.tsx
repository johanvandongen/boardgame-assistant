import { SudokuGrid } from "./SudokuGrid";
import { Button, styled } from "@mui/material";
import { SudokuSolver } from "./SudokuSolver";
import { useState } from "react";

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
    const [showNotes, setShowNotes] = useState(false);

    const handleStep = () => {
        setSudoku((prev) => {
            const n: SudokuSolver = prev.step();
            return new SudokuSolver(n.getGrid(), undefined, n.getSteps());
        }); // create new class instance, because react
    };

    return (
        <BoardGeneratorContainer>
            <SudokuGrid sudoku={sudoku} showNotes={showNotes} />
            <ButtonContainer>
                <Button variant="outlined" onClick={() => setShowNotes((prev) => !prev)}>
                    Show notes
                </Button>
                <Button variant="outlined" onClick={handleStep}>
                    Step
                </Button>
            </ButtonContainer>
        </BoardGeneratorContainer>
    );
}

const ButtonContainer = styled("div")(() => ({
    display: "flex",
    gap: "1rem",
}));

const BoardGeneratorContainer = styled("div")(() => ({
    width: "90%",
    display: "flex",
    marginTop: "1rem",
    gap: "1rem",
    flexDirection: "column",
    alignItems: "center",
}));
