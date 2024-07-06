import { Terrain, Tile } from "../../CatanBoard";
import { CatanRandomizer } from "../CatanRandomizer";

export class RandomTerrain extends CatanRandomizer {
    randomize(tiles: Tile[][], robberIndex: number[]): [Tile[][], boolean] {
        const tokens: Terrain[] = this.getTerrain();
        const newTiles: Tile[][] = [];
        for (let row = 0; row < tiles.length; row++) {
            const tileRow: Tile[] = [];
            for (let col = 0; col < tiles[row].length; col++) {
                if (row === robberIndex[0] && col === robberIndex[1]) {
                    tiles[row][col].token = 0;
                    tileRow.push(tiles[row][col].copyWithTerrain(Terrain.DESSERT));
                } else {
                    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
                    const index = tokens.indexOf(randomToken);
                    tokens.splice(index, 1);
                    tileRow.push(tiles[row][col].copyWithTerrain(randomToken));
                }
            }
            newTiles.push(tileRow);
        }
        return [newTiles, true];
    }
}
