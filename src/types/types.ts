import {
  COLORS,
  FILES,
  PIECE_TYPES,
  POINT_TO_PIECE_MAP,
  PIECE_TO_POINT_MAP,
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

export type PieceAsPoint =
  typeof PIECE_TO_POINT_MAP[keyof typeof PIECE_TO_POINT_MAP];

export type Board = Tuple<Piece | null, typeof BOARD_SIZE>;
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

export type Permutations<
  T extends string,
  U extends string = T
> = U extends string ? U | `${U}${Permutations<Exclude<T, U>>}` : never;

export type PieceMap = Record<PieceType, SquareIdx[]>;

export type CastleRightsStr = Permutations<'K' | 'Q' | 'k' | 'q'>;

export type EnPassant = Square | '-';

export type CastleRights = Record<'kingside' | 'queenside', boolean>;

export type CastleSquares = Record<'kingside' | 'queenside', SquareIdx[]>;

export type NumberLiteral<N extends Exclude<number, N>> = N;

export type FenStr = string;

export type Dir = keyof typeof VECTORS;

export type Vector = typeof VECTORS[Dir];
