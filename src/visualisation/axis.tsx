import { useTheme } from "@mui/material";
import { VisOptions } from "./VisOptions";

export interface IHorizontalAxisLabelProps {
    histOptions: VisOptions;
    label: string;
}

/** Create horizontal axis label centered from the visualisation width */
export function HorizontalAxisLabel({ histOptions, label }: IHorizontalAxisLabelProps) {
    const theme = useTheme();
    return (
        <svg>
            <text
                x={histOptions.width / 2}
                y={histOptions.height}
                textAnchor="middle"
                fontSize={histOptions.axisFontSize}
                fill={theme?.palette.text.secondary}
            >
                {label}
            </text>
        </svg>
    );
}

export interface IVerticalAxisLabelProps {
    histOptions: VisOptions;
    label: string;
}

/** Create vertical axis label centered from the visualisation height */
export function VerticalAxisLabel({ histOptions, label }: IVerticalAxisLabelProps) {
    const theme = useTheme();
    return (
        <svg>
            <text
                x={0}
                y={histOptions.height / 2}
                textAnchor="middle"
                fontSize={histOptions.axisFontSize}
                fill={theme?.palette.text.secondary}
                transform={`translate(${-histOptions.height / 2 + histOptions.axisFontSize}, ${histOptions.height / 2}) rotate(270)`}
            >
                {label}
            </text>
        </svg>
    );
}
