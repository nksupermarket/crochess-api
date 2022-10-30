import {
  Board,
  CastleRights,
  CastleRightsStr,
  Colors,
  EnPassant,
  Square,
  SquareIdx
} from '../types/types';
import { convertSquareToIdx } from '../utils/square';
import { isSquare } from '../utils/typeCheck';
import Gameboard from './Gameboard';
import { COLORS, OPP_COLOR, VECTORS } from '../utils/constants';

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
          k: castleRightsStr.includes(kingsideStr),
          q: castleRightsStr.includes(queensideStr)
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

  makeMove(from: Square, to: Square) {
    const fromIdx = convertSquareToIdx(from);
    const toIdx = convertSquareToIdx(to);

    const piece = this.at(fromIdx).piece;
    if (!piece) return;
    if (piece[0] !== this.activeColor) return;

    const valid = this.at(fromIdx)
      ?.moves({
        enPassant: this.enPassant,
        castleRights: this.castleRights[this.activeColor]
      })
      ?.includes(toIdx);

    if (!valid) return;

    this.from(fromIdx).to(toIdx);

    // check if move is castle

    if (piece[1] === 'k') {
      // toggle castle rights
      this.castleRights[this.activeColor] = {
        k: false,
        q: false
      };

      // move rook if its a castle move
      const distance = fromIdx - toIdx;
      if (distance === -2) {
        this.castle(this.activeColor, 'q');
      }

      if (distance === 2) {
        this.castle(this.activeColor, 'k');
      }
    }
    if (piece[1] === 'r') {
      const kingIdx = this.pieceMap[this.activeColor].k[0];
      const kingside = fromIdx > kingIdx;

      this.castleRights[this.activeColor][kingside ? 'k' : 'q'] = false;
    }

    if (piece[1] === 'p') {
      const forward = this.activeColor === 'w' ? 'up' : 'down';
      // check if capture by enPassant
      if (toIdx === this.enPassant) {
        const captureIdx = (toIdx - VECTORS[forward]) as SquareIdx;
        this.at(captureIdx).remove();
      }
      // check if you need to toggle enPassant
      if (toIdx === 2 * VECTORS[forward] + fromIdx) {
        this.enPassant = (toIdx - VECTORS[forward]) as SquareIdx;
      } else this.enPassant = null;
    } else this.enPassant = null;

    this.halfmoves++;
    this.activeColor = OPP_COLOR[this.activeColor];
    if (this.activeColor === 'w') this.fullmoves++;
  }
}
