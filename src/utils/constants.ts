export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export const PIECE_TYPES = ['r', 'n', 'b', 'q', 'k', 'p'] as const;

export const POINT_TO_PIECE_MAP = {
  1: 'P',
  5: 'R',
  3: 'N',
  3.1: 'B',
  9: 'Q',
  100: 'K',
  [-1]: 'p',
  [-5]: 'r',
  [-3]: 'n',
  [-3.1]: 'b',
  [-9]: 'q',
  [-100]: 'k'
} as const;

export const PIECE_TO_POINT_MAP = {
  P: 1,
  R: 5,
  N: 3,
  B: 3.1,
  Q: 9,
  K: 100,
  p: -1,
  r: -5,
  n: -3,
  b: -3.1,
  q: -9,
  k: -100
} as const;

export const COLORS = ['w', 'b'] as const;

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
] as const;

export const VECTORS = {
  up: BOARD_LENGTH,
  down: -8,
  left: -1,
  right: 1,
  'up left': 7,
  'up right': 9,
  'down left': -9,
  'down right': -7
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
