import { Board } from '../types/types';

export default function createBoard(size: number): Board {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
}
