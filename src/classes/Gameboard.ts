import { convertSquareToIdx } from '../utils/square';
import { isSquare } from '../utils/typeCheck';
import {
  Board,
  Colors,
  PieceMap,
  PieceType,
  SquareIdx,
  Piece,
  Side,
  AllPieceMap,
  Square
} from '../types/types';
import { BOARD_SIZE, COLORS, PIECE_TYPES } from '../utils/constants';

export default class Gameboard {
  board: Board;
  pieceMap: AllPieceMap;
  readonly length: number;

  constructor(board?: Board) {
    this.board = board || this.create();
    this.pieceMap = (() => {
      return COLORS.reduce<AllPieceMap>((acc, curr) => {
        acc[curr] = PIECE_TYPES.reduce<PieceMap>((acc, curr) => {
          acc[curr] = [];
          return acc;
        }, {} as PieceMap);

        return acc;
      }, {} as AllPieceMap);
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
    if (this.pieceMap[color][pieceType])
      this.pieceMap[color][pieceType].push(squareIdx);
    else this.pieceMap[color][pieceType] = [squareIdx];
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
    if (!this.pieceMap[color][pieceType].length)
      delete this.pieceMap[color][pieceType];
  }

  at(s: SquareIdx | Square, board = this.board) {
    const idx: SquareIdx = isSquare(s) ? convertSquareToIdx(s) : s;

    return {
      get piece() {
        return board[idx];
      },

      place: (piece: Piece) => {
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

      promote: (newType: Exclude<PieceType, 'k' | 'p'>) => {
        const piece = board[idx];
        if (!piece) return;
        board[idx] = `${piece[0] as Colors}${newType}`;
        this.removeFromPieceMap(piece[1] as PieceType, piece[0] as Colors, idx);
        this.pushToPieceMap(newType, piece[0] as Colors, idx);
      }
    };
  }

  from(s1: SquareIdx | Square, board = this.board) {
    const s1Idx: SquareIdx = isSquare(s1) ? convertSquareToIdx(s1) : s1;

    return {
      to: (s2: SquareIdx | Square) => {
        const s2Idx: SquareIdx = isSquare(s2) ? convertSquareToIdx(s2) : s2;

        if (s1Idx === s2Idx) return;

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

  castle(color: Colors, side: Side, board = this.board) {
    const kingIdx = this.pieceMap[color].k[0];
    const rookIdx = this.pieceMap[color].r.find((s) =>
      side === 'q' ? s < kingIdx : s > kingIdx
    ) as SquareIdx;
    this.from(rookIdx, board).to(
      (side === 'q' ? kingIdx - 1 : kingIdx + 1) as SquareIdx
    );
    this.from(kingIdx, board).to(
      (side === 'q' ? kingIdx - 2 : kingIdx + 2) as SquareIdx
    );
  }
}
