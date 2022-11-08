import { AllPieceMap, SquareIdx } from 'src/types/types';

export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export const PIECE_TYPES = ['r', 'n', 'b', 'q', 'k', 'p'] as const;

export const COLORS = ['w', 'b'] as const;

export const BOARD_SIZE = 120;

export const BOARD_LENGTH = 8;

export const BOARD_IDX: SquareIdx[] = [
  21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43,
  44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 56, 57, 58, 61, 62, 63, 64, 65, 66,
  67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 86, 87, 88, 91,
  92, 93, 94, 95, 96, 97, 98
];
// board_idx is a collection of indexes that represent all indexes not occupied by sentinel values

export const KNIGHT_JUMPS = [-21, -19, 19, 21, 12, 8, -8, -12] as const;

export const VECTORS = {
  up: 10,
  down: -10,
  left: -1,
  right: 1,
  'up left': 9,
  'up right': 11,
  'down left': -11,
  'down right': -9
} as const;

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
} as const;
