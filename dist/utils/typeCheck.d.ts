import { Files, SquareIdx, Square, PieceType, Colors, FenStr } from '../types/types';
export declare function isSquareIdx(value: number): value is SquareIdx;
export declare function isFiles(char: string): char is Files;
export declare function isSquare(value: string): value is Square;
export declare function isColor(char: string): char is Colors;
export declare function isPieceType(char: string): char is PieceType;
export declare function isFenStr(str: string): str is FenStr;
