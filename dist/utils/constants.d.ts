export declare const RANKS: readonly [1, 2, 3, 4, 5, 6, 7, 8];
export declare const FILES: readonly ["a", "b", "c", "d", "e", "f", "g", "h"];
export declare const PIECE_TYPES: readonly ["r", "n", "b", "q", "k", "p"];
export declare const COLORS: readonly ["w", "b"];
export declare const BOARD_SIZE = 64;
export declare const BOARD_LENGTH = 8;
export declare const KNIGHT_JUMPS: readonly [number, number, number, number, number, number, number, number];
export declare const VECTORS: {
    readonly up: 8;
    readonly down: -8;
    readonly left: -1;
    readonly right: 1;
    readonly 'up left': 7;
    readonly 'up right': 9;
    readonly 'down left': -9;
    readonly 'down right': -7;
};
export declare const DIAGONAL_VECTORS: (7 | 9 | -9 | -7)[];
export declare const XY_VECTORS: (1 | -1 | 8 | -8)[];
export declare const ALL_VECTORS: (1 | -1 | 7 | 8 | 9 | -8 | -9 | -7)[];
export declare const OPP_COLOR: {
    readonly w: "b";
    readonly b: "w";
};
