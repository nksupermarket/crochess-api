import { Square, EnumerateFromOne, Files, SquareIdx } from 'src/types/types';
import { FILES } from './constants';

export function convertSquareToIdx<S extends number>(
  square: Square<Files, EnumerateFromOne<S>>
): SquareIdx<S> {
  return [
    FILES.indexOf(square[0] as Files),
    Number(+square[1] - 1)
  ] as SquareIdx<S>;
}

export function convertIdxToSquare<S extends number>(
  idx: SquareIdx<S>
): Square<Files, EnumerateFromOne<S>> {
  const file = FILES[idx[0]] as Files;
  const rank = (Number(idx[1]) + 1) as EnumerateFromOne<S>;
  return `${file}${rank}`;
}
