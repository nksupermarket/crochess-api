import { Square, EnumerateFromOne, Files, SquareIdx } from 'src/types/types';
import { BOARD_LENGTH, FILES } from './constants';

export function convertSquareToIdx(square: Square): SquareIdx {
  return (FILES.indexOf(square[0] as Files) +
    Number(+square[1] - 1) * BOARD_LENGTH) as SquareIdx;
}

export function convertIdxToSquare(idx: SquareIdx): Square {
  const file = FILES[idx % BOARD_LENGTH];
  const rank = (Math.floor(idx / BOARD_LENGTH) + 1) as EnumerateFromOne<
    typeof BOARD_LENGTH
  >;

  return `${file}${rank}`;
}
