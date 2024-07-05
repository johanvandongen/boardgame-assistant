import { useTheme } from "@mui/material";

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
    const theme = useTheme();
    return (
        <svg key={x.toString() + y.toString()}>
            <rect
                width={width}
                height={height}
                x={x}
                y={y}
                fill={theme?.palette.primary.main}
            ></rect>
        </svg>
    );
}
