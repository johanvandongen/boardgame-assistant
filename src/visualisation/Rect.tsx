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
