import { Intersection, Terrain, Tile, TilePosition } from "../CatanBoard";

export abstract class CatanRandomizer {
    intersections: Intersection[];
    abstract randomize(tiles: Tile[][], robberIndex: number[]): Tile[][];
    constructor(intersections: Intersection[]) {
        this.intersections = intersections;
    }

    // List of tilepositions. When following this, we form intersections quickly.
    // This way the backtracking algorithm works faster, because branches are pruned early.
    backTrackOrder: TilePosition[] = [
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 1, col: 0 },
        { row: 3, col: 0 },
        { row: 1, col: 1 },
        { row: 3, col: 1 },
        { row: 2, col: 2 },
        { row: 1, col: 2 },
        { row: 3, col: 2 },
        { row: 2, col: 3 },
        { row: 1, col: 3 },
        { row: 3, col: 3 },
        { row: 2, col: 4 },
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 4, col: 0 },
        { row: 4, col: 1 },
        { row: 4, col: 2 },
    ];
    hasDuplicateTerrain(tiles: Tile[][], threshold = 0) {
        let cnt = 0;
        for (const intersection of this.intersections) {
            const seenTerrain: Terrain[] = [];
            for (const pos of intersection.positions) {
                const t = tiles[pos.row][pos.col].terrain;
                if (t !== Terrain.DESSERT && seenTerrain.includes(t)) {
                    cnt += 1;
                    break;
                }
                seenTerrain.push(t);
            }
        }
        return cnt <= threshold;
    }
    getTerrain(): Terrain[] {
        return [
            Terrain.BRICK,
            Terrain.BRICK,
            Terrain.BRICK,
            Terrain.LUMBER,
            Terrain.LUMBER,
            Terrain.LUMBER,
            Terrain.LUMBER,
            Terrain.ORE,
            Terrain.ORE,
            Terrain.ORE,
            Terrain.GRAIN,
            Terrain.GRAIN,
            Terrain.GRAIN,
            Terrain.GRAIN,
            Terrain.WOOL,
            Terrain.WOOL,
            Terrain.WOOL,
            Terrain.WOOL,
        ];
    }
}
