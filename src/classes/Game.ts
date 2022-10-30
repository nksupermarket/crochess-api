import {
  Board,
  CastleRights,
  CastleRightsStr,
  Colors,
  EnPassant,
  PieceType,
  SquareIdx
} from '../types/types';
import { convertSquareToIdx } from '../utils/square';
import { isSquare } from '../utils/typeCheck';
import Gameboard from './Gameboard';
import { COLORS } from '../utils/constants';

export default class Game extends Gameboard {
  castleRights: Record<Colors, CastleRights>;
  enPassant: SquareIdx | null;
  halfmoves: number;
  fullmoves: number;
  activeColor: Colors;

  constructor({
    castleRightsStr = 'KQkq',
    board,
    enPassant,
    halfmoves = 0,
    fullmoves = 0,
    activeColor = 'w'
  }: {
    castleRightsStr: CastleRightsStr;
    enPassant: EnPassant;
    halfmoves: string | number;
    fullmoves: string | number;
    activeColor: Colors;
    board?: Board;
  }) {
    super(board);
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
    this.enPassant = isSquare(enPassant) ? convertSquareToIdx(enPassant) : null;
    this.halfmoves = Number(halfmoves);
    this.fullmoves = Number(fullmoves);
    this.activeColor = activeColor;
  }
}
