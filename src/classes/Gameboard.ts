import {
  Board,
  Colors,
  SquareIdx,
  PieceAbr,
  PieceMap,
  PieceType,
  Enumerate
} from '../types/types';
import Piece from './Piece';
import {
  BOARD_SIZE,
  COLORS,
  PIECE_ABR_MAP,
  PIECE_TYPES
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
      'bishop',
      'rook'
    ] as const;

    for (let i = 0; i < initPositions.length; i++) {
      this.board[i][0] = new Piece(initPositions[i], 'w');
      this.board[i][1] = new Piece('pawn', 'w');

      this.board[i][this.board.length - 1] = new Piece(initPositions[i], 'b');
      this.board[i][this.board.length - 2] = new Piece('pawn', 'b');
    }
  }

  pushToPieceMap(
    pieceType: PieceType,
    color: Colors,
    squareIdx: SquareIdx<Size>
  ) {
    this.pieceMap[color][pieceType].push(squareIdx);
  }

  convertFromFen(
    fen: string,
    cb?: (
      pieceType: PieceType,
      color: Colors,
      squareIdx: SquareIdx<Size>
    ) => void
  ): any {
    const split = fen.split(' ');
    const [board, activeColor, castleRights, enPassant, halfmoves, fullmoves] =
      split;

    // convert board
    const splitIntoRanks = board.split('/');
    const convertedBoard = splitIntoRanks.reduce<Board>((acc, curr, idx) => {
      // iterate over the string representation of the rank
      // for each character, adjust the rank accordingly

      let rank: (Piece | null)[] = [];
      for (let i = 0; i < curr.length; i++) {
        if (Number(curr[i])) {
          rank = rank.concat(Array(Number(curr[i])).fill(null));
          continue;
        }

        if (curr[i].toLowerCase() === curr[i]) {
          rank.push(new Piece(PIECE_ABR_MAP[curr[i] as PieceAbr], 'b'));
          cb &&
            cb(PIECE_ABR_MAP[curr[i] as PieceAbr], 'b', [
              idx as Enumerate<Size>,
              i as Enumerate<Size>
            ]);
        } else {
          rank.push(
            new Piece(PIECE_ABR_MAP[curr[i].toLowerCase() as PieceAbr], 'w')
          );
          cb &&
            cb(PIECE_ABR_MAP[curr[i] as PieceAbr], 'w', [
              idx as Enumerate<Size>,
              i as Enumerate<Size>
            ]);
        }
      }

      acc.push(rank);
      return acc;
    }, [] as Board);

    return {
      activeColor,
      castleRights,
      enPassant,
      halfmoves,
      fullmoves,
      board: convertedBoard.reverse()
    };
  }
}
