import { PieceAbr, PieceType } from '../types/types';

export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export const PIECE_TYPES = [
  'rook',
  'knight',
  'bishop',
  'queen',
  'king',
  'pawn'
] as const;

export const COLORS = ['w', 'b'];

export const BOARD_SIZE = 8;

export const PIECE_ABR_MAP: Record<PieceAbr, PieceType> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king'
} as const;
