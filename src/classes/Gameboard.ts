import {
  Board,
  Colors,
  PieceMap,
  PieceType,
  Square,
  Files,
  EnumerateFromOne,
  SquareIdx,
  Piece
} from '../types/types';
import { BOARD_SIZE, COLORS, PIECE_TYPES } from '../utils/constants';
import { convertSquareToIdx } from '../utils/square';
import { isSquare } from '../utils/typeCheck';

export default class Gameboard<Size extends number> {
  board: Board<Size>;
  pieceMap: Record<Colors, PieceMap<Size>>;
  readonly length: number;

  constructor(size: Size, board?: Board<Size>) {
    this.board = board || this.create(size);
    this.length = Math.sqrt(size);
    this.pieceMap = (() => {
      return COLORS.reduce<Record<Colors, PieceMap<Size>>>((acc, curr) => {
        acc[curr] = PIECE_TYPES.reduce<PieceMap<Size>>((acc, curr) => {
          acc[curr] = [];
          return acc;
        }, {} as PieceMap<Size>);

        return acc;
      }, {} as Record<Colors, PieceMap<Size>>);
    })();
  }

  create(size: Size): Board<Size> {
    return Array(size)
      .fill(null)
      .map(() => null) as Board<Size>;
  }

  init(board = this.board) {
    if (board.length !== BOARD_SIZE) return;

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

  pushToPieceMap(
    pieceType: PieceType,
    color: Colors,
    squareIdx: SquareIdx<Size>
  ) {
    this.pieceMap[color][pieceType].push(squareIdx);
  }

  at(
    square: Square<Files, EnumerateFromOne<typeof this.length>>,
    board = this.board
  ) {
    if (!isSquare(board.length, square)) return;
    const idx = convertSquareToIdx(square, board.length as Size);

    return {
      get piece() {
        return board[idx];
      },

      placePiece(piece: Piece) {
        board[idx] = piece;
      },

      remove() {
        board[idx] = null;
      },

      promote(newType: Exclude<PieceType, 'p'>) {
        const piece = board[idx];
        if (!piece) return;
        board[idx] = `${piece[0] as Colors}${newType}`;
      }
    };
  }

  from(
    s1: Square<Files, EnumerateFromOne<typeof this.length>>,
    board = this.board
  ) {
    if (!isSquare(this.board.length, s1)) return;
    return {
      to: (s2: Square<Files, EnumerateFromOne<Size>>) => {
        if (!isSquare(this.board.length, s2)) return;
        if (s1 === s2) return;

        const s1Idx = convertSquareToIdx(s1, board.length as Size);
        const s2Idx = convertSquareToIdx(s2, board.length as Size);

        const piece = board[s1Idx];
        board[s1Idx] = null;
        board[s2Idx] = piece;
      }
    };
  }
}
