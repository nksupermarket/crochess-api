import { COLORS, FILES, PIECE_TYPES } from 'src/utils/constants';
import Piece from '../classes/Piece';

export type PieceType = typeof PIECE_TYPES[number];

export type PieceAbr = 'r' | 'k' | 'n' | 'b' | 'q' | 'p';

export type Colors = typeof COLORS[number];

export type Files = typeof FILES[number];

export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends T[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export type Line = 'xy' | 'diagonal';

export type Rank<Len extends number> = Tuple<Piece | null, Len>;
export type Board<Size extends number> = Tuple<Rank<Size>, Size>;

export type Square<File extends string, Rank extends number> = `${File}${Rank}`;

export type Enumerate<N extends number> = N extends 0
  ? never
  : number extends N
  ? number
  : _EnumerateFrom<N>;

export type _EnumerateFrom<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number] & number
  : _EnumerateFrom<N, [...Acc, Acc['length']]>;

export type EnumerateFromOne<
  N extends number,
  Acc extends number[] = [N]
> = Acc['length'] extends N
  ? Acc[number] & number
  : _EnumerateFrom<N, [...Acc, Acc['length']]>;

export type SquareIdx<BoardSize extends number> = Tuple<
  Enumerate<BoardSize>,
  2
>;

export type Permutations<
  T extends string,
  U extends string = T
> = U extends string ? U | `${U}${Permutations<Exclude<T, U>>}` : never;

export type PieceMap<S extends number> = Record<PieceType, SquareIdx<S>[]>;

export type CastleRightsStr = Permutations<'K' | 'Q' | 'k' | 'q'>;

export type EnPassant<S extends number> = Square<Files, Enumerate<S>> | '-';

export type CastleRights = Record<'kingside' | 'queenside', boolean>;

export type CastleSquares<S extends number> = Record<
  'kingside' | 'queenside',
  SquareIdx<S>[]
>;
