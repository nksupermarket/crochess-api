import {
  Board,
  Colors,
  SquareIdx,
  PieceMap,
  PieceType,
  Square,
  Files,
  EnumerateFromOne
} from '../types/types';
import Piece from './Piece';
import { BOARD_SIZE, COLORS, FILES, PIECE_TYPES } from '../utils/constants';
import convertSquareToIdx from 'src/utils/convertSquareToIdx';
import GameState from './GameState';
import { isSquare } from 'src/utils/typeCheck';

export default class Gameboard<Size extends number> {
  board: Board<Size>;
  pieceMap: Record<Colors, PieceMap<Size>>;

  constructor(size: Size, board?: Board<Size>) {
    this.board = board || this.create(size);
    this.pieceMap = (() => {
      return COLORS.reduce<Record<Colors, PieceMap<Size>>>((acc, curr) => {
        acc[curr] = PIECE_TYPES.reduce<PieceMap<Size>>((acc, curr) => {
          acc[curr] = [];
          return acc;
        }, {} as PieceMap<Size>);

        return acc;
      }, {});
    })();
  }

  create(size: Size): Board<Size> {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(null)) as Board<Size>;
  }

  init(board: Board<Size>) {
    if (board.length !== BOARD_SIZE) return;

    const initPositions = [
      'rook',
      'knight',
      'bishop',
      'queen',
      'king',
      'bishop',
      'knight',
      'rook'
    ] as const;

    for (let i = 0; i < initPositions.length; i++) {
      board[0][i] = new Piece(initPositions[i], 'w');
      board[1][i] = new Piece('pawn', 'w');

      board[board.length - 1][i] = new Piece(initPositions[i], 'b');
      board[board.length - 2][i] = new Piece('pawn', 'b');
    }
  }

  pushToPieceMap(
    pieceType: PieceType,
    color: Colors,
    squareIdx: SquareIdx<Size>
  ) {
    this.pieceMap[color][pieceType].push(squareIdx);
  }

  at(square: Square<Files, EnumerateFromOne<Size>>, board = this.board) {
    if (!isSquare(board.length, square)) return;
    return {
      get piece() {
        const squareIdx = convertSquareToIdx(square);
        return board[squareIdx[1]][squareIdx[0]];
      },

      placePiece(piece: Piece) {
        const squareIdx = convertSquareToIdx(square);
        board[squareIdx[1]][squareIdx[0]] = piece;
      },

      remove() {
        const squareIdx = convertSquareToIdx(square);
        board[squareIdx[1]][squareIdx[0]] = null;
      }
    };
  }

  from(s1: Square<Files, EnumerateFromOne<Size>>, board = this.board) {
    if (!isSquare(this.board.length, s1)) return;
    return {
      to: (s2: Square<Files, EnumerateFromOne<Size>>) => {
        if (!isSquare(this.board.length, s2)) return;
        if (s1 === s2) return;

        const s1Idx = convertSquareToIdx(s1);
        const s2Idx = convertSquareToIdx(s2);

        // rank needs to go first
        // index 1 is rank
        const piece = board[s1Idx[1]][s1Idx[0]];
        board[s1Idx[1]][s1Idx[0]] = null;
        board[s2Idx[1]][s2Idx[0]] = piece;
      }
    };
  }

  promote(piece: Piece, newType: Exclude<PieceType, 'pawn'>) {
    piece.type = newType;
  }
}
