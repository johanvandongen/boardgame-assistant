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
import { SudokuSolver } from "./SudokuSolver";
import { useEffect, useState } from "react";
import {
    ArrowBack,
    ArrowDownward,
    ArrowForward,
    KeyboardDoubleArrowLeft,
    KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { CenterSplitView } from "../reusable/CenterSplitView";
import useSnackbar from "./useSnackbar";
import React from "react";
import { SudokuChecker } from "./SudokuChecker";
import { Solver, SolverMethod, Step } from "./model";

const solvers: Solver[] = [
    { enabled: true, label: SolverMethod.ROW },
    { enabled: true, label: SolverMethod.COL },
    { enabled: true, label: SolverMethod.BOX },
    { enabled: true, label: SolverMethod.ELIMINATION },
    { enabled: false, label: SolverMethod.BOXBEAM },
    { enabled: false, label: SolverMethod.HIDDENPAIR },
    { enabled: false, label: SolverMethod.BACKTRACK },
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

    const handleSolve = () => {
        setSud((prev) => {
            const [steps, grid] = SudokuSolver.solve(prev.grid, prev.steps, prev.options);
            return { ...prev, steps: [...prev.steps, ...steps], grid: grid, forwardCheck: true };
        });
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
        } else if (
            !SudokuSolver.isSolveable(sud.grid, sud.steps) &&
            sud.forwardCheck &&
            step === false
        ) {
            addMessage("Cannot solve further due to unsolvable state", "warning");
        } else if (!SudokuSolver.isSolveable(sud.grid, sud.steps)) {
            addMessage("Sudoku is in unsolvable state", "error");
        } else if (sud.forwardCheck && step === false && sud.forwardCheck) {
            addMessage("Cannot solve with applied solvers", "warning");
        } else if (step === true) {
            addMessage("Solved!", "success");
        } else {
            snackClose();
        }
    };

    const handleReset = () => {
        // needs refactor, because if statements are simlar to handlePrev
        setSud((prev) => {
            if (prev.steps.length <= 0) {
                return {
                    ...prev,
                    forwardCheck: false,
                };
            }
            if (prev.steps[prev.steps.length - 1].method === "manual") {
                const grid = SudokuSolver.prev(prev.grid, prev.steps);
                return {
                    ...prev,
                    grid: grid,
                    steps: prev.steps.slice(0, -1),
                    forwardCheck: false,
                };
            }
            const [steps, grid] = SudokuSolver.reset(prev.grid, prev.steps);
            return { ...prev, steps: steps, grid: grid };
        });
        setCurrentCell([-1, -1]);
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
            forwardCheck: false,
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
                row: currentCell[0],
                col: currentCell[1],
                value: num,
                method: SolverMethod.MANUAL,
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
                        <IconButton
                            sx={{ color: theme.palette.primary.main }}
                            onClick={handleReset}
                        >
                            <KeyboardDoubleArrowLeft />
                        </IconButton>
                        <IconButton sx={{ color: theme.palette.primary.main }} onClick={handlePrev}>
                            <ArrowBack />
                        </IconButton>
                        <IconButton sx={{ color: theme.palette.primary.main }} onClick={handleStep}>
                            <ArrowForward />
                        </IconButton>
                        <IconButton
                            sx={{ color: theme.palette.primary.main }}
                            onClick={handleSolve}
                        >
                            <KeyboardDoubleArrowRight />
                        </IconButton>
                    </ButtonContainer>
                </VisContainer>
            }
            right={
                <OptionsContainer>
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
                    <h3>Options</h3>
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
                                    key={"X wing"}
                                    control={
                                        <Checkbox
                                            sx={{ paddingTop: 0, paddingBottom: 0 }}
                                            disabled
                                        />
                                    }
                                    label={"X wing"}
                                />
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
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
