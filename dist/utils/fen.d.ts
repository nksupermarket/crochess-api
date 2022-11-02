import Game from '../classes/Game';
import { Colors, SquareIdx, PieceType, FenStr } from '../types/types';
export declare function convertFromFen(fen: FenStr, pushToPieceMap?: (pieceType: PieceType, color: Colors, squareIdx: SquareIdx) => void): Game;
export declare function convertFromFen(fen: string, pushToPieceMap?: (pieceType: PieceType, color: Colors, squareIdx: SquareIdx) => void): undefined;
export declare function convertToFen(game: Game): string;
