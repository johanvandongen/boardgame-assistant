export interface VisOptions {
    width: number;
    height: number;
    leftMargin: number;
    rightMargin: number;
    topMargin: number;
    bottomMargin: number;
    axisHorizontalMargin: number;
    axisVerticalMargin: number;
    axisFontSize: number;
}

export interface HistogramOptions extends VisOptions {
    barSpacing: number;
    barCategoryFontSize: number;
    barCategoryFontHeight: number;
    barFrequencyFontSize: number;
    barFrequencyHeight: number;
}
