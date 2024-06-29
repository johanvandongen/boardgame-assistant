import * as React from "react";
import styled from "styled-components";
import { HistogramOptions } from "../VisOptions";

export interface IHistogramProps {
    values: number[];
}

const GetFrequencyCount = (values: number[]) => {
    const d: { [k: string]: number } = {};
    for (const val of values) {
        if (!(val in d)) {
            d[val] = 1;
        } else {
            d[val] += 1;
        }
    }
    return d;
};

// const Circle = () => {
//     return (
//         <svg viewBox="0 0 100 50">
//             <circle cx="10" cy="10" r="10" />
//         </svg>
//     );
// };

export function Rect({
    x,
    y,
    width,
    height,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
}) {
    return (
        <svg>
            <rect width={width} height={height} x={x} y={y} fill="#418cf0"></rect>
        </svg>
    );
}

const CreateHorizontalAxis = (histOptions: HistogramOptions, label: string) => {
    return (
        <svg>
            <text
                x={histOptions.width / 2}
                y={histOptions.height}
                textAnchor="middle"
                fontSize={histOptions.axisFontSize}
            >
                {label}
            </text>
        </svg>
    );
};
const CreateVerticalAxis = (histOptions: HistogramOptions, label: string) => {
    return (
        <svg>
            <text
                x={0}
                y={histOptions.height / 2}
                textAnchor="middle"
                fontSize={histOptions.axisFontSize}
                transform={`translate(${-histOptions.height / 2 + histOptions.axisFontSize}, ${histOptions.height / 2}) rotate(270)`}
            >
                {label}
            </text>
        </svg>
    );
};

const CreateCategoryLabel = (histOptions: HistogramOptions, x: number, label: string) => {
    return (
        <svg>
            <text
                x={x}
                y={histOptions.height - histOptions.axisHorizontalMargin}
                textAnchor="middle"
                // dominantBaseline="middle"
                fontSize={histOptions.barCategoryFontSize}
            >
                {label}
            </text>
        </svg>
    );
};

const CreateFrequencyLabel = (
    histOptions: HistogramOptions,
    x: number,
    barHeight: number,
    label: string
) => {
    return (
        <svg>
            <text
                x={x}
                y={
                    histOptions.height -
                    barHeight -
                    1 -
                    histOptions.axisHorizontalMargin -
                    histOptions.barCategoryFontHeight
                }
                textAnchor="middle"
                fontSize={histOptions.barFrequencyFontSize}
            >
                {label}
            </text>
        </svg>
    );
};

const CreateHistogram = (freq: { [k: string]: number }, histOptions: HistogramOptions) => {
    const histElements: JSX.Element[] = [];
    const nrOfBars = 11;
    const spacing = histOptions.barSpacing;
    const barWidth =
        (histOptions.width - histOptions.axisVerticalMargin - (nrOfBars + 1) * spacing) / nrOfBars;
    const maxBarHeight =
        histOptions.height -
        histOptions.axisHorizontalMargin -
        histOptions.barCategoryFontHeight -
        histOptions.barFrequencyHeight;
    for (const key in freq) {
        console.log(freq[key]);
        const barHeight = (freq[key] / 13) * maxBarHeight;
        const xOffset =
            histOptions.axisVerticalMargin + spacing + (parseInt(key) - 2) * (barWidth + spacing);
        histElements.push(
            <Rect
                x={xOffset}
                y={
                    histOptions.height -
                    barHeight -
                    histOptions.axisHorizontalMargin -
                    histOptions.barCategoryFontHeight
                }
                width={barWidth}
                height={barHeight}
            ></Rect>
        );
        histElements.push(CreateCategoryLabel(histOptions, xOffset + barWidth / 2, key));
        histElements.push(
            CreateFrequencyLabel(
                histOptions,
                xOffset + barWidth / 2,
                barHeight,
                freq[key].toString()
            )
        );
    }
    histElements.push(CreateHorizontalAxis(histOptions, "Dice"));
    histElements.push(CreateVerticalAxis(histOptions, "Frequency"));
    return histElements;
};

export function Histogram({ values }: IHistogramProps) {
    const freq: { [k: string]: number } = GetFrequencyCount(values);
    console.log(freq);
    console.log(freq.array);
    const width = 600;
    const height = 200;
    const histogramOptions: HistogramOptions = {
        width: 600,
        height: 200,
        barSpacing: 2,
        axisHorizontalMargin: 15,
        axisVerticalMargin: 10,
        leftMargin: 0,
        rightMargin: 0,
        topMargin: 0,
        bottomMargin: 0,
        barCategoryFontSize: 10,
        barFrequencyFontSize: 10,
        axisFontSize: 10,
        barCategoryFontHeight: 10,
        barFrequencyHeight: 10,
    };
    const bars = CreateHistogram(freq, histogramOptions);

    return (
        <Border>
            <svg viewBox={`0 0 ${width} ${height}`}>{bars}</svg>
        </Border>
    );
}

const Border = styled.div`
    width: 100%;
    border: 1px solid black;
`;
