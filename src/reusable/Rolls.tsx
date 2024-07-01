import { styled, useTheme } from "@mui/material";

export interface IRolls {
    data: number[];
}

/** Shows the last few numbers from a sequence and the number of rolls. */
export function Rolls({ data }: IRolls) {
    const theme = useTheme();
    const sequenceLength = 6;
    const nrOfRolls = data.length === 1 ? `${data.length} roll` : `${data.length} rolls`;

    let txt = "";
    if (data.length === 0) {
        txt = nrOfRolls;
    } else if (data.length > sequenceLength) {
        txt = nrOfRolls + " - ...," + data.slice(-sequenceLength).map((roll) => roll);
    } else {
        txt = nrOfRolls + " - " + data.slice(-sequenceLength).map((roll) => roll);
    }

    return <Container sx={{ color: theme.palette.text.secondary }}>{txt}</Container>;
}

const Container = styled("div")(() => ({
    whiteSpace: "nowrap",
    fontSize: "1.5rem",
}));
