import { Board, SquareIdx } from '../types/types';
import { BOARD_SIZE, BOARD_IDX, BOARD_LENGTH } from './constants';
export function createBoard(): Board {
  return Array(BOARD_SIZE)
    .fill(0)
    .map((s, i) => {
      if (BOARD_IDX.includes(i as SquareIdx)) return null;
      return 0;
    }) as Board;
}

export function init(board: Board): Board {
  const copy = board.slice(0);
  const initPositions = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'] as const;

  for (let i = 0; i < BOARD_IDX.length; i++) {
    // board_idx is a collection of indexes that represent all indexes not occupied by sentinel values
    copy[BOARD_IDX[i]] = null;
  }

  for (let i = 0; i < initPositions.length; i++) {
    copy[BOARD_IDX[i]] = `w${initPositions[i]}`;
    copy[BOARD_IDX[i + BOARD_LENGTH]] = `wp`;

    copy[
      // need to reverse the order for black side
      BOARD_IDX[BOARD_IDX.length - 1 - i]
    ] = `b${initPositions[initPositions.length - 1 - i]}`;

    copy[BOARD_IDX[BOARD_IDX.length - 1 - i - BOARD_LENGTH]] = 'bp';
  }

  return copy as Board;
}
