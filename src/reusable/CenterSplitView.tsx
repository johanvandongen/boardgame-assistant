import { styled } from "@mui/material";
import * as React from "react";

export interface ICenterSplitViewProps {
    left: JSX.Element;
    right: JSX.Element;
}

export function CenterSplitView({ left, right }: ICenterSplitViewProps) {
    return (
        <Container>
            <LeftContainer>{left}</LeftContainer>
            <RightContainer>{right}</RightContainer>
        </Container>
    );
}

const LeftContainer = styled("div")(() => ({
    // width: "50%",
    display: "flex",
    justifyContent: "flex-end",
}));
const RightContainer = styled("div")(() => ({
    // width: "100%",
}));

const Container = styled("div")(({ theme }) => ({
    display: "grid",
    width: "100%",
    padding: "1rem",
    [theme.breakpoints.up("sm")]: {
        gridTemplateColumns: "1fr 1fr",
        gap: "5rem",
    },
}));
