import { CastleRights, Board, Colors, PieceMap, PieceType, SquareIdx, Vector, SquareMap, Tuple, AllPieceMap } from '../types/types';
export declare const getPieceMoves: (pieceType: Exclude<PieceType, 'p'>, board: ["bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null], pIdx: SquareIdx, pinVector?: Vector, includeOwnPieces?: boolean) => SquareIdx[];
export declare const getPawnMoves: (board: ["bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null, "bb" | "br" | "bn" | "bq" | "bk" | "bp" | "wb" | "wr" | "wn" | "wq" | "wk" | "wp" | null], color: Colors, pIdx: SquareIdx, enPassant?: SquareIdx, pinVector?: Vector) => (0 | 2 | 1 | 22 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63)[];
export declare function getChecks(oppColor: Colors, kIdx: SquareIdx, board: Board): Tuple<SquareIdx, 0 | 1 | 2>;
export declare function getLegalKingMoves(kingIdx: SquareIdx, oppPieceMap: PieceMap, castleRights: CastleRights, board: Board): (0 | 2 | 1 | 22 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63)[];
declare function getSquaresBetweenTwoSquares(s1Idx: SquareIdx, s2Idx: SquareIdx): SquareMap | undefined;
declare function isPiecePinned(sIdx: SquareIdx, kingIdx: SquareIdx, oppColor: Colors, board: Board): Vector | undefined;
export declare function getLegalMoves(pieceType: Exclude<PieceType, 'k'>, board: Board, color: Colors, sIdx: SquareIdx, kingIdx: SquareIdx, check: SquareIdx[], enPassant?: SquareIdx): SquareIdx[];
export declare function getMovesForColor(board: Board, pieceMap: AllPieceMap, color: Colors, enPassant: SquareIdx | null, castleRights: CastleRights, check: SquareIdx[]): SquareMap;
export declare const exportedForTesting: {
    isPiecePinned: typeof isPiecePinned;
    getSquaresBetweenTwoSquares: typeof getSquaresBetweenTwoSquares;
};
export {};
