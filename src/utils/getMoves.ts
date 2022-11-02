import {
  CastleRights,
  Board,
  Colors,
  PieceMap,
  PieceType,
  SquareIdx,
  Files,
  Dir,
  Vector,
  Range,
  SquareMap,
  Tuple,
  AllPieceMap
} from '../types/types';
import {
  ALL_VECTORS,
  BOARD_LENGTH,
  DIAGONAL_VECTORS,
  FILES,
  KNIGHT_JUMPS,
  OPP_COLOR,
  VECTORS,
  XY_VECTORS
} from './constants';
import { convertIdxToSquare } from './square';
import { isSquareIdx } from './typeCheck';

function traverseAlongVector(
  vector: Vector,
  start: SquareIdx,
  range: Range,
  cb: (sIdx: SquareIdx, breakLoop: () => void, distance: Range) => void
) {
  // can assume move is type SquareIdx because the while loops checks for it anyways
  let square = start + vector;
  while (
    range &&
    // move is a valid square on the board
    isSquareIdx(square)
  ) {
    let shouldBreak = false;
    cb(square, () => (shouldBreak = true), (BOARD_LENGTH - range + 1) as Range);
    if (shouldBreak) break;

    // need to stop at the edge of the board
    const endOfBoard =
      vector === VECTORS.up || vector === VECTORS.down
        ? square <= 7 || square >= 56
        : square % BOARD_LENGTH === 0 ||
          square % BOARD_LENGTH === BOARD_LENGTH - 1;
    if (endOfBoard) break;

    square = square + vector;
    range--;
  }
}

function getLineMoves({
  board,
  start,
  vectors,
  range = BOARD_LENGTH,
  canCapture = true,
  includeOwnPieces = false
}: {
  board: Board;
  start: SquareIdx;
  vectors: Vector[];
  range?: Range;
  canCapture?: boolean;
  includeOwnPieces?: boolean;
}): SquareIdx[] {
  const moves: SquareIdx[] = [];
  vectors.forEach((d) => {
    traverseAlongVector(d, start, range, (move, breakLoop) => {
      const piece = board[move];
      if (!piece) {
        moves.push(move);
      } else if (
        // square has piece that isn't same color as piece moving
        piece &&
        (includeOwnPieces || (canCapture && piece[0] !== board[start]?.[0]))
      ) {
        moves.push(move);
        breakLoop();
      } else {
        // there is a piece and piece is the same color
        breakLoop();
      }
    });
  });

  return moves;
}

