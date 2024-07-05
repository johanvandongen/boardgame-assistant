import { Button, styled } from "@mui/material";
import * as React from "react";
import { CatanBoard } from "./CatanBoard.tsx";
import { CatanBoardTiles } from "./CatanBoard.ts";

export interface IBoardGeneratorProps {}

const c = new CatanBoardTiles(20);
export function BoardGenerator() {
    const [dummy, setDummy] = React.useState(0);
    const [rotation, setRotation] = React.useState<0 | 90>(90);

    const toggleRotation = () => {
        if (rotation === 0 || dummy === -1) {
            setRotation(90);
        } else {
            setRotation(0);
        }
        // setRotation((prev) => (prev + 90) % 180);
    };

    return (
        <BoardGeneratorContainer>
            <Button onClick={toggleRotation}>Rotate</Button>
            <BoardContainer>
                <CatanBoard rotation={rotation} catanBoard={c} />
            </BoardContainer>
            <Button
                onClick={() => {
                    c.RandomizeTerrain();
                    setDummy((prev) => (prev += 1));
                }}
            >
                Tiles
            </Button>
            <Button
                onClick={() => {
                    c.RandomizeNumbers();
                    setDummy((prev) => (prev += 1));
                }}
            >
                Numbers
            </Button>
            <Button
                onClick={() => {
                    c.Randomize();
                    setDummy((prev) => (prev += 1));
                }}
            >
                Both
            </Button>
        </BoardGeneratorContainer>
    );
}

const BoardGeneratorContainer = styled("div")(() => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

const BoardContainer = styled("div")(() => ({
    width: "90%",
}));
