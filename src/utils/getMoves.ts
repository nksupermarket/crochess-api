import {
  CastleRights,
  Board,
  CastleSquares,
  Colors,
  PieceMap,
  PieceType,
  SquareIdx,
  Square,
  Files,
  Dir,
  Vector
} from '../types/types';
import {
  ALL_VECTORS,
  BOARD_LENGTH,
  DIAGONAL_VECTORS,
  FILES,
  VECTORS,
  XY_VECTORS
} from './constants';
import { convertIdxToSquare } from './square';
import { isSquareIdx } from './typeCheck';

function traverseAlongVector(
  vector: Vector,
  start: SquareIdx,
  range = Infinity,
  cb: (squareIdx: SquareIdx, breakFn: () => void) => void
) {
  // can assume move is type SquareIdx because the while loops checks for it anyways
  let square = start + vector;
  while (
    range &&
    // move is a valid square on the board
    isSquareIdx(square)
  ) {
    let shouldBreak = false;
    cb(square, () => (shouldBreak = true));
    if (shouldBreak) break;

    // need to stop at the edge of the board
    if (
      square % BOARD_LENGTH === 0 ||
      square % BOARD_LENGTH === BOARD_LENGTH - 1
    )
      break;

    square = square + vector;
    range--;
  }
}

function getLineMoves({
  board,
  start,
  vectors,
  range = Infinity,
  canCapture = true
}: {
  board: Board;
  start: SquareIdx;
  vectors: Vector[];
  range?: number;
  canCapture?: boolean;
}): SquareIdx[] {
  const moves: SquareIdx[] = [];
  vectors.forEach((d) => {
    traverseAlongVector(d, start, range, (move, breakFn) => {
      const piece = board[move];
      if (!piece) {
        moves.push(move);
      } else if (
        canCapture &&
        // square has piece that isn't same color as piece moving
        piece[0] !== board[start]?.[0]
      ) {
        moves.push(move);
        breakFn();
      } else {
        // there is a piece and piece is the same color
        breakFn();
      }
    });
  });

  return moves;
}

export const getPieceMoves = (
  pieceType: Exclude<PieceType, 'p'>,
  board: Board,
  square: SquareIdx,
  pinVector?: Vector
): SquareIdx[] => {
  function filterOutPinVector(v: Vector) {
    const pv = pinVector as Vector;
    return v === pv || v === -pv;
  }
  switch (pieceType) {
    case 'n': {
      if (pinVector) return [];
      const jumps = [
        -2 * BOARD_LENGTH + 1,
        -2 * BOARD_LENGTH - 1,
        2 * BOARD_LENGTH - 1,
        2 * BOARD_LENGTH + 1,
        BOARD_LENGTH + 2,
        BOARD_LENGTH - 2,
        -BOARD_LENGTH + 2,
        -BOARD_LENGTH - 2
      ];

      return jumps.reduce<SquareIdx[]>((acc, curr) => {
        const move = square + curr;
        if (isSquareIdx(move)) acc.push(move);
        return acc;
      }, []);
    }

    case 'b': {
      return getLineMoves({
        board,
        start: square,
        vectors: pinVector
          ? DIAGONAL_VECTORS.filter(filterOutPinVector)
          : DIAGONAL_VECTORS
      });
    }

    case 'r': {
      return getLineMoves({
        board,
        vectors: pinVector ? XY_VECTORS.filter(filterOutPinVector) : XY_VECTORS,
        start: square
      });
    }

    case 'q': {
      return getLineMoves({
        board,
        vectors: pinVector
          ? ALL_VECTORS.filter(filterOutPinVector)
          : ALL_VECTORS,
        start: square
      });
    }

    case 'k': {
      return getLineMoves({
        board,
        vectors: pinVector
          ? ALL_VECTORS.filter(filterOutPinVector)
          : ALL_VECTORS,
        start: square,
        range: 1
      });
    }

    default:
      return [];
  }
};

