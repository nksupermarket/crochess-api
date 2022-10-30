import { getLegalKingMoves, getLegalMoves } from 'src/utils/getMoves';
import {
  Board,
  Colors,
  PieceMap,
  PieceType,
  SquareIdx,
  Piece,
  CastleRights,
  Side
} from '../types/types';
import { BOARD_SIZE, COLORS, OPP_COLOR, PIECE_TYPES } from '../utils/constants';

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

  at(idx: SquareIdx, board = this.board) {
    return {
      get piece() {
        return board[idx];
      },

      moves: ({
        enPassant,
        castleRights
      }: {
        enPassant: SquareIdx | null;
        castleRights: CastleRights;
      }) => {
        const piece = board[idx];
        if (!piece) return null;
        if (piece[1] !== 'k') {
          return getLegalMoves(
            piece[1] as Exclude<PieceType, 'k'>,
            board,
            piece[0] as Colors,
            idx,
            this.pieceMap[piece[0] as Colors].k[0],
            enPassant || undefined
          );
        } else {
          return getLegalKingMoves(
            this.pieceMap[piece[0] as Colors].k[0],
            OPP_COLOR[piece[0] as Colors],
            this.pieceMap[OPP_COLOR[piece[0] as Colors]],
            castleRights,
            board
          );
        }
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

  from(s1Idx: SquareIdx, board = this.board) {
    return {
      to: (s2Idx: SquareIdx) => {
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

  castle(color: Colors, side: Side) {
    const kingIdx = this.pieceMap[color].k[0];
    const rookIdx = this.pieceMap[color].r.find((s) =>
      side === 'q' ? s < kingIdx : s > kingIdx
    ) as SquareIdx;
    this.from(rookIdx).to(
      (side === 'q' ? kingIdx - 1 : kingIdx + 1) as SquareIdx
    );
    this.from(kingIdx).to(
      (side === 'q' ? kingIdx - 2 : kingIdx + 2) as SquareIdx
    );
  }
}
