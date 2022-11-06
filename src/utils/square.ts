import { Square, EnumerateFromOne, Files, SquareIdx } from '../types/types';
import { BOARD_IDX, BOARD_LENGTH, FILES } from './constants';

export function convertSquareToIdx(square: Square): SquareIdx {
  return BOARD_IDX[
    FILES.indexOf(square[0] as Files) + Number(+square[1] - 1) * BOARD_LENGTH
  ];
}

export function convertIdxToSquare(idx: SquareIdx): Square | undefined {
  const bIdx = BOARD_IDX.indexOf(idx);
  if (bIdx === -1) return;
  const file = FILES[bIdx % BOARD_LENGTH];
  const rank = (Math.floor(bIdx / BOARD_LENGTH) + 1) as EnumerateFromOne<
    typeof BOARD_LENGTH
  >;

  return `${file}${rank}`;
}
