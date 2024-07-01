import * as React from "react";
import { Histogram } from "./visualisation/histogram/Histogram";
import styled from "styled-components";
import { useState } from "react";
import { NumberInputButtonGrid } from "./NumberInputButtonGrid";
import { Rolls } from "./Rolls";
import { Slider } from "@mui/material";

export interface IRunningDiceStatisTicsProps {}

export function RunningDiceStatisTics() {
    // const data = [
    //     10, 9, 10, 5, 5, 12, 4, 10, 3, 6, 8, 7, 4, 9, 9, 11, 3, 10, 8, 11, 6, 2, 9, 5, 6, 8, 7, 8,
    //     5, 9, 4, 7, 6, 7, 9, 10, 4, 9, 4, 7, 10, 3, 4, 11, 7, 8, 6, 9, 9, 6, 3, 5, 9, 6, 4, 8, 4,
    //     10, 9, 10, 7, 2, 7, 5, 7, 6, 8, 9, 5, 8, 4, 9, 11, 8, 6, 10,
    // ];
    const [data, setData] = useState<number[]>([]);
    const [sliderValue, setSliderValue] = useState<number[]>([1, 1]);

    const addNumber = (num: number) => {
        if (num === -1) {
            setData((prev) => [...prev.slice(0, -1)]);
        } else {
            setData((prev) => [...prev, num]);
        }
    };

    const handleChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue as number[]);
    };

    React.useEffect(() => {
        // let newMax = sliderValue[1];
        // if (sliderValue[1] === data.length - 1) {
        //     newMax = data.length;
        // }
        // setSliderValue((prev) => [prev[0], newMax]);
        setSliderValue((prev) =>
            sliderValue[1] >= data.length - 1 ? [prev[0], Math.max(1, data.length)] : prev
        );
    }, [data]);

    return (
        <RunningDiceContinaer>
            <SliderContainer>
                <p>
                    Dice distribution over rolls: {sliderValue[0]} to {sliderValue[1]}
                </p>
                <Slider
                    getAriaLabel={() => "Temperature range"}
                    value={sliderValue}
                    min={1}
                    max={data.length}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={(value: number) => value.toString()}
                    marks={[
                        { value: 1, label: 1 },
                        { value: sliderValue[0], label: sliderValue[0] },
                        { value: sliderValue[1], label: sliderValue[1] },
                        { value: data.length, label: data.length },
                    ]}
                />
            </SliderContainer>
            <VisualisationContainer>
                <Histogram values={data.slice(sliderValue[0] - 1, sliderValue[1])} />
            </VisualisationContainer>
            <Rolls data={data.slice(sliderValue[0] - 1, sliderValue[1])} />
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

const SliderContainer = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--light-gray);
`;

const VisualisationContainer = styled.div`
    width: 90%;
`;
