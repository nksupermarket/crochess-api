import { CastleRights } from 'src/types/interface';
import { CastleRightsStr, Colors, EnPassant, SquareIdx } from 'src/types/types';
import convertSquareToIdx from 'src/utils/convertSquareToIdx';
import { isSquare } from 'src/utils/typeCheck';
import Gameboard from './Gameboard';
import { COLORS } from 'src/utils/constants';

export default class Game<Size extends number> {
  castleRights: Record<Colors, CastleRights>;
  gameboard: Gameboard<Size>;
  enPassant: SquareIdx<Size> | null;
  halfmoves: number;
  fullmoves: number;
  activeColor: Colors;

  constructor({
    boardSize,
    castleRightsStr = 'KQkq',
    gameboard = new Gameboard(boardSize),
    enPassant,
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
    this.castleRights = COLORS.reduce<Record<Colors, CastleRights>>(
      (acc, curr) => {
        const kingsideStr = curr === 'w' ? 'K' : 'k';
        const queensideStr = curr === 'w' ? 'Q' : 'q';

        acc[curr] = {
          kingside: castleRightsStr.includes(kingsideStr),
          queenside: castleRightsStr.includes(queensideStr)
        };
        return acc;
      },
      {} as Record<Colors, CastleRights>
    );
    this.gameboard = gameboard;
    this.enPassant = isSquare(boardSize, enPassant)
      ? convertSquareToIdx(enPassant)
      : null;
    this.halfmoves = Number(halfmoves);
    this.fullmoves = Number(fullmoves);
    this.activeColor = activeColor;
  }

  makeMove() {}
}
