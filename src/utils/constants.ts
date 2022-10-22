import { PieceAbr, PieceType } from '../types/types';

export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const FILES = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
] as const;

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

export const ABR_TO_PIECE_MAP = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king'
} as const;

export const PIECE_TO_ABR_MAP = {
  pawn: 'p',
  knight: 'n',
  bishop: 'b',
  rook: 'r',
  queen: 'q',
  king: 'k'
} as const;
