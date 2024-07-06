import { Tile, TilePosition } from "../../CatanBoard";
import { CatanRandomizer } from "../CatanRandomizer";
import { shuffle } from "../../../utils/Shuffle";
import { RandomNumbers } from "./RandomNumberRandomizer";

export class NumberBacktrack extends CatanRandomizer {
    solve(
        tiles: Tile[][],
        robberIndex: number[],
        numbersAvailable: number[],
        t: number
    ): Tile[][][] {
        const result: Tile[][][] = [];
        if (t === this.backTrackOrder.length) {
            return [tiles];
        }

        const pos: TilePosition = this.backTrackOrder[t];
        if (pos.row === robberIndex[0] && pos.col === robberIndex[1]) {
            tiles[pos.row][pos.col].token = 0;
            const ti: Tile[][][] = this.solve(tiles, robberIndex, numbersAvailable, t + 1);
            result.push(...ti);
            return result;
        }

        const l = shuffle(numbersAvailable);

        for (const token of l) {
            tiles[pos.row][pos.col].token = token;
            if (!this.pipListWithingRange(this.getPipList(tiles))) {
                tiles[pos.row][pos.col].token = 0;
                continue;
            }
            const index = numbersAvailable.indexOf(token);
            numbersAvailable.splice(index, 1);
            const ti: Tile[][][] = this.solve(tiles, robberIndex, numbersAvailable, t + 1);
            result.push(...ti);
            if (result.length > 0) {
                return result;
            }
            numbersAvailable.push(token);
            tiles[pos.row][pos.col].token = 0;
        }
        return result;
    }

    // Back track
    randomize(tiles: Tile[][], robberIndex: number[]): [Tile[][], boolean] {
        const b = new RandomNumbers(this.intersections).randomize(tiles, robberIndex);
        const newTiles: Tile[][] = [];
        const numbersAvailable = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

        // Reset whole board with -1 tokens
        for (let row = 0; row < tiles.length; row++) {
            const tileRow: Tile[] = [];
            for (let col = 0; col < tiles[row].length; col++) {
                tileRow.push(tiles[row][col].copyWithToken(0));
            }
            newTiles.push(tileRow);
        }
        const res = this.solve(newTiles, robberIndex, numbersAvailable, 0);

        console.log(res.length);
        return res.length > 0 ? [res[0], true] : [b[0], false];
    }
}
