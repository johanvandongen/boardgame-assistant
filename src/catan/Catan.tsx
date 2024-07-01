import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { EmptyPage } from "../EmptyPage";
import { RunningDiceStatisTics } from "../reusable/RunningDiceStatisics";

export default function TabsWrappedLabel() {
    const [tab, setTab] = useState("DiceDistribution");

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    return (
        <CatanContainer>
            <Box sx={{ width: "100%" }}>
                <Tabs value={tab} onChange={handleChange} aria-label="wrapped label tabs example">
                    <Tab value="BoardGenerator" label="Board Generator" />
                    <Tab value="DiceDistribution" label="Dice Distribution" />
                </Tabs>
            </Box>
            {tab === "BoardGenerator" && <EmptyPage />}
            {tab === "DiceDistribution" && <RunningDiceStatisTics />}
        </CatanContainer>
    );
}

const CatanContainer = styled("div")(() => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
}));
