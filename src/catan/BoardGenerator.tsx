import { Alert, Button, Collapse, IconButton, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import { CatanBoard } from "./CatanBoard.tsx";
import { CatanBoardTiles } from "./CatanBoard.ts";
import { GenerationOptions } from "./GenerationOptions.tsx";

export interface IBoardGeneratorProps {}

const c = new CatanBoardTiles(20);
export function BoardGenerator() {
    const [dummy, setDummy] = React.useState(0);
    const [showNotification, setShowNotification] = React.useState(false);
    const [showMore, setShowMore] = React.useState(true);
    const [rotation, setRotation] = React.useState<0 | 90>(90);

    // TODO dont use catan class mutation, use react states instead, this is hacky but faster when transfering old code
    const refresh = () => {
        setDummy((prev) => (prev += 1));
    };

    const toggleRotation = () => {
        if (rotation === 0) {
            setRotation(90);
        } else {
            setRotation(0);
        }
        // setRotation((prev) => (prev + 90) % 180);
    };

    return (
        <BoardGeneratorContainer>
            <div style={{ display: "none" }}>{dummy}</div>
            <Button onClick={toggleRotation}>Rotate</Button>
            <BoardContainer>
                <CatanBoard rotation={rotation} catanBoard={c} />
            </BoardContainer>
            <Container>
                <div>
                    Generate
                    <GenerateContainer>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                const succes = c.RandomizeTerrain();
                                setShowNotification(!succes);
                                refresh();
                            }}
                        >
                            Terrain
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                const succes = c.RandomizeNumbers();
                                setShowNotification(!succes);
                                refresh();
                            }}
                        >
                            Numbers
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                const succes = c.Randomize();
                                setShowNotification(!succes);
                                refresh();
                            }}
                        >
                            Both
                        </Button>
                    </GenerateContainer>
                </div>
                {showMore ? (
                    <a onClick={() => setShowMore(false)}>Show less</a>
                ) : (
                    <a onClick={() => setShowMore(true)}>Show more</a>
                )}
                <Collapse in={!showMore}>
                    <GenerationOptions c={c} refresh={refresh} />
                </Collapse>
                <Collapse in={showNotification}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setShowNotification(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{
                            position: "fixed",
                            left: 0,
                            right: 0,
                            bottom: "0.5rem",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "90%",
                        }}
                        severity="warning"
                    >
                        Couldn't find board with the given requirements.
                    </Alert>
                </Collapse>
            </Container>
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

const GenerateContainer = styled("div")(() => ({
    display: "flex",
    gap: "0.5rem",
}));

const Container = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
}));
