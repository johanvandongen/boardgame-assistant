import {
    Alert,
    Button,
    Checkbox,
    Collapse,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    SelectChangeEvent,
    Slider,
    styled,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import { CatanBoard } from "./CatanBoard.tsx";
import { CatanBoardTiles } from "./CatanBoard.ts";

export interface IBoardGeneratorProps {}
function valuetext(value: number) {
    return `${value}°C`;
}
const c = new CatanBoardTiles(20);
const minDistance = 3;
export function BoardGenerator() {
    const [dummy, setDummy] = React.useState(0);
    const [showNotification, setShowNotification] = React.useState(false);
    const [showMore, setShowMore] = React.useState(true);
    const [terrainTouch, setTerrainTouch] = React.useState(false);
    const [redNumberTouch, setRedNumberTouch] = React.useState(false);
    const [pipRange, setPipRange] = React.useState<number[]>([1, 15]);
    const [robberPlace, setRobberPlace] = React.useState<string>("Inner");
    const [rotation, setRotation] = React.useState<0 | 90>(90);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handleRobberPlaceChange = (event: SelectChangeEvent) => {
        const innerRobberPlaces = [[2, 2]];
        const middleRobberPlaces = [
            [1, 1],
            [1, 2],
            [2, 1],
            [2, 3],
            [3, 1],
            [3, 2],
        ];
        const outerRobberPlaces = [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 0],
            [1, 3],
            [2, 0],
            [2, 4],
            [3, 0],
            [3, 3],
            [4, 0],
            [4, 1],
            [4, 2],
        ];
        if (event.target.value === "Inner") {
            c.setRobberPlace(innerRobberPlaces);
        } else if (event.target.value === "Middle") {
            c.setRobberPlace(middleRobberPlaces);
        } else if (event.target.value === "Outer") {
            c.setRobberPlace(outerRobberPlaces);
        }
        c.Randomize();
        setRobberPlace(event.target.value);
    };

    const handleChange1 = (event: Event, newValue: number | number[], activeThumb: number) => {
        const max = 15;
        const min = 4;
        if (!Array.isArray(newValue)) {
            return;
        }

        let pipRange = [4, 15];
        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], max - minDistance);
                pipRange = [clamped, clamped + minDistance];
            } else {
                const clamped = Math.max(newValue[1], minDistance + min);
                pipRange = [clamped - minDistance, clamped];
            }
        } else {
            pipRange = newValue as number[];
        }
        setPipRange(pipRange);
        c.numberRandomizer.setPipRange(pipRange);
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
            {/** TODO dont use catan class mutation, use react states instead, this is hacky but faster when transfering old code*/}
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
                                setDummy((prev) => (prev += 1));
                            }}
                        >
                            Terrain
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                const succes = c.RandomizeNumbers();
                                setShowNotification(!succes);
                                setDummy((prev) => (prev += 1));
                            }}
                        >
                            Numbers
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                const succes = c.Randomize();
                                setShowNotification(!succes);
                                setDummy((prev) => (prev += 1));
                            }}
                        >
                            Both
                        </Button>
                    </GenerateContainer>
                </div>
                {showMore ? (
                    <>
                        <div>
                            <a
                                className="show-more"
                                onClick={() => {
                                    setShowMore(false);
                                }}
                            >
                                Show less
                            </a>
                            <div>
                                <FormGroup>
                                    <div>
                                        <Typography
                                            aria-owns={open ? "mouse-over-popover" : undefined}
                                            aria-haspopup="true"
                                            onMouseEnter={handlePopoverOpen}
                                            onMouseLeave={handlePopoverClose}
                                        >
                                            Pip range
                                        </Typography>
                                        <Popover
                                            id="mouse-over-popover"
                                            sx={{
                                                pointerEvents: "none",
                                            }}
                                            open={open}
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "left",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "left",
                                            }}
                                            onClose={handlePopoverClose}
                                            disableRestoreFocus
                                        >
                                            <Typography sx={{ p: 1 }}>
                                                Point of Production
                                            </Typography>
                                        </Popover>
                                    </div>
                                    <Slider
                                        min={4}
                                        max={15}
                                        getAriaLabel={() => "Minimum distance"}
                                        value={pipRange}
                                        onChange={handleChange1}
                                        valueLabelDisplay="auto"
                                        getAriaValueText={valuetext}
                                        disableSwap
                                        marks={[
                                            {
                                                value: 4,
                                                label: "4",
                                            },
                                            {
                                                value: pipRange[0],
                                                label: pipRange[0],
                                            },
                                            {
                                                value: pipRange[1],
                                                label: pipRange[1],
                                            },
                                            {
                                                value: 15,
                                                label: "15",
                                            },
                                        ]}
                                    />
                                    <FormControl fullWidth variant="filled">
                                        <InputLabel id="demo-simple-select-label">
                                            Robber spawn place
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={robberPlace}
                                            label="Robber spawn place"
                                            onChange={handleRobberPlaceChange}
                                        >
                                            <MenuItem value={"Inner"}>Inner ring</MenuItem>
                                            <MenuItem value={"Middle"}>Middle ring</MenuItem>
                                            <MenuItem value={"Outer"}>Outer ring</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={terrainTouch}
                                                onChange={(e) =>
                                                    setTerrainTouch(() => {
                                                        if (e.target.checked === true) {
                                                            c.terrainRandomizer.setMatchingTerrain(
                                                                2
                                                            );
                                                        } else {
                                                            c.terrainRandomizer.setMatchingTerrain(
                                                                0
                                                            );
                                                        }
                                                        c.RandomizeTerrain();
                                                        return e.target.checked;
                                                    })
                                                }
                                            />
                                        }
                                        label="Same terrains can touch"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={redNumberTouch}
                                                onChange={(e) => {
                                                    c.numberRandomizer.setMatchingRedNumbersAllowed(
                                                        e.target.checked
                                                    );
                                                    setRedNumberTouch(e.target.checked);
                                                }}
                                            />
                                        }
                                        label="6 & 8 can touch"
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </>
                ) : (
                    <a
                        className="show-more"
                        onClick={() => {
                            setShowMore(true);
                        }}
                    >
                        Show more
                    </a>
                )}
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
