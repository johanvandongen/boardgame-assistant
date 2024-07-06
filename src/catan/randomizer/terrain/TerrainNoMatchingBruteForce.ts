import { Tile } from "../../CatanBoard";
import { CatanRandomizer } from "../CatanRandomizer";
import { RandomTerrain } from "./RandomTerrain";

export class TerrainNoMatchingBruteForce extends CatanRandomizer {
    // Brute force
    randomize(tiles: Tile[][], robberIndex: number[]): [Tile[][], boolean] {
        let k = 1;
        const randomizer = new RandomTerrain(this.intersections);
        let newTiles = randomizer.randomize(tiles, robberIndex);
        while (k < 1000) {
            if (this.numberOfTerrainMatches(tiles) > this.matchingTerrain) {
                return newTiles;
            }
            newTiles = randomizer.randomize(tiles, robberIndex);
            k += 1;
        }
        return [newTiles[0], false];
    }
}
