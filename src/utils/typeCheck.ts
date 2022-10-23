import { EnumerateFromOne, Files, SquareIdx, Square } from '../types/types';
import { FILES } from './constants';

export function isSquareIdx<B extends number>(
  boardSize: B,
  value: number[]
): value is SquareIdx<B> {
  return (
    value[0] >= 0 &&
    value[0] < boardSize &&
    value[1] >= 0 &&
    value[1] < boardSize
  );
}

export function isFiles(char: string): char is Files {
  return !!FILES.find((v) => v === char);
}

export function isSquare<N extends number>(
  boardSize: N,
  value: string
): value is Square<Files, EnumerateFromOne<N>> {
  if (value.length > 2) return false;
  if (!isFiles(value[0])) return false;
  if (FILES.indexOf(value[0]) >= boardSize) return false;
  if (+value[1] > boardSize) return false;
  return true;
}
