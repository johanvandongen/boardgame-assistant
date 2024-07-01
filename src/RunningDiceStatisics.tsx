import * as React from "react";
import { Histogram } from "./visualisation/histogram/Histogram";
import styled from "styled-components";
import { useState } from "react";
import { NumberInputButtonGrid } from "./NumberInputButtonGrid";
import { Rolls } from "./Rolls";

export interface IRunningDiceStatisTicsProps {}

export function RunningDiceStatisTics() {
    // const data = [
    //     10, 9, 10, 5, 5, 12, 4, 10, 3, 6, 8, 7, 4, 9, 9, 11, 3, 10, 8, 11, 6, 2, 9, 5, 6, 8, 7, 8,
    //     5, 9, 4, 7, 6, 7, 9, 10, 4, 9, 4, 7, 10, 3, 4, 11, 7, 8, 6, 9, 9, 6, 3, 5, 9, 6, 4, 8, 4,
    //     10, 9, 10, 7, 2, 7, 5, 7, 6, 8, 9, 5, 8, 4, 9, 11, 8, 6, 10,
    // ];
    const [data, setData] = useState<number[]>([]);

    const addNumber = (num: number) => {
        if (num === -1) {
            setData((prev) => [...prev.slice(0, -1)]);
        } else {
            setData((prev) => [...prev, num]);
        }
    };

    return (
        <RunningDiceContinaer>
            <div>slider</div>
            <VisualisationContainer>
                <Histogram values={data} />
            </VisualisationContainer>
            <Rolls data={data} />
            <NumberInputButtonGrid addNumber={addNumber} />
        </RunningDiceContinaer>
    );
}
const RunningDiceContinaer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 2rem;
`;

const VisualisationContainer = styled.div`
    /* border: 1px solid green; */
    width: 100%;
    /* height: 100vh; */
`;
