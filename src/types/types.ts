import {
  COLORS,
  FILES,
  PIECE_TYPES,
  BOARD_SIZE,
  BOARD_LENGTH,
  VECTORS
} from 'src/utils/constants';

export type PieceType = typeof PIECE_TYPES[number];

export type Colors = typeof COLORS[number];

export type Piece = `${Colors}${PieceType}`;

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

export type Board = Tuple<Piece | null | 0, typeof BOARD_SIZE>;
export type Square = `${typeof FILES[number]}${EnumerateFromOne<
  typeof BOARD_LENGTH
>}`;

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

export type SquareIdx = Enumerate<typeof BOARD_SIZE>;

export type Range = EnumerateFromOne<typeof BOARD_LENGTH>;

export type Permutations<
  T extends string,
  U extends string = T
> = U extends string ? U | `${U}${Permutations<Exclude<T, U>>}` : never;

export type PieceMap = Partial<Record<Exclude<PieceType, 'k'>, SquareIdx[]>> &
  Record<'k', SquareIdx[]>;

export type AllPieceMap = Record<Colors, PieceMap>;

export type CastleRightsStr = Permutations<'K' | 'Q' | 'k' | 'q'> | '';

export type EnPassant = Square | '-';

export type Side = 'k' | 'q';

export type CastleRights = Record<Side, boolean>;

export type NumberLiteral<N extends Exclude<number, N>> = N;

export type FenStr = string;

export type Dir = keyof typeof VECTORS;

export type Vector = typeof VECTORS[Dir];

export type SquareMap = { [key in SquareIdx]?: true };
