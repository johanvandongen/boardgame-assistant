import { Tile } from "../CatanBoard";
import { CatanRandomizer } from "./CatanRandomizer";

export class RandomNumbers extends CatanRandomizer {
    randomize(tiles: Tile[][], robberIndex: number[]): Tile[][] {
        const tokens = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
        const newtiles: Tile[][] = [];
        for (let row = 0; row < tiles.length; row++) {
            const tileRow: Tile[] = [];
            for (let col = 0; col < tiles[row].length; col++) {
                if (row === robberIndex[0] && col === robberIndex[1]) {
                    tileRow.push(tiles[row][col].copyWithToken(0));
                } else {
                    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
                    const index = tokens.indexOf(randomToken);
                    tokens.splice(index, 1);
                    tileRow.push(tiles[row][col].copyWithToken(randomToken));
                }
            }
            newtiles.push(tileRow);
        }
        return newtiles;
    }
}
