import {
  Board,
  CastleRights,
  CastleRightsStr,
  Colors,
  EnPassant,
  SquareIdx
} from '../types/types';
import { convertSquareToIdx } from '../utils/square';
import { isSquare } from '../utils/typeCheck';
import Gameboard from './Gameboard';
import { COLORS } from '../utils/constants';

export default class Game<Size extends number> extends Gameboard<Size> {
  castleRights: Record<Colors, CastleRights>;
  enPassant: SquareIdx<Size> | null;
  halfmoves: number;
  fullmoves: number;
  activeColor: Colors;

  constructor({
    boardSize,
    castleRightsStr = 'KQkq',
    board,
    enPassant,
    halfmoves = 0,
    fullmoves = 0,
    activeColor = 'w'
  }: {
    boardSize: Size;
    castleRightsStr: CastleRightsStr;
    enPassant: EnPassant<Size>;
    halfmoves: string | number;
    fullmoves: string | number;
    activeColor: Colors;
    board?: Board<Size>;
  }) {
    super(boardSize, board && board);
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
    this.enPassant = isSquare(boardSize as Size, enPassant)
      ? convertSquareToIdx(enPassant, boardSize as Size)
      : null;
    this.halfmoves = Number(halfmoves);
    this.fullmoves = Number(fullmoves);
    this.activeColor = activeColor;
  }
}
