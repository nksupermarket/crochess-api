import { Board, CastleRights, CastleRightsStr, Colors, EnPassant, SquareIdx } from '../types/types';
import Gameboard from './Gameboard';
export default class Game<Size extends number> extends Gameboard<Size> {
    castleRights: Record<Colors, CastleRights>;
    enPassant: SquareIdx<Size> | null;
    halfmoves: number;
    fullmoves: number;
    activeColor: Colors;
    constructor({ boardSize, castleRightsStr, board, enPassant, halfmoves, fullmoves, activeColor }: {
        boardSize: Size;
        castleRightsStr: CastleRightsStr;
        enPassant: EnPassant<Size>;
        halfmoves: string | number;
        fullmoves: string | number;
        activeColor: Colors;
        board?: Board<Size>;
    });
}
