import { Terrain, Tile, TilePosition } from "../../CatanBoard";
import { CatanRandomizer } from "../CatanRandomizer";
import { shuffle } from "../../../utils/Shuffle";
import { RandomTerrain } from "./RandomTerrain";

export class TerrainNoDuplicateBackTrack extends CatanRandomizer {
    solve(
        tiles: Tile[][],
        robberIndex: number[],
        tileAvailable: Map<Terrain, { val: number }>,
        t: number
    ): Tile[][][] {
        const result: Tile[][][] = [];
        if (t === this.backTrackOrder.length) {
            return [tiles];
        }

        const pos: TilePosition = this.backTrackOrder[t];
        if (pos.row === robberIndex[0] && pos.col === robberIndex[1]) {
            tiles[pos.row][pos.col].terrain = Terrain.DESSERT;
            const ti: Tile[][][] = this.solve(tiles, robberIndex, tileAvailable, t + 1);
            result.push(...ti);
            return result;
        }

        const l = shuffle([
            Terrain.BRICK,
            Terrain.ORE,
            Terrain.WOOL,
            Terrain.LUMBER,
            Terrain.GRAIN,
        ]);

        for (const tile of l) {
            const cnt = tileAvailable.get(tile);
            if (cnt === undefined || cnt.val <= 0) {
                continue;
            }
            tiles[pos.row][pos.col].terrain = tile;
            if (this.numberOfTerrainMatches(tiles) > this.matchingTerrain) {
                tiles[pos.row][pos.col].terrain = Terrain.DESSERT;
                continue;
            }
            tileAvailable.set(tile, { val: cnt.val - 1 });
            const ti: Tile[][][] = this.solve(tiles, robberIndex, tileAvailable, t + 1);
            result.push(...ti);
            if (result.length > 0) {
                return result;
            }
            tileAvailable.set(tile, { val: cnt.val + 1 });
            tiles[pos.row][pos.col].terrain = Terrain.DESSERT;
        }
        return result;
    }

    // Back track
    randomize(tiles: Tile[][], robberIndex: number[]): Tile[][] {
        const b = new RandomTerrain(this.intersections).randomize(tiles, robberIndex);
        const tileAvailable = new Map<Terrain, { val: number }>();
        tileAvailable.set(Terrain.BRICK, { val: 3 });
        tileAvailable.set(Terrain.ORE, { val: 3 });
        tileAvailable.set(Terrain.LUMBER, { val: 4 });
        tileAvailable.set(Terrain.WOOL, { val: 4 });
        tileAvailable.set(Terrain.GRAIN, { val: 4 });
        const newTiles: Tile[][] = [];
        for (let row = 0; row < tiles.length; row++) {
            const tileRow: Tile[] = [];
            for (let col = 0; col < tiles[row].length; col++) {
                tileRow.push(tiles[row][col].copyWithTerrain(Terrain.DESSERT));
            }
            newTiles.push(tileRow);
        }
        const res = this.solve(newTiles, robberIndex, tileAvailable, 0);
        return res.length > 0 ? res[0] : b;
    }
}
