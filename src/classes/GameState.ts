import Castle from './Castle';
import { CastleRightsStr, Colors, EnPassant, SquareIdx } from 'src/types/types';
import convertSquareToIdx from 'src/utils/convertSquareToIdx';
import { isSquare } from 'src/utils/typeCheck';
import Gameboard from './Gameboard';

export default class GameState<Size extends number> {
  castleRights: Castle;
  gameboard: Gameboard<Size>;
  enPassant: SquareIdx<Size> | null;
  halfmoves: number;
  fullmoves: number;
  activeColor: Colors;

  constructor({
    boardSize,
    castleRightsStr = 'KQkq',
    gameboard = new Gameboard(boardSize),
    enPassant = '-',
    halfmoves = 0,
    fullmoves = 0,
    activeColor = 'w'
  }: {
    boardSize: Size;
    castleRightsStr: CastleRightsStr;
    gameboard: Gameboard<Size>;
    enPassant: EnPassant<Size>;
    halfmoves: string | number;
    fullmoves: string | number;
    activeColor: Colors;
  }) {
    this.castleRights = new Castle(castleRightsStr);
    this.gameboard = gameboard;
    this.enPassant = isSquare(boardSize, enPassant)
      ? convertSquareToIdx(enPassant)
      : null;
    this.halfmoves = Number(halfmoves);
    this.fullmoves = Number(fullmoves);
    this.activeColor = activeColor;
  }
}
