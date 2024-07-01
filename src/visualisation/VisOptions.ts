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

export class VisOptionsFactory {
    Default(): VisOptions {
        return {
            width: 600,
            height: 250,
            axisHorizontalMargin: 15,
            axisVerticalMargin: 15,
            leftMargin: 0,
            rightMargin: 0,
            topMargin: 0,
            bottomMargin: 0,
            axisFontSize: 15,
        };
    }
}
