import { SudokuGrid } from "./SudokuGrid";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    IconButton,
    Snackbar,
    styled,
    Switch,
    Typography,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Step, SudokuSolver } from "./SudokuSolver";
import { useEffect, useState } from "react";
import { ArrowBack, ArrowDownward, ArrowForward } from "@mui/icons-material";
import { CenterSplitView } from "../reusable/CenterSplitView";
import useSnackbar from "./useSnackbar";
import React from "react";
import { SudokuChecker } from "./SudokuChecker";
// import { SudokuChecker } from "./SudokuChecker";

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
    const theme = useTheme();
    const [showNotes, setShowNotes] = useState(false);
    const [currentCell, setCurrentCell] = useState<[number, number]>([-1, -1]);
    const [sud, setSud] = useState<{
        grid: number[][];
        steps: Step[];
        options: Solver[];
        forwardCheck: boolean;
    }>({
        grid: grid,
        steps: [],
        options: solvers,
        forwardCheck: false,
    });
    const { messageInfo, open: snackOpen, addMessage, snackExited, snackClose } = useSnackbar();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleStep = () => {
        setSud((prev) => {
            const [step, grid] = SudokuSolver.step(prev.grid, prev.steps, prev.options);
            if (!(typeof step === "boolean")) {
                return {
                    ...prev,
                    grid: grid,
                    steps: [...prev.steps, step],
                    options: prev.options,
                    forwardCheck: true,
                };
            }
            return {
                ...prev,
                forwardCheck: true,
            };
        });
        setCurrentCell([-1, -1]);
    };

    const setSnackbarMessage = (grid: number[][], steps: Step[], options: Solver[]) => {
        const step = SudokuSolver.step(grid, steps, options)[0];
        if (!SudokuChecker.isValid(sud.grid)) {
            addMessage("Sudoku is in incorrect state", "error");
        } else if (sud.forwardCheck && step === false) {
            addMessage("Cannot solve further with applied solvers", "warning");
        } else if (step === true) {
            addMessage("Solved!", "success");
        } else {
            snackClose();
        }
    };

    function handlePrev() {
        setSud((prev) => {
            if (prev.steps.length <= 0) {
                return {
                    ...prev,
                    forwardCheck: false,
                };
            }
            const grid = SudokuSolver.prev(prev.grid, prev.steps);
            return {
                ...prev,
                grid: grid,
                steps: prev.steps.slice(0, -1),
                forwardCheck: false,
            };
        });
        setCurrentCell([-1, -1]);
    }

    const handleSolvers = (label: string) => {
        setSud((prev) => ({
            ...prev,
            options: prev.options.map((solver) =>
                solver.label === label ? { ...solver, enabled: !solver.enabled } : solver
            ),
        }));
    };

    const handleSetSudoku = (num: number) => {
        setSud((prev) => {
            if (currentCell[0] === -1 || currentCell[1] === -1) {
                return prev;
            }

            const newGrid = prev.grid.map((row, rowIdx) =>
                rowIdx === currentCell[0]
                    ? row.map((col, colIdx) => (colIdx === currentCell[1] ? num : col))
                    : row
            );
            const newStep: Step = {
                state: "unknown",
                row: currentCell[0],
                col: currentCell[1],
                value: num,
                method: "manual",
                backtrackValues: [],
                backtrackIdx: 0,
            };
            return {
                ...prev,
                steps: [...prev.steps, newStep],
                grid: newGrid,
                forwardCheck: false,
            };
        });
    };

    const clearGrid = () => {
        setSud((prev) => ({
            ...prev,
            steps: [],
            grid: SudokuSolver.getEmptyGrid(),
        }));
    };

    useEffect(() => {
        setSnackbarMessage(sud.grid, sud.steps, sud.options);
    }, [sud]);

    return (
        <CenterSplitView
            left={
                <VisContainer>
                    {/* <Button onClick={addMessage("Solved!", "success")}>Show message A</Button>
                    <Button
                        onClick={addMessage("Cannot solve further with applied solvers", "warning")}
                        >
                        Show message B
                    </Button>
                    <Button onClick={addMessage("Sudoku is in incorrect state", "error")}>
                        Show message C
                    </Button>
                    <Button onClick={addMessage("Sudoku is unsolvable", "warning")}>
                        Show message D
                    </Button> */}
                    <Snackbar
                        key={messageInfo ? messageInfo.key : undefined}
                        open={snackOpen}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        TransitionProps={{ onExited: snackExited }}
                        message={messageInfo ? messageInfo.message : undefined}
                        action={
                            <React.Fragment>
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    sx={{ p: 0.5 }}
                                    onClick={() => snackClose()}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </React.Fragment>
                        }
                    >
                        <Alert
                            onClose={() => snackClose()}
                            severity={messageInfo ? messageInfo.severity : "info"}
                            variant="filled"
                            sx={{ width: "100%" }}
                        >
                            {messageInfo ? messageInfo.message : undefined}
                        </Alert>
                    </Snackbar>
                    <InputContainer>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Do you want to clear all cells?"}
                            </DialogTitle>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button
                                    onClick={() => {
                                        handleClose();
                                        clearGrid();
                                    }}
                                    autoFocus
                                >
                                    Clear
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Button sx={{ minWidth: 0, fontSize: "1rem" }} onClick={handleClickOpen}>
                            C
                        </Button>
                        <Button
                            sx={{ minWidth: 0, fontSize: "1rem" }}
                            onClick={() => handleSetSudoku(0)}
                        >
                            &#9003;
                        </Button>
                        {[...Array(9).keys()].map((num) => (
                            <Button
                                key={"numberinput" + num}
                                sx={{ minWidth: 0, fontSize: "1rem" }}
                                onClick={() => handleSetSudoku(num + 1)}
                            >
                                {num + 1}
                            </Button>
                        ))}
                    </InputContainer>
                    <BoardGeneratorContainer>
                        <SudokuGrid
                            sudoku={sud.grid}
                            showNotes={showNotes}
                            steps={sud.steps}
                            currentCell={currentCell}
                            setCurrentCell={setCurrentCell}
                        />
                    </BoardGeneratorContainer>
                    <ButtonContainer>
                        <IconButton sx={{ color: theme.palette.primary.main }} onClick={handlePrev}>
                            <ArrowBack />
                        </IconButton>
                        <IconButton sx={{ color: theme.palette.primary.main }} onClick={handleStep}>
                            <ArrowForward />
                        </IconButton>
                    </ButtonContainer>
                </VisContainer>
            }
            right={
                <OptionsContainer>
                    <h3>Options</h3>
                    <div>
                        <p>Steps taken: {sud.steps.length}</p>
                        <p>Last step:</p>
                        {sud.steps.length > 0 ? (
                            <p>
                                <i>
                                    {sud.steps.slice(-1)[0].value} using{" "}
                                    {sud.steps.slice(-1)[0].method} method
                                </i>
                            </p>
                        ) : (
                            <p>
                                <i>No steps taken</i>
                            </p>
                        )}
                        {/* <p>check notes version</p> */}
                    </div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showNotes}
                                onChange={() => setShowNotes((prev) => !prev)}
                            />
                        }
                        label={"show notes"}
                    ></FormControlLabel>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDownward />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography>Solvers applied</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
                                    control={
                                        <Checkbox
                                            sx={{ paddingTop: 0, paddingBottom: 0 }}
                                            disabled
                                        />
                                    }
                                    label={"Last remaining"}
                                />
                                <FormControlLabel
                                    key={"naked pair"}
                                    control={
                                        <Checkbox
                                            sx={{ paddingTop: 0, paddingBottom: 0 }}
                                            disabled
                                        />
                                    }
                                    label={"naked pair"}
                                />
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                    {/* <p>Solvers applied</p> */}
                </OptionsContainer>
            }
        />
    );
}

const OptionsContainer = styled("div")(({ theme }) => ({
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        width: "50%",
    },
}));
const InputContainer = styled("div")(() => ({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1rem",
}));

const ButtonContainer = styled("div")(() => ({
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
}));

const VisContainer = styled("div")(({ theme }) => ({
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        width: "70dvh",
    },
}));

const BoardGeneratorContainer = styled("div")(() => ({
    width: "100%",
}));
