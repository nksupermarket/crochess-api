import { Square, EnumerateFromOne, Files, SquareIdx } from 'src/types/types';
export declare function convertSquareToIdx<S extends number, L extends number>(square: Square<Files, EnumerateFromOne<L>>, boardSize: S): SquareIdx<S>;
export declare function convertIdxToSquare<S extends number, L extends number>(idx: SquareIdx<S>, boardSize: S): Square<Files, EnumerateFromOne<L>>;
