import {
  AllPieceMap,
  Square,
  Colors,
  PieceType,
  SquareIdx,
  Piece,
  PromotePieceType,
  PieceMap,
  Side,
  Board,
  FenStr,
  EnumerateFromOne
} from './types/types';
import { GameState, MoveDetailsInterface } from './types/interfaces';
import {
  getLegalPieceMoves,
  getLegalKingMoves,
  getChecks,
  getMovesForColor
} from './utils/getMoves';
import { OPP_COLOR, BOARD_IDX, BOARD_LENGTH, VECTORS } from './utils/constants';
import { convertSquareToIdx } from './utils/square';
import {
  pushToPieceMap,
  moveInPieceMap,
  removeFromPieceMap
} from './utils/pieceMap';
import { isFenStr } from './utils/typeCheck';

function move(s1: SquareIdx | Square, board: Board, pieceMap?: AllPieceMap) {
  const s1Idx: SquareIdx = typeof s1 === 'string' ? convertSquareToIdx(s1) : s1;

  return {
    to: (s2: SquareIdx | Square) => {
      const s2Idx: SquareIdx =
        typeof s2 === 'string' ? convertSquareToIdx(s2) : s2;

      if (s1Idx === s2Idx) return;

      const piece = board[s1Idx];
      if (!piece) return;

      board[s1Idx] = null;
      board[s2Idx] = piece;
      if (pieceMap) {
        const capture = board[s2Idx];

        if (capture) removeFromPieceMap(pieceMap, capture, s2Idx);
        moveInPieceMap(pieceMap, piece, s1Idx, s2Idx);
      }
    }
  };
}

export function getLegalMoves(
  square: Square,
  gameState: Omit<GameState, 'halfmoves' | 'fullmoves'>,
  pieceMap: AllPieceMap,
  checks: SquareIdx[]
) {
  const sIdx = convertSquareToIdx(square);
  const piece = gameState.board[sIdx];
  if (!piece) return null;
  const oppColor = OPP_COLOR[piece[0] as Colors];
  if (piece[1] === 'k') {
    return getLegalKingMoves(
      pieceMap[piece[0] as Colors].k[0],
      piece[0] as Colors,
      pieceMap[oppColor],
      gameState.castleRights[piece[0] as Colors],
      gameState.board
    );
  } else {
    return getLegalPieceMoves(
      piece[1] as Exclude<PieceType, 'k'>,
      gameState.board,
      piece[0] as Colors,
      sIdx,
      pieceMap[piece[0] as Colors].k[0],
      checks,
      gameState.enPassant || undefined
    );
  }
}

function castle(pieceMap: PieceMap, side: Side, board: Board) {
  const kingIdx = pieceMap.k[0];
  const rookIdx = pieceMap.r?.find((s) =>
    side === 'q' ? s < kingIdx : s > kingIdx
  ) as SquareIdx;
  if (typeof rookIdx !== 'number') return;
  move(rookIdx, board).to(
    (side === 'q' ? kingIdx - 1 : kingIdx + 1) as SquareIdx
  );
  move(kingIdx, board).to(
    (side === 'q' ? kingIdx - 2 : kingIdx + 2) as SquareIdx
  );
}

function promote(
  board: Board,
  sIdx: SquareIdx,
  newType: PromotePieceType,
  pieceMap: AllPieceMap
) {
  const piece = board[sIdx];
  if (!piece) return;
  board[sIdx] = `${piece[0] as Colors}${newType}`;
  removeFromPieceMap(pieceMap, board[sIdx] as Piece, sIdx);
  pushToPieceMap(pieceMap, board[sIdx] as Piece, sIdx);
}

