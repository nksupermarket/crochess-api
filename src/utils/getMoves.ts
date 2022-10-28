import {
  CastleRights,
  Board,
  CastleSquares,
  Colors,
  Line,
  PieceMap,
  PieceType,
  SquareIdx
} from '../types/types';

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
}): SquareIdx<S>[] {
  const length = Math.sqrt(board.length);
  let lines = {
    diagonal: [length + 1, length - 1, -length + 1, -length - 1],
    xy: [1, -1, length, -length]
  }[dir];

  if (onlyForward) {
    const forward = onlyForward === 'w' ? length : -length;
    lines = lines.filter((l) => l + 2 > forward && l - 2 < forward);
  }

  const moves: SquareIdx<S>[] = [];
  lines.forEach((d) => {
    let rangeForLine = range;
    // can assume move is type SquareIdx because the while loops checks for it anyways
    let move = start + d;
    while (
      rangeForLine &&
      // move is a valid square on the board
      isSquareIdx(board.length as S, move)
    ) {
      const piece = board[move];
      if (!piece) {
        moves.push(move);
      } else if (
        canCapture &&
        // square has piece that isn't same color as piece moving
        piece[0] !== board[start]?.[0]
      ) {
        moves.push(move);
        break;
      } else {
        break;
      }

      // need to stop at the edge of the board
      if (move % length === 0 || move % length === length - 1) break;

      move = move + d;
      rangeForLine--;
    }
  });

  return moves;
}

export const getPieceMoves = <S extends number>(
  pieceType: Exclude<PieceType, 'p' | 'P'>,
  board: Board<S>,
  square: SquareIdx<S>
): SquareIdx<S>[] => {
  switch (pieceType) {
    case 'n': {
      const length = Math.sqrt(board.length);
      const jumps = [
        -2 * length + 1,
        -2 * length - 1,
        2 * length - 1,
        2 * length + 1,
        length + 2,
        length - 2,
        -length + 2,
        -length - 2
      ] as const;

      return jumps.reduce((acc, curr) => {
        const move = square + curr;
        if (isSquareIdx(board.length as S, move)) acc.push(move);
        return acc;
      }, [] as SquareIdx<S>[]);
    }

    case 'b': {
      return getLineMoves({ board, dir: 'diagonal', start: square });
    }

    case 'r': {
      return getLineMoves({ board, dir: 'xy', start: square });
    }

    case 'q': {
      return getLineMoves({ board, dir: 'diagonal', start: square }).concat(
        getLineMoves({ board, dir: 'xy', start: square })
      );
    }

    case 'k': {
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
  const rank = Math.floor(square / Math.sqrt(board.length)) + 1;
  const firstMove =
    (color === 'w' && rank === 2) || (color === 'b' && rank === 7);

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
  }).filter((m) => {
    const piece = board[m];
    // check if it's the same as enpassant square
    return (
      m === enPassant ||
      // check if there's a piece capture
      (piece && piece[0] !== color)
    );
  });

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
  const copy = [...board] as Board<S>;
  copy[kingSquare] = null;

  const kingMoves = getPieceMoves('k', board, kingSquare);
  const allEnemyMoves = getAllMoves<S>(copy, oppPieceMap, oppColor);

  // check if king can castle
  for (const [side, canCastle] of Object.entries(castleRights)) {
    if (!canCastle) continue;

    if (
      // castle squares are not empty or is under control by enemy piece
      !castleSquares[side as 'kingside' | 'queenside'].every((s) => {
        if (!isSquareIdx(board.length, s)) return false;
        if (board[s] !== null) return false;
        return !allEnemyMoves[s];
      })
    )
      continue;

    kingMoves.concat(castleSquares[side as 'kingside' | 'queenside'][1]);
  }

  return kingMoves.filter((s) => allEnemyMoves[s]);
}

function getAllMoves<S extends number>(
  board: Board<S>,
  pieceMap: PieceMap<S>,
  color: Colors
): Record<SquareIdx<S>, true> {
  const allMoves = {} as Record<SquareIdx<S>, true>;
  for (const [type, pieceSquares] of Object.entries(pieceMap)) {
    const pieceType = type as PieceType;
    for (let i = 0; i < pieceSquares.length; i++) {
      const moves =
        pieceType === 'p'
          ? getPawnMoves(board, color, pieceSquares[i])
          : getPieceMoves(pieceType, board, pieceSquares[i]);

      moves.forEach((m) => (allMoves[m] = true));
    }
  }
  return allMoves;
}
