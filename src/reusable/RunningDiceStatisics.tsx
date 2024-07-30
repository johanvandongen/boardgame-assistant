import * as React from "react";
import { useState } from "react";
import { NumberInputButtonGrid } from "./NumberInputButtonGrid";
import { Rolls } from "./Rolls";
import { Slider, styled, useTheme } from "@mui/material";
import { Histogram } from "../visualisation/histogram/Histogram";
import { getHistogramData, getHistorgramSliderData } from "./HistogramData";

export interface IRunningDiceStatisTicsProps {}

/** Shows the dice distribution statistics, with slider, visualisation and number input. */
export function RunningDiceStatisTics() {
    const theme = useTheme();
    const [data, setData] = useState<number[]>(getHistogramData);
    const [sliderValue, setSliderValue] = useState<number[]>(getHistorgramSliderData(data));

    const addNumber = (num: number) => {
        if (num === -1) {
            setData((prev) => [...prev.slice(0, -1)]);
        } else {
            setData((prev) => [...prev, num]);
        }
    };

    const clear = () => {
        setData([]);
    };

    const handleChange = (_event: Event, newValue: number | number[]) => {
        setSliderValue(newValue as number[]);
    };

    React.useEffect(() => {
        setSliderValue((prev) =>
            prev[1] >= data.length - 1 ? [prev[0], Math.max(1, data.length)] : prev
        );
    }, [data]);

    React.useEffect(() => {
        localStorage.setItem("histogramData", JSON.stringify(data));
    }, [data]);

    React.useEffect(() => {
        localStorage.setItem("histogramSliderData", JSON.stringify(sliderValue));
    }, [sliderValue]);

    return (
        <RunningDiceContinaer>
            <SliderContainer sx={{ color: theme.palette.text.secondary }}>
                <p>
                    Dice distribution over rolls:{" "}
                    {data.length === 0 ? "0 to 0" : sliderValue[0] + " to " + sliderValue[1]}
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
            <NumberInputButtonGrid addNumber={addNumber} clear={clear} />
        </RunningDiceContinaer>
    );
}

const RunningDiceContinaer = styled("div")(() => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
}));

const SliderContainer = styled("div")(() => ({
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

const VisualisationContainer = styled("div")(({ theme }) => ({
    width: "90%",
    [theme.breakpoints.up("sm")]: {
        width: "100dvh",
    },
}));