export const getPawnMoves = (
  board: Board,
  color: Colors,
  square: SquareIdx,
  enPassant?: SquareIdx,
  pinVector?: Vector
) => {
  const rank = Math.floor(square / Math.sqrt(board.length)) + 1;
  const firstMove =
    (color === 'w' && rank === 2) || (color === 'b' && rank === 7);
  const forwardDir = color === 'w' ? 'up' : 'down';

  const regMoves = getLineMoves({
    board,
    vectors:
      pinVector && Math.abs(VECTORS[forwardDir]) !== Math.abs(pinVector)
        ? []
        : [VECTORS[forwardDir]],
    start: square,
    range: firstMove ? 2 : 1,
    canCapture: false
  });

  const captureVectors = [
    VECTORS[`${forwardDir} left`],
    VECTORS[`${forwardDir} right`]
  ];
  const captureMoves = getLineMoves({
    board,
    start: square,
    vectors: pinVector
      ? captureVectors.filter((v) => v === pinVector || v === -pinVector)
      : captureVectors,
    range: 1
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

export function getLegalKingMoves(
  kingSquare: SquareIdx,
  oppColor: Colors,
  oppPieceMap: PieceMap,
  castleRights: CastleRights,
  castleSquares: CastleSquares,
  board: Board
) {
  // need to remove king because rooks/queens/bishops control the square behind the king as well
  const copy = [...board] as Board;
  copy[kingSquare] = null;

  const kingMoves = getPieceMoves('k', board, kingSquare);
  const allEnemyMoves = getAllMoves(copy, oppPieceMap, oppColor);

  // check if king can castle
  for (const [side, canCastle] of Object.entries(castleRights)) {
    if (!canCastle) continue;

    if (
      // castle squares are not empty or is under control by enemy piece
      castleSquares[side as 'kingside' | 'queenside'].some((s) => {
        if (board[s] !== null) return true;
        return !!allEnemyMoves[s];
      })
    )
      continue;

    kingMoves.concat(castleSquares[side as 'kingside' | 'queenside'][1]);
  }

  return kingMoves.filter((s) => !!allEnemyMoves[s]);
}

function getAllMoves(
  board: Board,
  pieceMap: PieceMap,
  color: Colors
): Record<SquareIdx, true> {
  const allMoves = {} as Record<SquareIdx, true>;
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

function getPossiblePinDirection(
  pieceIdx: SquareIdx,
  kingIdx: SquareIdx
): Dir | undefined {
  // check if king lies along the same line as piece
  // get the direction of the king eg. left, right, up, down, or diagonal
  // return the the opposite direction ie. if king is to the left of the piece, return right

  const pieceSquare = convertIdxToSquare(pieceIdx);
  const kingSquare: Square = convertIdxToSquare(kingIdx);

  if (pieceSquare[0] === kingSquare[0]) {
    // squares are on same file
    return Number(pieceSquare[1]) > Number(kingSquare[1]) ? 'up' : 'down';
  }

  if (pieceSquare[1] === kingSquare[1]) {
    return pieceSquare[0] > kingSquare[0] ? 'right' : 'left';
  }

  // finding if
  const rankDiff = Number(pieceSquare[1]) - Number(kingSquare[1]);

  const fileDiff =
    FILES.indexOf(pieceSquare[0] as Files) -
    FILES.indexOf(kingSquare[0] as Files);

  if (Math.abs(rankDiff) !== Math.abs(fileDiff)) return;

  let diagDir = '';
  if (rankDiff > 0) diagDir += 'up';
  else diagDir += 'down';
  if (fileDiff > 0) diagDir += ' right';
  else diagDir += ' left';

  return diagDir as Dir;
}

function isPiecePinned(
  square: SquareIdx,
  kingSquare: SquareIdx,
  oppPieceMap: PieceMap
): Vector | undefined {
  const dirOfPin = getPossiblePinDirection(square, kingSquare);
  if (!dirOfPin) return undefined;

  const isDiagonal = dirOfPin.includes(' ');
  const pinPieceType = isDiagonal ? 'b' : 'r';
  // vectors represented as an offset

  const pinVector = VECTORS[dirOfPin];

  type VectorMap = { [key in SquareIdx]?: boolean };
  const vectorMap: VectorMap = {};
  traverseAlongVector(pinVector, square, Infinity, (squareIdx) => {
    vectorMap[squareIdx] = true;
  });

  return oppPieceMap[pinPieceType].some((s: SquareIdx) => vectorMap[s])
    ? pinVector
    : undefined;
}

export function getLegalMoves(
  pieceType: Exclude<PieceType, 'k'>,
  board: Board,
  color: Colors,
  square: SquareIdx,
  kingSquare: SquareIdx,
  oppPieceMap: PieceMap,
  enPassant?: SquareIdx
): SquareIdx[] {
  const pinVector = isPiecePinned(square, kingSquare, oppPieceMap);
  return pieceType === 'p'
    ? getPawnMoves(board, color, square, enPassant, pinVector)
    : getPieceMoves(pieceType, board, square, pinVector);
}
