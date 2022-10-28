import { FILES } from './constants';
export function convertSquareToIdx(square, boardSize) {
    const length = Math.sqrt(boardSize);
    return (FILES.indexOf(square[0]) +
        Number(+square[1] - 1) * length);
}
export function convertIdxToSquare(idx, boardSize) {
    const length = Math.sqrt(boardSize);
    const file = FILES[idx % length];
    const rank = (Math.floor(idx / length) + 1);
    return `${file}${rank}`;
}
//# sourceMappingURL=square.js.map