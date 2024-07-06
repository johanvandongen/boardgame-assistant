import { Tile } from "../../CatanBoard";
import { CatanRandomizer } from "../CatanRandomizer";
import { RandomNumbers } from "./RandomNumberRandomizer";

export class NumberBruteForce extends CatanRandomizer {
    randomize(tiles: Tile[][], robberIndex: number[]): [Tile[][], boolean] {
        let k = 0;
        const randomizer = new RandomNumbers(this.intersections);
        let newTiles = randomizer.randomize(tiles, robberIndex);
        while (k < 1000) {
            k += 1;
            newTiles = randomizer.randomize(tiles, robberIndex);
            if (this.redNumbersTouching(newTiles[0]) && !this.matchingRedNumbersAllowed) {
                continue;
            }
            if (!this.pipListWithingRange(this.getPipList(newTiles[0]))) {
                continue;
            }
            console.log("solution", k, this.getPipList(newTiles[0]));
            return newTiles;
        }
        return [newTiles[0], false];
    }
}
