import { Intersection, Terrain, Tile, TilePosition } from "../CatanBoard";

export abstract class CatanRandomizer {
    intersections: Intersection[];

    // Hyperparameters;
    matchingTerrain: number = 0;
    matchingNumbers: number = 0;
    matchingRedNumbersAllowed: boolean = false;
    pipRange: number[];

    abstract randomize(tiles: Tile[][], robberIndex: number[]): [Tile[][], boolean]; // [Result, succes]
    constructor(
        intersections: Intersection[],
        matchingTerrain: number = 0,
        matchingRedNumbersAllowed: boolean = false,
        pipRange: number[] = [4, 15]
    ) {
        this.intersections = intersections;
        this.matchingTerrain = matchingTerrain;
        this.matchingRedNumbersAllowed = matchingRedNumbersAllowed;
        this.pipRange = pipRange;
    }

    public setMatchingTerrain(value: number) {
        this.matchingTerrain = value;
    }

    public setPipRange(pipRange: number[]) {
        this.pipRange = pipRange;
    }

    public setMatchingRedNumbersAllowed(matchingRedNumbersAllowed: boolean) {
        this.matchingRedNumbersAllowed = matchingRedNumbersAllowed;
    }

    private calculateIntersectionPip(intersection: Intersection, tiles: Tile[][]) {
        const pipConversion = new Map<number, number>([
            [2, 1],
            [12, 1],
            [3, 2],
            [11, 2],
            [4, 3],
            [10, 3],
            [5, 4],
            [9, 4],
            [6, 5],
            [8, 5],
            [7, 6],
        ]);
        let result = 0;
        for (const pos of intersection.positions) {
            const num: number = tiles[pos.row][pos.col].token;
            if (num === 0) {
                return 0;
            }
            const pip = pipConversion.get(num);
            result += pip === undefined ? 0 : pip;
        }
        return result;
    }

    protected getPipList(tiles: Tile[][]) {
        const result = [];
        for (const intersection of this.intersections) {
            result.push(this.calculateIntersectionPip(intersection, tiles));
        }
        return result;
    }

    protected redNumbersTouching(tiles: Tile[][]): boolean {
        for (const intersection of this.intersections) {
            let redNumberCount = 0;
            for (const pos of intersection.positions) {
                if (tiles[pos.row][pos.col].token === 6 || tiles[pos.row][pos.col].token === 8) {
                    redNumberCount += 1;
                }
            }
            if (redNumberCount >= 2) {
                return true;
            }
        }
        return false;
    }

    protected pipListWithingRange(piplist: number[]): boolean {
        for (const pip of piplist) {
            if (pip === 0) {
                continue;
            }
            if (pip < this.pipRange[0] || pip > this.pipRange[1]) {
                return false;
            }
        }
        return true;
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

    numberOfTerrainMatches(tiles: Tile[][]): number {
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
        return cnt;
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
