import {
  AllPieceMap,
  Square,
  Colors,
  PieceType,
  SquareIdx
} from '../types/types';
import { GameState } from 'src/types/interfaces';
import { getLegalPieceMoves, getLegalKingMoves, getChecks } from './getMoves';
import { OPP_COLOR } from './constants';
import { convertSquareToIdx } from './square';

export default function getLegalMoves(
  square: Square,
  gameState: GameState,
  pieceMap: AllPieceMap,
  checks: SquareIdx[]
) {
  const idx = convertSquareToIdx(square);
  const piece = gameState.board[idx];
  if (!piece) return null;
  const oppColor = OPP_COLOR[piece[0] as Colors];
  if (piece[1] === 'k') {
    return getLegalKingMoves(
      pieceMap[piece[0] as Colors].k[0],
      piece[0] as Colors,
      pieceMap[oppColor],
      gameState.castleRights[piece[0] as Colors],
      gameState.board
    );
  } else {
    return getLegalPieceMoves(
      piece[1] as Exclude<PieceType, 'k'>,
      gameState.board,
      piece[0] as Colors,
      idx,
      pieceMap[piece[0] as Colors].k[0],
      checks,
      gameState.enPassant !== '-'
        ? convertSquareToIdx(gameState.enPassant)
        : undefined
    );
  }
}

export { getChecks };
