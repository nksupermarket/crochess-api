import {
  Board,
  Colors,
  PieceMap,
  PieceType,
  Square,
  SquareIdx,
  Piece
} from '../types/types';
import { BOARD_SIZE, COLORS, PIECE_TYPES } from '../utils/constants';
import { convertSquareToIdx } from '../utils/square';
import { isSquare } from '../utils/typeCheck';

export default class Gameboard {
  board: Board;
  pieceMap: Record<Colors, PieceMap>;
  readonly length: number;

  constructor(board?: Board) {
    this.board = board || this.create();
    this.pieceMap = (() => {
      return COLORS.reduce<Record<Colors, PieceMap>>((acc, curr) => {
        acc[curr] = PIECE_TYPES.reduce<PieceMap>((acc, curr) => {
          acc[curr] = [];
          return acc;
        }, {} as PieceMap);

        return acc;
      }, {} as Record<Colors, PieceMap>);
    })();
  }

  create(): Board {
    return Array(BOARD_SIZE)
      .fill(null)
      .map(() => null) as Board;
  }

  init(board = this.board) {
    const length = Math.sqrt(board.length);
    const initPositions = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'] as const;

    for (let i = 0; i < initPositions.length; i++) {
      board[i] = `w${initPositions[i]}`;
      board[i + length] = `wp`;

      board[
        // need to reverse the order for black side
        board.length - 1 - i
      ] = `b${initPositions[initPositions.length - 1 - i]}`;
      board[board.length - 1 - i - length] = 'bp';
    }
  }

  pushToPieceMap(pieceType: PieceType, color: Colors, squareIdx: SquareIdx) {
    this.pieceMap[color][pieceType].push(squareIdx);
  }

  moveInPieceMap(
    pieceType: PieceType,
    color: Colors,
    start: SquareIdx,
    end: SquareIdx
  ) {
    this.pieceMap[color][pieceType] = this.pieceMap[color][pieceType].map(
      (s) => {
        if (s !== start) return s;
        return end;
      }
    );
  }

  removeFromPieceMap(
    pieceType: PieceType,
    color: Colors,
    squareIdx: SquareIdx
  ) {
    this.pieceMap[color][pieceType] = this.pieceMap[color][pieceType].filter(
      (s) => s !== squareIdx
    );
  }

  at(square: Square, board = this.board) {
    if (!isSquare(square)) return;
    const idx = convertSquareToIdx(square);

    return {
      get piece() {
        return board[idx];
      },

      placePiece: (piece: Piece) => {
        board[idx] = piece;
        this.pushToPieceMap(piece[1] as PieceType, piece[0] as Colors, idx);
      },

      remove: () => {
        const piece = board[idx];
        if (piece)
          this.removeFromPieceMap(
            piece[1] as PieceType,
            piece[0] as Colors,
            idx
          );
        board[idx] = null;
      },

      promote: (newType: Exclude<PieceType, 'p'>) => {
        const piece = board[idx];
        if (!piece) return;
        board[idx] = `${piece[0] as Colors}${newType}`;
        this.removeFromPieceMap(piece[1] as PieceType, piece[0] as Colors, idx);
        this.pushToPieceMap(newType, piece[0] as Colors, idx);
      }
    };
  }

  from(s1: Square, board = this.board) {
    if (!isSquare(s1)) return;
    return {
      to: (s2: Square) => {
        if (!isSquare(s2)) return;
        if (s1 === s2) return;

        const s1Idx = convertSquareToIdx(s1);
        const s2Idx = convertSquareToIdx(s2);

        const piece = board[s1Idx];
        if (!piece) return;
        board[s1Idx] = null;
        board[s2Idx] = piece;

        this.moveInPieceMap(
          piece[1] as PieceType,
          piece[0] as Colors,
          s1Idx,
          s2Idx
        );
      }
    };
  }
}
