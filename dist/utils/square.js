import { BOARD_LENGTH, FILES } from './constants';
export function convertSquareToIdx(square) {
    return (FILES.indexOf(square[0]) +
        Number(+square[1] - 1) * BOARD_LENGTH);
}
export function convertIdxToSquare(idx) {
    const file = FILES[idx % BOARD_LENGTH];
    const rank = (Math.floor(idx / BOARD_LENGTH) + 1);
    return `${file}${rank}`;
}
//# sourceMappingURL=square.js.map