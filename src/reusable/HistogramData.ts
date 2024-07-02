const defaultExampleData = [
    10, 9, 10, 5, 5, 12, 4, 10, 3, 6, 8, 7, 4, 9, 9, 11, 3, 10, 8, 11, 6, 2, 9, 5, 6, 8, 7, 8, 5, 9,
    4, 7, 6, 7, 9, 10, 4, 9, 4, 7, 10, 3, 4, 11, 7, 8, 6, 9, 9, 6, 3, 5, 9, 6, 4, 8, 4, 10, 9, 10,
    7, 2, 7, 5, 7, 6, 8, 9, 5, 8, 4, 9, 11, 8, 6, 10,
];

/** Get data from localstorage */
export const getHistogramData = () => {
    const d = localStorage.getItem("histogramData");
    if (d === null) {
        return defaultExampleData;
    }
    const stored: number[] = JSON.parse(d);
    return stored;
};

/** Get data from localstorage */
export const getHistorgramSliderData = (data: number[]) => {
    const d = localStorage.getItem("histogramSliderData");
    if (d === null) {
        return [1, Math.max(1, data.length)];
    }
    const stored: number[] = JSON.parse(d);
    return stored;
};
