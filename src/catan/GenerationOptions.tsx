import * as React from "react";
import {
    Checkbox,
    Collapse,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    SelectChangeEvent,
    Slider,
    TextField,
    Typography,
} from "@mui/material";
import { CatanBoardTiles } from "./CatanBoard";

export interface IGenerationOptionsProps {
    c: CatanBoardTiles;
    refresh: () => void;
}
const minDistance = 5;
function valuetext(value: number) {
    return `${value}°C`;
}
export function GenerationOptions({ c, refresh }: IGenerationOptionsProps) {
    const [terrainTouch, setTerrainTouch] = React.useState(false);
    const [redNumberTouch, setRedNumberTouch] = React.useState(false);
    const [pipRange, setPipRange] = React.useState<number[]>([8, 14]);
    const [showExactRobberPlace, setShowExactRobberPlace] = React.useState(false);
    const [correctExactRobberPlace, setCorrectExactRobberPlace] = React.useState(true);
    const [robberPlace, setRobberPlace] = React.useState<string>("Inner");
    const [exactRobberPlace, setExactRobberPlace] = React.useState<number>(33);
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
        } else if (event.target.value === "Exact") {
            setRobberPlace(event.target.value);
            setShowExactRobberPlace(true);
            return;
        }
        c.Randomize();
        setShowExactRobberPlace(false);
        setRobberPlace(event.target.value);
        refresh();
    };

    const handleChange1 = (_event: Event, newValue: number | number[], activeThumb: number) => {
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

    return (
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
                        <Typography sx={{ p: 1 }}>Point of Production</Typography>
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
                <div>
                    <FormControl fullWidth variant="filled">
                        <InputLabel id="demo-simple-select-label">Robber spawn place</InputLabel>
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
                            <MenuItem value={"Exact"}>Exact</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <Collapse in={showExactRobberPlace}>
                    <TextField
                        error={!correctExactRobberPlace}
                        id="outlined-number"
                        label="Robber spawn place (exact)"
                        type="number"
                        variant="filled"
                        helperText={correctExactRobberPlace ? "" : "out of bounds, use (row,col)"}
                        value={exactRobberPlace}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setExactRobberPlace(parseInt(event.target.value));
                            const row = parseInt(event.target.value[0]) - 1;
                            const col = parseInt(event.target.value[1]) - 1;
                            console.log(row, col);
                            if (
                                row >= 0 &&
                                row < c.tiles.length &&
                                col >= 0 &&
                                col < c.tiles[row].length
                            ) {
                                setCorrectExactRobberPlace(true);
                                c.setRobberPlace([[row, col]]);
                                c.Randomize();
                                refresh();
                            } else {
                                setCorrectExactRobberPlace(false);
                            }
                        }}
                    />
                </Collapse>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={terrainTouch}
                            onChange={(e) =>
                                setTerrainTouch(() => {
                                    if (e.target.checked === true) {
                                        c.terrainRandomizer.setMatchingTerrain(2);
                                    } else {
                                        c.terrainRandomizer.setMatchingTerrain(0);
                                    }
                                    c.RandomizeTerrain();
                                    refresh();
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
                                c.numberRandomizer.setMatchingRedNumbersAllowed(e.target.checked);
                                setRedNumberTouch(e.target.checked);
                            }}
                        />
                    }
                    label="6 & 8 can touch"
                />
            </FormGroup>
        </div>
    );
}
