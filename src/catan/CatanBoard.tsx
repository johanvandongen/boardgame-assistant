import * as React from "react";
import { CatanBoardTiles, Tile } from "./CatanBoard.ts";

export interface ICatanBoardProps {
    catanBoard: CatanBoardTiles;
    rotation: 0 | 90;
}

const GetHexGeom = (size: number): [number, number, number] => {
    const a = size * (0.5 * Math.sqrt(3));
    const b = size * 0.5;
    return [a, b, size];
};

const GetTileCoords = (tiles: Tile[][], rotation: number): Tile[][] => {
    const [a, b, hexSize] = GetHexGeom(tiles[0][0].size);
    if (rotation === 90) {
        const rowStartY = [3 * a, 2 * a, a, 2 * a, 3 * a];
        let x = 7 * hexSize;
        for (let row = 0; row < tiles.length; row++) {
            let y = rowStartY[row];
            for (let col = 0; col < tiles[row].length; col++) {
                tiles[row][col].x = x;
                tiles[row][col].y = y;
                y += 2 * a;
            }
            x -= 3 * b;
        }
        return tiles;
    }

    const rowStartX = [3 * a, 2 * a, a, 2 * a, 3 * a];
    let y = hexSize;
    for (let row = 0; row < tiles.length; row++) {
        let x = rowStartX[row];
        for (let col = 0; col < tiles[row].length; col++) {
            tiles[row][col].x = x;
            tiles[row][col].y = y;
            x += 2 * a;
        }
        y += 3 * b;
    }
    return tiles;
};

export function CatanBoard({ catanBoard, rotation }: ICatanBoardProps) {
    const [a, b, hexSize] = GetHexGeom(catanBoard.tiles[0][0].size);
    let width = 2 * a * 5;
    let height = hexSize * 5 + 6 * b;
    if (rotation === 90) {
        [width, height] = [height, width];
    }
    return (
        <svg viewBox={`0 0 ${width} ${height}`}>
            {GetTileCoords(catanBoard.tiles, rotation).map((tile: Tile[]) =>
                tile.map((t) => (
                    <React.Fragment key={t.x + "tilefragment" + t.y}>
                        <CatanHexTile tile={t} key={t.x + "tile" + t.y} rotation={rotation} />
                        <Token tile={t} key={t.x + "tiletoken" + t.y} />
                    </React.Fragment>
                ))
            )}
        </svg>
    );
}

export interface ICatanHexTileProps {
    tile: Tile;
    rotation?: number;
}

export function CatanHexTile({ tile, rotation }: ICatanHexTileProps) {
    return (
        <Hex x={tile.x} y={tile.y} tileSize={tile.size} rotataton={rotation} color={tile.color()} />
    );
}

export interface IToken {
    tile: Tile;
}

export function Token({ tile }: IToken) {
    const tokenColor = tile.token === 6 || tile.token === 8 ? "#d2242b" : "black";
    const tokenSize = tile.token === 2 || tile.token === 12 ? tile.size / 2.5 - 2 : tile.size / 2.5;
    if (tile.token === 0) {
        return <></>;
    }
    return (
        <svg>
            <circle cx={tile.x} cy={tile.y} r={tile.size / 2.5} fill="#ddbf7b" />
            <text
                x={tile.x}
                y={tile.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={tokenSize}
                fontWeight={600}
                fill={tokenColor}
            >
                {tile.token}
            </text>
        </svg>
    );
}

export interface IHexProps {
    x: number; // center of hexagon
    y: number; // center of hexagon
    color: string;
    rotataton?: number;
    tileSize: number; // line segment size
}

export function Hex({ x, y, tileSize, color, rotataton }: IHexProps) {
    const [a, b, size] = GetHexGeom(tileSize);

    let points;
    if (rotataton === undefined || rotataton === 0) {
        points = `${x}, ${y - size} ${x + a}, ${y - b} ${x + a}, ${y + b} ${x}, ${y + size} ${x - a}, ${y + b} ${x - a}, ${y - b}`;
    } else {
        points = `${x + b}, ${y - a} ${x + 2 * b}, ${y} ${x + b}, ${y + a} ${x - b}, ${y + a} ${x - 2 * b}, ${y} ${x - b}, ${y - a}`;
    }
    return (
        <svg>
            <polygon points={points} fill={color} stroke="black" />
        </svg>
    );
}
