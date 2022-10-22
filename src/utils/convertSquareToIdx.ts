import { Square, EnumerateFromOne, Files, SquareIdx } from 'src/types/types';
import { FILES } from './constants';

export default function convertSquareToIdx<S extends number>(
  square: Square<Files, EnumerateFromOne<S>>
): SquareIdx<S> {
  return [
    FILES.indexOf(square[0] as Files),
    Number(square[1]) - 1
  ] as SquareIdx<S>;
}
