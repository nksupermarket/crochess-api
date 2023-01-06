import { MoveDetailsInterface } from '../types/interfaces';
import {
  MoveNotation,
  PieceUppercase,
  Files,
  Board,
  PromotePieceType,
  Colors,
  Square,
  Ranks,
  MoveSuffix,
  SquareIdx,
  AllPieceMap,
  PieceMap
} from '../types/types';
import { convertSquareToIdx, convertIdxToSquare } from './square';
import { getLegalPieceMoves } from './getMoves';

export default function createMoveNotation(
  details: MoveDetailsInterface,
  board: Board,
  pieceMap: AllPieceMap,
  checks: SquareIdx[],
  checkmate: boolean
): MoveNotation {
  let notation: MoveNotation;
  if (details.castle) {
    notation = details.castle === 'k' ? '0-0' : '0-0-0';
  } else {
    switch (details.piece[1]) {
      case 'p': {
        if (details.capture)
          notation = `${details.from[0] as Files}x${details.to}`;
        else notation = details.to;

        if (details.promote)
          notation += `=${details.promote.toUpperCase() as PieceUppercase}`;
        break;
      }
      case 'k': {
        if (details.capture)
          notation = `${details.piece[1].toUpperCase() as PieceUppercase}x${
            details.to
          }`;
        else
          notation = `${details.piece[1].toUpperCase() as PieceUppercase}${
            details.to
          }`;
        break;
      }
      default: {
        // have to copy bc you make the move first then get the notation
        const toIdx = convertSquareToIdx(details.to);
        const fromIdx = convertSquareToIdx(details.from);
        const copy = board.slice(0) as Board;
        if (copy[toIdx] === details.piece) {
          copy[toIdx] = null;
          copy[fromIdx] = details.piece;
        }
        const piecesThatHitSquare = getPiecesThatHitSquare(
          details.piece[1] as PromotePieceType,
          details.piece[0] as Colors,
          toIdx,
          pieceMap[details.piece[0] as Colors],
          checks,
          copy,
          fromIdx
        );
        if (!piecesThatHitSquare)
          throw new Error('piece doesnt exist in piece map');
        let differentiation: Files | Square | Ranks | '' = '';
        switch (piecesThatHitSquare.length) {
          case 2:
            differentiation = details.from;
            break;
          case 1: {
            const otherPiece = convertIdxToSquare(
              piecesThatHitSquare[0]
            ) as Square;
            differentiation = (
              otherPiece[0] === details.from[0]
                ? details.from[1]
                : details.from[0]
            ) as Ranks | Files;
          }
        }

        if (details.capture)
          notation = `${
            details.piece[1].toUpperCase() as PieceUppercase
          }${differentiation}x${details.to}`;
        else
          notation = `${
            details.piece[1].toUpperCase() as PieceUppercase
          }${differentiation}${details.to}`;
      }
    }
  }

  let suffix: MoveSuffix | '' = '';
  if (checks.length) {
    suffix = checkmate ? '#' : '+';
  }

  return (notation += suffix);
}

function getPiecesThatHitSquare(
  pieceType: PromotePieceType,
  color: Colors,
  square: SquareIdx,
  pieceMap: PieceMap,
  check: SquareIdx[],
  board: Board,
  skip?: SquareIdx
): SquareIdx[] | undefined {
  const pieceSquares = pieceMap[pieceType];
  if (!pieceSquares) return;
  if (pieceSquares.length === 1) return [];

  return pieceSquares.filter((s) => {
    return s === skip
      ? false
      : getLegalPieceMoves(
          pieceType,
          board,
          color,
          s,
          pieceMap.k[0],
          check
        ).includes(square);
  });
}
