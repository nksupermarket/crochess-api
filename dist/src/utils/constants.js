export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
export const FILES = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
];
export const PIECE_TYPES = ['r', 'n', 'b', 'q', 'k', 'p'];
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
};
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
};
export const COLORS = ['w', 'b'];
export const BOARD_SIZE = 64;
//# sourceMappingURL=constants.js.map