import * as React from "react";
import { SudokuSolver } from "./SudokuSolver";

export interface ISudokuGridProps {
    sudoku: SudokuSolver;
    showNotes: boolean;
}

export function SudokuGrid({ sudoku, showNotes }: ISudokuGridProps) {
    const grid = sudoku.getGrid();
    const notes = sudoku.getNotes();
    const lastStep = sudoku.getLastStep();
    // const s = { ...sudoku, notes: sudoku.getNotes() };
    console.log("notes", sudoku.getNotes());
    const cells = 9;
    const cellSize = 32;
    const gridSize = cells * cellSize;
    const outerStrokeWidth = 2;
    const innerStrokeWidth = 1;
    console.log(grid);
    return (
        <svg viewBox={`0 0 ${gridSize + outerStrokeWidth} ${gridSize + outerStrokeWidth}`}>
            {lastStep !== null && (
                <rect
                    x={lastStep.col * cellSize}
                    y={lastStep.row * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill="green"
                ></rect>
            )}
            {grid.map((row, r) =>
                row.map((val, c) => (
                    <text
                        key={"gridvalue" + r.toString() + "-" + c.toString()}
                        x={outerStrokeWidth / 2 + cellSize * c + cellSize / 2}
                        y={outerStrokeWidth + cellSize * r + cellSize / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontWeight={600}
                        fill={"black"}
                    >
                        {val > 0 && val}
                    </text>
                ))
            )}

            {showNotes &&
                notes.map((row, r) =>
                    row.map((options, c) => {
                        if (options === null) {
                            return;
                        }
                        return options.map((option) => (
                            <text
                                key={"note" + r.toString() + "- " + c.toString() + "-" + option}
                                x={
                                    outerStrokeWidth / 2 +
                                    cellSize * c +
                                    (cellSize / 4) * (1 + ((option - 1) % 3))
                                }
                                y={
                                    outerStrokeWidth +
                                    cellSize * r +
                                    (cellSize / 4) * (1 + Math.floor((option - 1) / 3))
                                }
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={32 / 4}
                                fontWeight={600}
                                fill={"gray"}
                            >
                                {option > 0 && option}
                            </text>
                        ));
                    })
                )}
            {[...Array(11).keys()].map((x) => {
                const strokeWidth = x % 3 == 0 ? outerStrokeWidth : innerStrokeWidth;
                return (
                    <React.Fragment key={"line" + x}>
                        <line
                            key={"horizontal" + x}
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x1={0}
                            y1={outerStrokeWidth / 2 + x * cellSize}
                            x2={gridSize + outerStrokeWidth}
                            y2={outerStrokeWidth / 2 + x * cellSize}
                        ></line>
                        <line
                            key={"vertical" + x}
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x1={outerStrokeWidth / 2 + x * cellSize}
                            y1={0}
                            x2={outerStrokeWidth / 2 + x * cellSize}
                            y2={gridSize + outerStrokeWidth}
                        ></line>
                    </React.Fragment>
                );
            })}
        </svg>
    );
}
