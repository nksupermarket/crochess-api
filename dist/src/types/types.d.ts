import { COLORS, FILES, PIECE_TYPES, PIECE_TO_POINT_MAP } from 'src/utils/constants';
export declare type PieceType = typeof PIECE_TYPES[number];
export declare type Colors = typeof COLORS[number];
export declare type Piece = `${Colors}${PieceType}`;
export declare type Files = typeof FILES[number];
export declare type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
declare type _TupleOf<T, N extends number, R extends T[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;
export declare type Line = 'xy' | 'diagonal';
export declare type PieceAsPoint = typeof PIECE_TO_POINT_MAP[keyof typeof PIECE_TO_POINT_MAP];
export declare type Board<Size extends number> = Tuple<Piece | null, Size>;
export declare type Square<File extends string, Rank extends number> = `${File}${Rank}`;
export declare type Enumerate<N extends number> = N extends 0 ? never : number extends N ? number : _EnumerateFrom<N>;
export declare type _EnumerateFrom<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] & number : _EnumerateFrom<N, [...Acc, Acc['length']]>;
export declare type EnumerateFromOne<N extends number, Acc extends number[] = [N]> = Acc['length'] extends N ? Acc[number] & number : _EnumerateFrom<N, [...Acc, Acc['length']]>;
export declare type SquareIdx<N extends number> = Enumerate<N>;
export declare type Permutations<T extends string, U extends string = T> = U extends string ? U | `${U}${Permutations<Exclude<T, U>>}` : never;
export declare type PieceMap<S extends number> = Record<PieceType, SquareIdx<S>[]>;
export declare type CastleRightsStr = Permutations<'K' | 'Q' | 'k' | 'q'>;
export declare type EnPassant<S extends number> = Square<Files, Enumerate<S>> | '-';
export declare type CastleRights = Record<'kingside' | 'queenside', boolean>;
export declare type CastleSquares<S extends number> = Record<'kingside' | 'queenside', Enumerate<S>[]>;
export declare type NumberLiteral<N extends Exclude<number, N>> = N;
export declare type FenStr = string;
export {};