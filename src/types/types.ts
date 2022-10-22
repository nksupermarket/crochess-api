import { COLORS, FILES, PIECE_TYPES } from 'src/utils/constants';
import Piece from '../classes/Piece';

export type PieceType = typeof PIECE_TYPES[number];

export type PieceAbr = 'r' | 'k' | 'n' | 'b' | 'q' | 'p';

export type Colors = typeof COLORS[number];

export type Files = typeof FILES[number];

export type Tuple<
  T,
  Len extends number,
  R extends T[] = []
> = R['length'] extends Len ? R : Tuple<T, Len, [T, ...R]>;

export type Line = 'xy' | 'diagonal';

export type Board = (Piece | null)[][];

export type Square<File extends string, Rank extends number> = `${File}${Rank}`;

export type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number] & number
  : Enumerate<N, [...Acc, Acc['length']]>;

export type EnumerateFromOne<
  N extends number,
  Acc extends number[] = [N]
> = Acc['length'] extends N
  ? Acc[number] & number
  : Enumerate<N, [...Acc, Acc['length']]>;

export type SquareIdx<BoardSize extends number> = Tuple<
  Enumerate<BoardSize>,
  2
>;

export type PieceMap<S extends number> = Record<PieceType, SquareIdx<S>[]>;
