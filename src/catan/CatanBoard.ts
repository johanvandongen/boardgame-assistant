import { getRandomItem } from "../utils/Shuffle";
import { CatanRandomizer } from "./randomizer/CatanRandomizer";
import { NumberBacktrack } from "./randomizer/numbers/NumberBacktrack";
import { NumberBruteForce } from "./randomizer/numbers/NumberBruteForce";
import { RandomNumbers } from "./randomizer/numbers/RandomNumberRandomizer";
import { RandomTerrain } from "./randomizer/terrain/RandomTerrain";
import { TerrainNoDuplicateBackTrack } from "./randomizer/terrain/TerrainNoMatchingBackTrack";

export class CatanBoardTiles {
    tiles: Tile[][] = [];
    allowedRobberPlaces: number[][] = [[2, 2]];
    robberIndex: number[] = this.allowedRobberPlaces[0];
    numberRandomizer: CatanRandomizer;
    terrainRandomizer: CatanRandomizer;
    intersections: Intersection[] = [];
    constructor(tileSize: number) {
        this.tiles.push(
            [
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
            ],
            [
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
            ],
            [
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
            ],
            [
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
            ],
            [
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
                new Tile(0, Terrain.DESSERT, tileSize),
            ]
        );
        this.SetIntersections();
        this.numberRandomizer = new NumberBruteForce(this.intersections);
        this.terrainRandomizer = new TerrainNoDuplicateBackTrack(this.intersections);
        this.tiles = this.terrainRandomizer.randomize(this.tiles, this.robberIndex)[0];
        this.tiles = this.numberRandomizer.randomize(this.tiles, this.robberIndex)[0];
    }

    public setRobberPlace(allowedRobberPlaces: number[][]) {
        this.allowedRobberPlaces = allowedRobberPlaces;
    }

    private SetIntersections() {
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < this.tiles[row].length; col++) {
                this.intersections.push(
                    new Intersection([
                        { row: row, col: col },
                        { row: row + 1, col: col },
                        { row: row + 1, col: col + 1 },
                    ])
                );
                if (col + 1 < this.tiles[row].length) {
                    this.intersections.push(
                        new Intersection([
                            { row: row, col: col },
                            { row: row, col: col + 1 },
                            { row: row + 1, col: col + 1 },
                        ])
                    );
                    this.intersections.push(
                        new Intersection([
                            { row: 4 - row, col: col },
                            { row: 4 - row, col: col + 1 },
                            { row: 4 - row - 1, col: col + 1 },
                        ])
                    );
                }
                this.intersections.push(
                    new Intersection([
                        { row: 4 - row, col: col },
                        { row: 4 - row - 1, col: col },
                        { row: 4 - row - 1, col: col + 1 },
                    ])
                );
            }
        }
    }

    SetNumberRandomizer(choice: number) {
        switch (choice) {
            case 1:
                this.numberRandomizer = new RandomNumbers(this.intersections);
                break;
        }
    }

    SetTerrainRandomizer(choice: number) {
        switch (choice) {
            case 1:
                this.terrainRandomizer = new RandomTerrain(this.intersections);
                break;
            case 2:
                this.terrainRandomizer = new TerrainNoDuplicateBackTrack(this.intersections);
        }
    }

    Randomize(): boolean {
        this.robberIndex = getRandomItem(this.allowedRobberPlaces);
        const success1 = this.RandomizeTerrain();
        const success2 = this.RandomizeNumbers();
        return success1 && success2;
    }

    RandomizeNumbers(): boolean {
        const res = this.numberRandomizer.randomize(this.tiles, this.robberIndex);
        this.tiles = res[0];
        return res[1];
    }

    RandomizeTerrain(): boolean {
        const res = this.terrainRandomizer.randomize(this.tiles, this.robberIndex);
        this.tiles = res[0];
        return res[1];
    }

    public print() {
        console.log("print");
        for (const row of this.tiles) {
            console.log(row);
        }
    }
}

export class Intersection {
    positions: TilePosition[];
    constructor(positions: TilePosition[]) {
        this.positions = positions;
    }
}

export type TilePosition = {
    row: number;
    col: number;
};

export class Tile {
    token: number;
    terrain: Terrain;
    x: number;
    y: number;
    size: number;

    constructor(token: number, terrain: Terrain, tileSize: number) {
        this.token = token;
        this.terrain = terrain;
        this.x = 0;
        this.y = 0;
        this.size = tileSize;
    }

    color(): string {
        return terrainData.get(this.terrain)?.color || "#fff";
    }

    copyWithToken(token: number) {
        return new Tile(token, this.terrain, this.size);
    }

    copyWithTerrain(terrain: Terrain) {
        return new Tile(this.token, terrain, this.size);
    }
}

export enum Terrain {
    BRICK,
    LUMBER,
    ORE,
    GRAIN,
    WOOL,
    DESSERT,
}

const terrainData = new Map<Terrain, { color: string; amount: number }>();
terrainData.set(Terrain.WOOL, { color: "#98C946", amount: 4 });
terrainData.set(Terrain.LUMBER, { color: "#0E7D3E", amount: 4 });
terrainData.set(Terrain.GRAIN, { color: "#E0A227", amount: 4 });
terrainData.set(Terrain.BRICK, { color: "#9F6D31", amount: 3 });
terrainData.set(Terrain.ORE, { color: "#858F80", amount: 3 });
terrainData.set(Terrain.DESSERT, { color: "#F7E08C", amount: 1 });
