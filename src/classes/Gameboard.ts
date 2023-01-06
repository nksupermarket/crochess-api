import { convertSquareToIdx } from '../utils/square';
import {
  Board,
  Colors,
  PieceType,
  SquareIdx,
  Piece,
  Side,
  AllPieceMap,
  Square,
  PromotePieceType
} from '../types/types';
import { BOARD_IDX, BOARD_LENGTH } from '../utils/constants';
import { createBoard } from '../utils/board';
import { buildPieceMap, getEmptyPieceMap } from '../utils/pieceMap';

export default class Gameboard {
  board: Board;
  pieceMap: AllPieceMap;
  readonly length: number;

  // board is a 10x12 1d array with padding to serve as sentinel values
  constructor(board?: Board) {
    this.board = board || createBoard();
    this.pieceMap = board ? buildPieceMap(board) : getEmptyPieceMap();
    // have to bind this method because Game calls super on this function
    this.at = this.at.bind(this);
  }

  pushToPieceMap = (
    pieceType: PieceType,
    color: Colors,
    squareIdx: SquareIdx
  ) => {
    if (pieceType in this.pieceMap[color]) {
      this.pieceMap[color][pieceType]?.push(squareIdx);
      this.pieceMap[color][pieceType]?.sort();
    } else this.pieceMap[color][pieceType] = [squareIdx];
  };

  moveInPieceMap = (
    pieceType: PieceType,
    color: Colors,
    start: SquareIdx,
    end: SquareIdx
  ) => {
    const pieceSquares = this.pieceMap[color][pieceType];
    if (typeof pieceSquares !== 'undefined')
      this.pieceMap[color][pieceType] = pieceSquares.map((s) => {
        if (s !== start) return s;
        return end;
      });
  };

  removeFromPieceMap = (
    pieceType: PieceType,
    color: Colors,
    squareIdx: SquareIdx
  ) => {
    const pieceSquares = this.pieceMap[color][pieceType];
    if (typeof pieceSquares !== 'undefined')
      this.pieceMap[color][pieceType] = pieceSquares.filter(
        (s) => s !== squareIdx
      );

    if (!this.pieceMap[color][pieceType]?.length)
      delete this.pieceMap[color][pieceType];
  };

  at(s: SquareIdx | Square, board = this.board) {
    const idx: SquareIdx = typeof s === 'string' ? convertSquareToIdx(s) : s;
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

      promote: (newType: PromotePieceType) => {
        const piece = board[idx];
        if (!piece) return;
        board[idx] = `${piece[0] as Colors}${newType}`;
        this.removeFromPieceMap(piece[1] as PieceType, piece[0] as Colors, idx);
        this.pushToPieceMap(newType, piece[0] as Colors, idx);
      }
    };
  }

  from = (s1: SquareIdx | Square, board = this.board) => {
    const s1Idx: SquareIdx =
      typeof s1 === 'string' ? convertSquareToIdx(s1) : s1;

    return {
      to: (s2: SquareIdx | Square) => {
        const s2Idx: SquareIdx =
          typeof s2 === 'string' ? convertSquareToIdx(s2) : s2;

        if (s1Idx === s2Idx) return;

        const piece = board[s1Idx];
        if (!piece) return;
        const capture = board[s2Idx];
        if (capture)
          this.removeFromPieceMap(
            capture[1] as PieceType,
            capture[0] as Colors,
            s2Idx
          );
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
  };

  castle = (color: Colors, side: Side, board = this.board) => {
    const kingIdx = this.pieceMap[color].k[0];
    const rookIdx = this.pieceMap[color].r?.find((s) =>
      side === 'q' ? s < kingIdx : s > kingIdx
    ) as SquareIdx;
    if (typeof rookIdx !== 'number') return;
    this.from(rookIdx, board).to(
      (side === 'q' ? kingIdx - 1 : kingIdx + 1) as SquareIdx
    );
    this.from(kingIdx, board).to(
      (side === 'q' ? kingIdx - 2 : kingIdx + 2) as SquareIdx
    );
  };

  isPromoteSquare(color: Colors, square: Square) {
    const sIdx = convertSquareToIdx(square);
    const newRank = Math.floor(BOARD_IDX.indexOf(sIdx) / BOARD_LENGTH);
    const promoteRank = color === 'w' ? 7 : 0;
    return newRank === promoteRank;
  }
}