export const getPieceMoves = (
  pieceType: Exclude<PieceType, 'p'>,
  board: Board,
  pIdx: SquareIdx,
  pinVector?: Vector,
  includeOwnPieces?: boolean
): SquareIdx[] => {
  function filterOutPinVector(v: Vector) {
    const pv = pinVector as Vector;
    return v === pv || v === -pv;
  }
  switch (pieceType) {
    case 'n': {
      if (pinVector) return [];

      return KNIGHT_JUMPS.reduce<SquareIdx[]>((acc, curr) => {
        const move = pIdx + curr;
        if (!isSquareIdx(move)) return acc;
        if (
          !board[move] ||
          includeOwnPieces ||
          board[move]?.[0] !== board[pIdx]?.[0]
        )
          acc.push(move);
        return acc;
      }, []);
    }

    case 'b': {
      return getLineMoves({
        board,
        includeOwnPieces,
        start: pIdx,
        vectors: pinVector
          ? DIAGONAL_VECTORS.filter(filterOutPinVector)
          : DIAGONAL_VECTORS
      });
    }

    case 'r': {
      return getLineMoves({
        board,
        includeOwnPieces,
        vectors: pinVector ? XY_VECTORS.filter(filterOutPinVector) : XY_VECTORS,
        start: pIdx
      });
    }

    case 'q': {
      return getLineMoves({
        board,
        includeOwnPieces,
        vectors: pinVector
          ? ALL_VECTORS.filter(filterOutPinVector)
          : ALL_VECTORS,
        start: pIdx
      });
    }

    case 'k': {
      return getLineMoves({
        board,
        vectors: pinVector
          ? ALL_VECTORS.filter(filterOutPinVector)
          : ALL_VECTORS,
        start: pIdx,
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
  pIdx: SquareIdx,
  enPassant?: SquareIdx,
  pinVector?: Vector
) => {
  const rank = Math.floor(pIdx / Math.sqrt(board.length)) + 1;
  const firstMove =
    (color === 'w' && rank === 2) || (color === 'b' && rank === 7);
  const forwardDir = color === 'w' ? 'up' : 'down';

  const regMoves = getLineMoves({
    board,
    vectors:
      pinVector && Math.abs(VECTORS[forwardDir]) !== Math.abs(pinVector)
        ? []
        : [VECTORS[forwardDir]],
    start: pIdx,
    range: firstMove ? 2 : 1,
    canCapture: false
  });

  const captureVectors = [
    VECTORS[`${forwardDir} left`],
    VECTORS[`${forwardDir} right`]
  ];
  const captureMoves = getLineMoves({
    board,
    start: pIdx,
    vectors: pinVector
      ? captureVectors.filter((v) => v === pinVector || v === -pinVector)
      : captureVectors,
    range: 1
  }).filter((m) => {
    const piece = board[m];
    // check if it's the same as enpassant pIdx
    return (
      m === enPassant ||
      // check if there's a piece capture
      (piece && piece[0] !== color)
    );
  });

  return regMoves.concat(captureMoves);
};

export function getChecks(
  oppColor: Colors,
  kIdx: SquareIdx,
  board: Board
): Tuple<SquareIdx, 0 | 1 | 2> {
  const checks: SquareIdx[] = [];
  for (let i = 0; i < KNIGHT_JUMPS.length; i++) {
    const pIdx = kIdx + KNIGHT_JUMPS[i];
    const piece = board[pIdx];
    if (piece === `${oppColor}n`) checks.push(pIdx as SquareIdx);
  }

  for (let i = 0; i < XY_VECTORS.length; i++) {
    traverseAlongVector(
      XY_VECTORS[i],
      kIdx,
      BOARD_LENGTH,
      (pIdx, breakLoop) => {
        const piece = board[pIdx];
        if (piece === `${oppColor}q` || piece === `${oppColor}r`) {
          checks.push(pIdx as SquareIdx);
          breakLoop();
        } else if (piece) breakLoop();
      }
    );
  }

  for (let i = 0; i < DIAGONAL_VECTORS.length; i++) {
    traverseAlongVector(
      DIAGONAL_VECTORS[i],
      kIdx,
      BOARD_LENGTH,
      (pIdx, breakLoop, distance) => {
        const piece = board[pIdx];

        if (
          piece === `${oppColor}q` ||
          piece === `${oppColor}b` ||
          // pawn capture
          (piece === `${oppColor}p` &&
            distance === 1 &&
            // need to reverse direction because you start from the square of the piece
            (oppColor === 'w'
              ? DIAGONAL_VECTORS[i] < 0
              : DIAGONAL_VECTORS[i] > 0))
        ) {
          checks.push(pIdx as SquareIdx);
          breakLoop();
        } else if (piece) breakLoop();
      }
    );
  }

  return checks as Tuple<SquareIdx, 0 | 1 | 2>;
}

function getSquaresControlledByPawn(
  board: Board,
  color: Colors,
  pIdx: SquareIdx
) {
  const forwardDir = color === 'w' ? 'up' : 'down';
  return getLineMoves({
    board,
    start: pIdx,
    vectors: [VECTORS[`${forwardDir} left`], VECTORS[`${forwardDir} right`]],
    range: 1,
    includeOwnPieces: true
  });
}

function getSquaresControlledBy(
  color: Colors,
  board: Board,
  pieceMap: PieceMap
): SquareMap {
  const allMoves: SquareMap = {};
  for (const [type, pieceSquares] of Object.entries(pieceMap)) {
    const pieceType = type as PieceType;
    for (let i = 0; i < pieceSquares.length; i++) {
      const moves =
        pieceType === 'p'
          ? getSquaresControlledByPawn(board, color, pieceSquares[i])
          : getPieceMoves(pieceType, board, pieceSquares[i], undefined, true);

      moves.forEach((m) => (allMoves[m] = true));
    }
  }

  return allMoves;
}

export function getLegalKingMoves(
  kingIdx: SquareIdx,
  oppPieceMap: PieceMap,
  castleRights: CastleRights,
  board: Board
) {
  // need to remove king because rooks/queens/bishops control the square behind the king as well
  const copy = [...board] as Board;
  copy[kingIdx] = null;

  let kingMoves = getPieceMoves('k', board, kingIdx);
  const allEnemyMoves = getSquaresControlledBy(
    OPP_COLOR[board[kingIdx]?.[0] as Colors],
    copy,
    oppPieceMap
  );
  const castleSquares: Record<'k' | 'q', SquareIdx[]> = {
    k: [kingIdx + 1, kingIdx + 2] as SquareIdx[],
    q: [kingIdx - 1, kingIdx - 2] as SquareIdx[]
  };
  // check if king can castle
  for (const [side, canCastle] of Object.entries(castleRights)) {
    if (!canCastle) continue;

    if (
      // castle squares are not empty or is under control by enemy piece
      castleSquares[side as 'k' | 'q'].some((s) => {
        if (board[s] !== null) return true;
        return s in allEnemyMoves;
      })
    )
      continue;

    kingMoves = kingMoves.concat(castleSquares[side as 'k' | 'q'][1]);
  }

  return kingMoves.filter((s) => !(s in allEnemyMoves));
}

function getDirOfS1FromS2(s1Idx: SquareIdx, s2Idx: SquareIdx): Dir | undefined {
  // check if squares lies along the same line
  // figure out direction of s2 in relation to s1 eg. s1 is to right of s2

  const s1 = convertIdxToSquare(s1Idx);
  const s2 = convertIdxToSquare(s2Idx);

  if (s1[0] === s2[0]) {
    // squares are on same file
    return Number(s1[1]) > Number(s2[1]) ? 'up' : 'down';
  }

  if (s1[1] === s2[1]) {
    return s1[0] > s2[0] ? 'right' : 'left';
  }

  // finding if
  const rankDiff = Number(s1[1]) - Number(s2[1]);

  const fileDiff =
    FILES.indexOf(s1[0] as Files) - FILES.indexOf(s2[0] as Files);

  if (Math.abs(rankDiff) !== Math.abs(fileDiff)) return;

  let diagDir = '';
  if (rankDiff > 0) diagDir += 'up';
  else diagDir += 'down';
  if (fileDiff > 0) diagDir += ' right';
  else diagDir += ' left';

  return diagDir as Dir;
}

function getSquaresAlongDir(
  vector: Vector,
  start: SquareIdx,
  cb?: (sIdx: SquareIdx, breakLoop: () => void) => void
) {
  const vectorMap: SquareMap = {};
  traverseAlongVector(vector, start, BOARD_LENGTH, (sIdx, breakLoop) => {
    vectorMap[sIdx] = true;
    cb && cb(sIdx, breakLoop);
  });
  return vectorMap;
}

function getSquaresBetweenTwoSquares(s1Idx: SquareIdx, s2Idx: SquareIdx) {
  const dir = getDirOfS1FromS2(s1Idx, s2Idx);
  if (!dir) return;

  return getSquaresAlongDir(VECTORS[dir], s2Idx, (sIdx, breakLoop) => {
    // dont want to include s1Idx
    if (sIdx === s1Idx - VECTORS[dir]) breakLoop();
  });
}

function isPiecePinned(
  sIdx: SquareIdx,
  kingIdx: SquareIdx,
  oppColor: Colors,
  board: Board
): Vector | undefined {
  // returns undefined because pin vector is an optional parameter
  const dirOfPin = getDirOfS1FromS2(sIdx, kingIdx);
  if (!dirOfPin) return undefined;

  const isDiagonal = dirOfPin.includes(' ');
  const pinPieceType = isDiagonal ? 'b' : 'r';
  // vectors represented as an offset
  const pinVector = VECTORS[dirOfPin];
  let pinned = false;
  traverseAlongVector(pinVector, sIdx, BOARD_LENGTH, (mIdx, breakLoop) => {
    if (
      board[mIdx] === `${oppColor}${pinPieceType}` ||
      board[mIdx] === `${oppColor}q`
    ) {
      pinned = true;
      breakLoop();
    }
  });

  return pinned ? pinVector : undefined;
}

export function getLegalMoves(
  pieceType: Exclude<PieceType, 'k'>,
  board: Board,
  color: Colors,
  sIdx: SquareIdx,
  kingIdx: SquareIdx,
  check: SquareIdx[],
  enPassant?: SquareIdx
): SquareIdx[] {
  if (check.length === 2) return [];

  const oppColor = color === 'w' ? 'b' : 'w';
  const pinVector = isPiecePinned(sIdx, kingIdx, oppColor, board);
  const moves =
    pieceType === 'p'
      ? getPawnMoves(board, color, sIdx, enPassant, pinVector)
      : getPieceMoves(pieceType, board, sIdx, pinVector);

  if (check.length === 0) return moves;

  // check length is 1
  const block = getSquaresBetweenTwoSquares(kingIdx, check[0]) as SquareMap;
  // can also capture piece
  block[check[0]] = true;
  return moves.filter((s) => s in block);
}

export function getMovesForColor(
  board: Board,
  pieceMap: AllPieceMap,
  color: Colors,
  enPassant: SquareIdx | null,
  castleRights: CastleRights,
  check: SquareIdx[]
): SquareMap {
  const allMoves: SquareMap = {};
  const oppColor = OPP_COLOR[color];
  for (const [type, pieceSquares] of Object.entries(pieceMap[color])) {
    const pieceType = type as PieceType;
    for (let i = 0; i < pieceSquares.length; i++) {
      const moves =
        pieceType === 'k'
          ? getLegalKingMoves(
              pieceSquares[0],
              pieceMap[oppColor],
              castleRights,
              board
            )
          : getLegalMoves(
              pieceType,
              board,
              color,
              pieceSquares[i],
              pieceMap[color].k[0],
              check,
              enPassant || undefined
            );

      moves.forEach((m) => (allMoves[m] = true));
    }
  }
  return allMoves;
}

export const exportedForTesting = {
  isPiecePinned,
  getSquaresBetweenTwoSquares
};
