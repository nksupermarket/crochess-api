import {
  CastleRights,
  Board,
  CastleSquares,
  Colors,
  Line,
  PieceMap,
  PieceType,
  SquareIdx,
  Square,
  Files,
  Enumerate,
  EnumerateFromOne
} from '../types/types';
import { check1dArrayEquality, copy2dArray } from './misc';
import { convertIdxToSquare } from './square';
import { isSquareIdx } from './typeCheck';

function getLineMoves<S extends number>({
  dir,
  board,
  start,
  range = Infinity,
  canCapture = true,
  onlyForward
}: {
  dir: Line;
  board: Board<S>;
  start: SquareIdx<S>;
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

  const moves: SquareIdx<S>[] = [];
  let move: SquareIdx<S>;
  lines.forEach((d) => {
    let rangeForLine = range;
    move = [start[0] + d[0], start[1] + d[1]] as SquareIdx<S>;
    while (
      rangeForLine &&
      // move is a valid square on the board
      isSquareIdx<S>(board.length as S, move)
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

      move = [
        (move[0] + d[0]) as Enumerate<S>,
        (move[1] + d[1]) as Enumerate<S>
      ];
      rangeForLine--;
    }
  });

  return moves;
}

export const getPieceMoves = <S extends number>(
  pieceType: Exclude<PieceType, 'pawn'>,
  board: Board<S>,
  square: SquareIdx<S>
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

export const getPawnMoves = <S extends number>(
  board: Board<S>,
  color: Colors,
  square: SquareIdx<S>,
  enPassant?: SquareIdx<S>
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
  castleRights: CastleRights,
  castleSquares: CastleSquares<S>,
  board: Board<S>
) {
  if (!isSquareIdx(board.length, kingSquare)) return;

  // need to remove king because rooks/queens/bishops control the square behind the king as well
  const copy = copy2dArray(board) as Board<S>;
  copy[kingSquare[0] as number][kingSquare[1] as number] = null;

  const kingMoves = getPieceMoves('king', board, kingSquare);
  const allEnemyMoves = getAllMoves<S>(copy, oppPieceMap, oppColor);

  // check if king can castle
  for (const [side, canCastle] of Object.entries(castleRights)) {
    if (!canCastle) continue;

    if (
      // castle squares are not empty or is under control by enemy piece
      !castleSquares[side as 'kingside' | 'queenside'].every((s) => {
        if (!isSquareIdx(board.length, s)) return false;

        if (board[s[0]][s[1]] !== null) return false;

        return !allEnemyMoves[convertIdxToSquare<S>(s)];
      })
    )
      continue;

    kingMoves.concat(castleSquares[side as 'kingside' | 'queenside'][1]);
  }

  return kingMoves.filter((s) => allEnemyMoves[convertIdxToSquare<S>(s)]);
}

function getAllMoves<S extends number>(
  board: Board<S>,
  pieceMap: PieceMap<S>,
  color: Colors
): Record<Square<Files, EnumerateFromOne<S>>, true> {
  const allMoves = {} as Record<Square<Files, EnumerateFromOne<S>>, true>;
  for (const [type, pieceSquares] of Object.entries(pieceMap)) {
    const pieceType = type as PieceType;
    for (let i = 0; i < pieceSquares.length; i++) {
      const moves =
        pieceType === 'pawn'
          ? getPawnMoves(board, color, pieceSquares[i])
          : getPieceMoves(pieceType, board, pieceSquares[i]);

      moves.forEach((m) => (allMoves[convertIdxToSquare<S>(m)] = true));
    }
  }
  return allMoves;
}
