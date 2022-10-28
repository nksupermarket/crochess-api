import Game from '../classes/Game';
import { Board, Colors, SquareIdx, PieceType, FenStr } from '../types/types';
export declare function convertFromFen<Size extends number>(fen: FenStr, cb?: (pieceType: PieceType, color: Colors, squareIdx: SquareIdx<Size>) => void): Game<Size>;
export declare function convertFromFen<Size extends number>(fen: string, cb?: (pieceType: PieceType, color: Colors, squareIdx: SquareIdx<Size>) => void): undefined;
export declare function convertToFen<Size extends number>(board: Board<Size>): string;
