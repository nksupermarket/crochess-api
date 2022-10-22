import Castle from './Castle';
import {
  Board,
  CastleRightsStr,
  Colors,
  Enumerate,
  Files,
  Square,
  SquareIdx
} from 'src/types/types';
import convertSquareToIdx from 'src/utils/convertSquareToIdx';

export default class GameState<S extends number> {
  castleRights: Castle;
  board: Board<S>;
  enPassant: SquareIdx<S>;
  halfmoves: number;
  fullmoves: number;
  activeColor: Colors;

  constructor({
    castleRightsStr,
    board,
    enPassant,
    halfmoves,
    fullmoves,
    activeColor
  }: {
    castleRightsStr: CastleRightsStr;
    board: Board<S>;
    enPassant: Square<Files, Enumerate<S>>;
    halfmoves: string;
    fullmoves: string;
    activeColor: Colors;
  }) {
    this.castleRights = new Castle(castleRightsStr);
    this.board = board;
    this.enPassant = convertSquareToIdx(enPassant);
    this.halfmoves = Number(halfmoves);
    this.fullmoves = Number(fullmoves);
    this.activeColor = activeColor;
  }
}
