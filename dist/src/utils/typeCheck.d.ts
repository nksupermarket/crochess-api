import { EnumerateFromOne, Files, SquareIdx, Square, PieceType, Colors, FenStr } from '../types/types';
export declare function isSquareIdx<B extends number>(boardSize: B, value: number): value is SquareIdx<B>;
export declare function isFiles(char: string): char is Files;
export declare function isSquare<N extends number>(boardSize: N, value: string): value is Square<Files, EnumerateFromOne<N>>;
export declare function isColor(char: string): char is Colors;
export declare function isPieceType(char: string): char is PieceType;
export declare function isFenStr(str: string): str is FenStr;
