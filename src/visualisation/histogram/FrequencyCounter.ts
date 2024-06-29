export class FrequencyCounter {
    frequencies: { [k: string]: number } = {};
    max: number;
    nrOfElements: number;

    constructor(values: number[], pad: number[] = []) {
        for (const val of pad) {
            this.frequencies[val] = 0;
        }
        for (const val of values) {
            if (!(val in this.frequencies)) {
                this.frequencies[val] = 1;
            } else {
                this.frequencies[val] += 1;
            }
        }

        this.max = this.getMaxFrequency();
        this.nrOfElements = this.GetCount();
    }

    private getMaxFrequency(): number {
        let max = 0;
        for (const key in this.frequencies) {
            if (this.frequencies[key] > max) {
                max = this.frequencies[key];
            }
        }
        return max;
    }

    private GetCount(): number {
        return Object.keys(this.frequencies).length;
    }
}
