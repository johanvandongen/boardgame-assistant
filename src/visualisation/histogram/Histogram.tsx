import styled from "styled-components";
// import { HistogramOptions, VisOptionsFactory } from "../VisOptions";
import { FrequencyCounter } from "./FrequencyCounter";
import { HistogramOptions, HistogramOptionsFactory } from "./HistOptions";

export interface IHistogramProps {
    values: number[];
    histogramOptions?: HistogramOptions;
}

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
        <svg key={x.toString() + y.toString()}>
            <rect width={width} height={height} x={x} y={y} fill="#418cf0"></rect>
        </svg>
    );
}

const CreateHorizontalAxis = (histOptions: HistogramOptions, label: string) => {
    return (
        <svg key={label}>
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
        <svg key={label}>
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
        <svg key={label}>
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
        <svg key={label + x.toString()}>
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

const CreateHistogram = (freq: FrequencyCounter, histOptions: HistogramOptions) => {
    const histElements: JSX.Element[] = [];
    const nrOfBars = freq.nrOfElements;
    const spacing = histOptions.barSpacing;
    const barWidth =
        (histOptions.width - histOptions.axisVerticalMargin - (nrOfBars + 1) * spacing) / nrOfBars;
    const maxBarHeight =
        histOptions.height -
        histOptions.axisHorizontalMargin -
        histOptions.barCategoryFontHeight -
        histOptions.barFrequencyHeight;
    let barCounter = 0;
    for (const key in freq.frequencies) {
        const barHeight = (freq.frequencies[key] / freq.max) * maxBarHeight;
        const xOffset =
            histOptions.axisVerticalMargin + spacing + barCounter * (barWidth + spacing);
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
                key={key + freq.frequencies[key].toString() + "rect"}
            ></Rect>
        );
        histElements.push(CreateCategoryLabel(histOptions, xOffset + barWidth / 2, key));

        if (freq.frequencies[key] != 0) {
            histElements.push(
                CreateFrequencyLabel(
                    histOptions,
                    xOffset + barWidth / 2,
                    barHeight,
                    freq.frequencies[key].toString()
                )
            );
        }
        barCounter += 1;
    }
    histElements.push(CreateHorizontalAxis(histOptions, "Dice"));
    histElements.push(CreateVerticalAxis(histOptions, "Frequency"));
    return histElements;
};

export function Histogram({ values, histogramOptions }: IHistogramProps) {
    const freq = new FrequencyCounter(
        values,
        [...Array(11).keys()].map((x) => (x += 2))
    );
    if (histogramOptions === undefined) {
        histogramOptions = new HistogramOptionsFactory().Default();
    }
    const histogram = CreateHistogram(freq, histogramOptions);

    return (
        <Border>
            <svg viewBox={`0 0 ${histogramOptions.width} ${histogramOptions.height}`}>
                {histogram}
            </svg>
        </Border>
    );
}

const Border = styled.div`
    width: 100%;
    border: 1px solid black;
`;
