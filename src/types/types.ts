import Piece from '../classes/Piece';

export type PieceType =
  | 'rook'
  | 'knight'
  | 'bishop'
  | 'queen'
  | 'king'
  | 'pawn';

export type PieceAbr = 'r' | 'k' | 'n' | 'b' | 'q' | 'p';

export type Colors = 'white' | 'black';

export type Tuple<
  T,
  Len extends number,
  R extends T[] = []
> = R['length'] extends Len ? R : Tuple<T, Len, [T, ...R]>;

export type Line = 'xy' | 'diagonal';

export type Board = (Piece | null)[][];

export type Square<
  Column extends number,
  Row extends string
> = `${Column}${Row}`;

export type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number] & number
  : Enumerate<N, [...Acc, Acc['length']]>;

export type SquareIdx<BoardSize extends number> = Tuple<
  Enumerate<BoardSize>,
  2
>;