export function makeMove(
  from: Square,
  to: Square,
  gameState: GameState,
  pieceMap: AllPieceMap,
  promoteType?: PromotePieceType
): MoveDetailsInterface | undefined {
  const fromIdx = convertSquareToIdx(from);
  const toIdx = convertSquareToIdx(to);

  const piece = gameState.board[fromIdx];
  if (!piece) return;
  if (piece[0] !== gameState.activeColor) return;
  const checks = getChecks(
    OPP_COLOR[gameState.activeColor],
    pieceMap[gameState.activeColor].k[0],
    gameState.board
  );
  const valid = getLegalMoves(from, gameState, pieceMap, checks)?.includes(
    toIdx
  );
  if (!valid) return;

  //
  const moveDetails = {
    from,
    to,
    piece: piece,
    capture: !!gameState.board[toIdx]
  } as MoveDetailsInterface;
  // halfmoves measures moves since last capture or pawn advance
  if (!gameState.board[toIdx] && piece[1] !== 'p') gameState.halfmoves++;
  else gameState.halfmoves = 0;

  switch (piece[1]) {
    case 'k': {
      // toggle castle rights
      gameState.castleRights[gameState.activeColor] = {
        k: false,
        q: false
      };

      // move rook if its a castle move
      const distance = toIdx - fromIdx;
      if (distance === -2) {
        castle(pieceMap[gameState.activeColor], 'q', gameState.board);
        moveDetails.castle = 'q';
      } else if (distance === 2) {
        castle(pieceMap[gameState.activeColor], 'k', gameState.board);
        moveDetails.castle = 'k';
      } else if (distance !== 2 && distance !== -2)
        move(fromIdx, gameState.board, pieceMap).to(toIdx);
      break;
    }

    case 'r': {
      const kingIdx = pieceMap[gameState.activeColor].k[0];
      const kingside = kingIdx < fromIdx;

      gameState.castleRights[gameState.activeColor][kingside ? 'k' : 'q'] =
        false;

      move(fromIdx, gameState.board, pieceMap).to(toIdx);
      gameState.enPassant = null;
      break;
    }

    case 'p': {
      const forward = gameState.activeColor === 'w' ? 'up' : 'down';
      // check if capture by enPassant
      if (toIdx === gameState.enPassant) {
        const captureIdx = (toIdx - VECTORS[forward]) as SquareIdx;
        gameState.board[captureIdx] = null;
        moveDetails.capture = true;
      }
      // check if you need to toggle enPassant
      if (toIdx === 2 * VECTORS[forward] + fromIdx) {
        gameState.enPassant = (toIdx - VECTORS[forward]) as SquareIdx;
      } else gameState.enPassant = null;

      move(fromIdx, gameState.board, pieceMap).to(toIdx);
      if (!promoteType) break;
      else if (isPromote(piece, to)) {
        promote(gameState.board, toIdx, promoteType, pieceMap);
        moveDetails.promote = promoteType;
      }

      break;
    }

    default: {
      gameState.enPassant = null;
      move(fromIdx, gameState.board, pieceMap).to(toIdx);
    }
  }

  if (gameState.activeColor === 'b') gameState.fullmoves++;
  gameState.activeColor = OPP_COLOR[gameState.activeColor];

  return moveDetails;
}

export function isPromote(piece: Piece, square: Square) {
  if (piece[1] !== 'p') return;
  const sIdx = convertSquareToIdx(square);
  const newRank = Math.floor(BOARD_IDX.indexOf(sIdx) / BOARD_LENGTH);
  const promoteRank = piece[0] === 'w' ? 7 : 0;
  return newRank === promoteRank;
}

function isNoLegalMoves(
  gameState: GameState,
  pieceMap: AllPieceMap,
  checks: SquareIdx[]
) {
  const legalMoves = getMovesForColor(
    gameState.board,
    pieceMap,
    gameState.activeColor,
    gameState.enPassant,
    gameState.castleRights[gameState.activeColor],
    checks
  );
  return !Object.keys(legalMoves)[0];
}

export function isGameOver(
  gameState: GameState,
  pieceMap: AllPieceMap,
  checks: SquareIdx[],
  fenList: FenStr[]
) {
  const gameOver = {
    checkmate: false,
    unforcedDraw: false,
    forcedDraw: false
  };

  // check for checkmate + stalemate
  const noLegalMoves = isNoLegalMoves(gameState, pieceMap, checks);
  if (noLegalMoves && checks.length) {
    gameOver.checkmate = true;
    return gameOver;
  } else if (noLegalMoves) {
    gameOver.forcedDraw = true;
    return gameOver;
  }

  // check for move rule
  if (gameState.halfmoves >= 75) {
    gameOver.forcedDraw = true;
    return gameOver;
  }
  if (gameState.halfmoves >= 50) gameOver.unforcedDraw = true;

  // check for repetition
  const map: { [key: string]: EnumerateFromOne<5> } = {};
  for (let i = 0; i < fenList.length; i++) {
    if (!isFenStr(fenList[i]))
      throw new Error('encountered a string that was not a fen string');

    // need to remove fullmoves + halfmoves from fen string before comparing
    const normalized = fenList[i].split(' ');
    normalized.splice(-2);
    const joined = normalized.join(' ');

    if (map[joined]) map[joined]++;
    else map[joined] = 1;

    if (map[joined] === 5) {
      gameOver.forcedDraw = true;
      return gameOver;
    }
    if (map[joined] === 3) {
      gameOver.unforcedDraw = true;
    }
  }

  // check for insufficient material
  // join the array of pieces left so you can compare as as string
  const piecesLeft = Object.keys(pieceMap[gameState.activeColor])
    .sort()
    .join('');
  const oppPiecesLeft = Object.keys(pieceMap[OPP_COLOR[gameState.activeColor]])
    .sort()
    .join('');

  const insufficientMaterial = {
    k: ['bk', 'kn', 'k'],
    bk: ['bk']
  };

  type PiecesLeft = keyof typeof insufficientMaterial;

  if (
    !(piecesLeft in insufficientMaterial) &&
    !(oppPiecesLeft in insufficientMaterial)
  )
    return gameOver;

  if (
    insufficientMaterial[piecesLeft as PiecesLeft].includes(oppPiecesLeft) ||
    insufficientMaterial[oppPiecesLeft as PiecesLeft].includes(piecesLeft)
  ) {
    gameOver.forcedDraw = true;
    return gameOver;
  }

  return gameOver;
}

export { getChecks };
