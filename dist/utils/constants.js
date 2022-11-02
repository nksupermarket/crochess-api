export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const PIECE_TYPES = ['r', 'n', 'b', 'q', 'k', 'p'];
export const COLORS = ['w', 'b'];
export const BOARD_SIZE = 64;
export const BOARD_LENGTH = 8;
export const KNIGHT_JUMPS = [
    -2 * BOARD_LENGTH + 1,
    -2 * BOARD_LENGTH - 1,
    2 * BOARD_LENGTH - 1,
    2 * BOARD_LENGTH + 1,
    BOARD_LENGTH + 2,
    BOARD_LENGTH - 2,
    -BOARD_LENGTH + 2,
    -BOARD_LENGTH - 2
];
export const VECTORS = {
    up: BOARD_LENGTH,
    down: -8,
    left: -1,
    right: 1,
    'up left': 7,
    'up right': 9,
    'down left': -9,
    'down right': -7
};
export const DIAGONAL_VECTORS = [
    VECTORS['up left'],
    VECTORS['down left'],
    VECTORS['down right'],
    VECTORS['up right']
];
export const XY_VECTORS = [
    VECTORS.up,
    VECTORS.down,
    VECTORS.left,
    VECTORS.right
];
export const ALL_VECTORS = [...XY_VECTORS, ...DIAGONAL_VECTORS];
export const OPP_COLOR = {
    w: 'b',
    b: 'w'
};
//# sourceMappingURL=constants.js.map