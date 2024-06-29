import styled from "styled-components";
import { FrequencyCounter } from "./FrequencyCounter";
import { HistogramOptions, HistogramOptionsFactory } from "./HistOptions";
import { Rect } from "../Rect";
import { HorizontalAxisLabel, VerticalAxisLabel } from "../axis";

export interface ICategoryLabelProps {
    histOptions: HistogramOptions;
    x: number;
    label: string;
}

function CategoryLabel({ histOptions, x, label }: ICategoryLabelProps) {
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
}

export interface IFrequencyLabelProps {
    histOptions: HistogramOptions;
    x: number;
    barHeight: number;
    label: string;
}

function FrequencyLabel({ histOptions, x, barHeight, label }: IFrequencyLabelProps) {
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
}

const CreateHistogram = (freq: FrequencyCounter, ho: HistogramOptions) => {
    const histElements: JSX.Element[] = [];
    const nrOfBars = freq.nrOfElements;
    const barWidth = (ho.width - ho.axisVerticalMargin - (nrOfBars + 1) * ho.barSpacing) / nrOfBars;
    const maxBarHeight =
        ho.height - ho.axisHorizontalMargin - ho.barCategoryFontHeight - ho.barFrequencyHeight;
    let barCounter = 0;

    for (const key in freq.frequencies) {
        const barHeight = (freq.frequencies[key] / freq.max) * maxBarHeight;
        const xOffset =
            ho.axisVerticalMargin + ho.barSpacing + barCounter * (barWidth + ho.barSpacing);
        const yOffset = ho.height - barHeight - ho.axisHorizontalMargin - ho.barCategoryFontHeight;

        histElements.push(
            <Rect
                x={xOffset}
                y={yOffset}
                width={barWidth}
                height={barHeight}
                key={key + "rect"}
            ></Rect>
        );
        histElements.push(
            <CategoryLabel
                histOptions={ho}
                x={xOffset + barWidth / 2}
                label={key}
                key={key + "cat"}
            />
        );
        if (freq.frequencies[key] != 0) {
            const label = freq.frequencies[key].toString();
            histElements.push(
                <FrequencyLabel
                    histOptions={ho}
                    x={xOffset + barWidth / 2}
                    barHeight={barHeight}
                    label={label}
                    key={key + "freqlabel"}
                />
            );
        }

        barCounter += 1;
    }
    return histElements;
};

export interface IHistogramProps {
    values: number[];
    histogramOptions?: HistogramOptions;
}

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
                <HorizontalAxisLabel histOptions={histogramOptions} label={"Dice"} key={"Dice"} />
                <VerticalAxisLabel
                    histOptions={histogramOptions}
                    label={"Frequency"}
                    key={"Frequency"}
                />
            </svg>
        </Border>
    );
}

const Border = styled.div`
    width: 100%;
    border: 1px solid black;
`;
