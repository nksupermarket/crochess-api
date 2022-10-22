import {
  Board,
  Colors,
  SquareIdx,
  PieceAbr,
  PieceMap,
  PieceType,
  Enumerate,
  Square,
  Files,
  EnumerateFromOne
} from '../types/types';
import Piece from './Piece';
import {
  BOARD_SIZE,
  COLORS,
  FILES,
  ABR_TO_PIECE_MAP,
  PIECE_TYPES,
  PIECE_TO_ABR_MAP
} from '../utils/constants';

export default class Gameboard<Size extends number> {
  board: Board;
  pieceMap: Record<Colors, PieceMap<Size>>;

  constructor(size: Size) {
    this.board = this.createBoard(size);
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

  createBoard(size: Size): Board {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
  }

  initBoard() {
    if (this.board.length !== BOARD_SIZE) return;

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
      this.board[0][i] = new Piece(initPositions[i], 'w');
      this.board[1][i] = new Piece('pawn', 'w');

      this.board[this.board.length - 1][i] = new Piece(initPositions[i], 'b');
      this.board[this.board.length - 2][i] = new Piece('pawn', 'b');
    }
  }

  pushToPieceMap(
    pieceType: PieceType,
    color: Colors,
    squareIdx: SquareIdx<Size>
  ) {
    this.pieceMap[color][pieceType].push(squareIdx);
  }

  from(s1: Square<Files, EnumerateFromOne<Size>>, board = this.board) {
    return {
      to: (s2: Square<Files, EnumerateFromOne<Size>>) => {
        if (s1 === s2) return;

        const fileAsIdx = {
          s1: FILES.indexOf(s1[0] as Files),
          s2: FILES.indexOf(s2[0] as Files)
        };

        const rankAsIdx = {
          s1: Number(s1[1]) - 1,
          s2: Number(s2[1]) - 1
        };

        const piece = board[rankAsIdx.s1][fileAsIdx.s1];
        board[rankAsIdx.s1][fileAsIdx.s1] = null;
        board[rankAsIdx.s2][fileAsIdx.s2] = piece;
      }
    };
  }

  promote(piece: Piece, newType: Exclude<PieceType, 'pawn'>) {
    piece.type = newType;
  }
}
