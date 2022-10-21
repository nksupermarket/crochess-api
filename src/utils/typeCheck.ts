import { SquareIdx } from '../types/types';

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
