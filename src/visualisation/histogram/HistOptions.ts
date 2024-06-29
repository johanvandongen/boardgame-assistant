import { VisOptions, VisOptionsFactory } from "../VisOptions";

export interface HistogramOptions extends VisOptions {
    barSpacing: number;
    barCategoryFontSize: number;
    barCategoryFontHeight: number;
    barFrequencyFontSize: number;
    barFrequencyHeight: number;
}

export class HistogramOptionsFactory {
    Default(): HistogramOptions {
        return {
            ...new VisOptionsFactory().Default(),
            barSpacing: 2,
            barCategoryFontSize: 10,
            barFrequencyFontSize: 10,
            barCategoryFontHeight: 10,
            barFrequencyHeight: 10,
        };
    }
}
