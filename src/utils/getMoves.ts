import {
  Board,
  Colors,
  Line,
  PieceMap,
  PieceType,
  SquareIdx
} from '../types/types';
import { check1dArrayEquality } from './misc';
import { isSquareIdx } from './typeCheck';

function getLineMoves<N extends number>({
  dir,
  board,
  start,
  range = Infinity,
  canCapture = true,
  onlyForward
}: {
  dir: Line;
  board: Board;
  start: SquareIdx<N>;
  range?: number;
  canCapture?: boolean;
  onlyForward?: Colors;
}) {
  let lines = {
    diagonal: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ],
    xy: [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]
    ]
  }[dir];

  if (onlyForward) {
    const forward = onlyForward === 'w' ? 1 : -1;
    lines = lines.filter((l) => l[0] === forward);
  }

  const moves: SquareIdx<N>[] = [];
  let move;
  lines.forEach((d) => {
    let rangeForLine = range;
    move = [start[0] + d[0], start[1] + d[1]];
    while (
      rangeForLine &&
      // move is a valid square on the board
      isSquareIdx(board.length, move)
    ) {
      const square = board[move[0]][move[1]];
      if (square === null) {
        moves.push(move);
      } else if (
        canCapture &&
        // square has piece that isn't same color as piece moving
        square.color !== board[start[0] as number][start[1] as number]?.color
      ) {
        moves.push(move);
        break;
      } else {
        break;
      }

      move = [move[0] + d[0], move[1] + d[1]];
      rangeForLine--;
    }
  });

  return moves;
}

export const getPieceMoves = <N extends number>(
  pieceType: Exclude<PieceType, 'pawn'>,
  board: Board,
  square: SquareIdx<N>
) => {
  switch (pieceType) {
    case 'knight': {
      const knightJumps = [
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1]
      ] as const;

      return knightJumps.reduce((acc, curr) => {
        const move = [square[0] + curr[0], square[1] + curr[1]];
        if (isSquareIdx(board.length, move)) acc.push(move);
        return acc;
      }, [] as SquareIdx<typeof board.length>[]);
    }

    case 'bishop': {
      return getLineMoves({ board, dir: 'diagonal', start: square });
    }

    case 'rook': {
      return getLineMoves({ board, dir: 'xy', start: square });
    }

    case 'queen': {
      return getLineMoves({ board, dir: 'diagonal', start: square }).concat(
        getLineMoves({ board, dir: 'xy', start: square })
      );
    }

    case 'king': {
      return getLineMoves({
        board,
        dir: 'diagonal',
        start: square,
        range: 1
      }).concat(getLineMoves({ board, dir: 'xy', start: square, range: 1 }));
    }

    default:
      return [];
  }
};

export const getPawnMoves = <N extends number>(
  board: Board,
  color: Colors,
  square: SquareIdx<N>,
  enPassant?: SquareIdx<N>
) => {
  const firstMove =
    (color === 'w' && square[0] === 1) || (color === 'b' && square[0] === 6);

  const regMoves = getLineMoves({
    board,
    start: square,
    dir: 'xy',
    range: firstMove ? 2 : 1,
    onlyForward: color,
    canCapture: false
  });

  const captureMoves = getLineMoves({
    board,
    start: square,
    dir: 'diagonal',
    range: 1,
    onlyForward: color
  }).filter(
    (m) =>
      // check if it's the same as enpassant square
      check1dArrayEquality(m, enPassant || []) ||
      // check if there's a piece capture
      (board[m[0] as number][m[1] as number] &&
        board[m[0] as number][m[1] as number]?.color !== color)
  );

  return regMoves.concat(captureMoves);
};

export function getValidKingMoves<S extends number>(
  kingSquare: SquareIdx<S>,
  oppColor: Colors,
  oppPieceMap: PieceMap<S>,
  board: Board
) {
  const kingMoves = getPieceMoves('king', board, kingSquare);

  return kingMoves.filter(
    (m) => !doesPieceHitSquare(board, square, oppPieceMap, oppColor)
  );
}

function doesPieceHitSquare(
  board: Board,
  square: SquareIdx<typeof board.length>,
  pieceMap: PieceMap<typeof board.length>,
  color: Colors
) {
  for (const [type, pieceSquares] of Object.entries(pieceMap)) {
    const pieceType = type as PieceType;
    for (let i = 0; i < pieceSquares.length; i++) {
      // for each piece check if their moves includes target
      const moves =
        pieceType === 'pawn'
          ? getPawnMoves(board, color, square)
          : getPieceMoves(pieceType, board, square);

      if (moves.find((m) => check1dArrayEquality(m, square))) return true;
    }
  }

  return false;
}
