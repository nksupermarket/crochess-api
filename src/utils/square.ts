import { Square, EnumerateFromOne, Files, SquareIdx } from 'src/types/types';
import { FILES } from './constants';

export function convertSquareToIdx<S extends number, L extends number>(
  square: Square<Files, EnumerateFromOne<L>>,
  boardSize: S
): SquareIdx<S> {
  const length = Math.sqrt(boardSize);
  return (FILES.indexOf(square[0] as Files) +
    Number(+square[1] - 1) * length) as SquareIdx<S>;
}

export function convertIdxToSquare<S extends number, L extends number>(
  idx: SquareIdx<S>,
  boardSize: S
): Square<Files, EnumerateFromOne<L>> {
  const length: L = Math.sqrt(boardSize) as L;
  const file = FILES[idx % length];
  const rank = (Math.floor(idx / length) + 1) as EnumerateFromOne<L>;

  return `${file}${rank}`;
}
