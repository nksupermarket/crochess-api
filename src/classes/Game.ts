import {
  CastleRights,
  Colors,
  EnumerateFromOne,
  FenStr,
  PieceType,
  Square,
  SquareIdx,
  PieceUppercase,
  MoveSuffix,
  Ranks,
  Files,
  MoveNotation,
  PieceMap,
  Board
} from '../types/types';
import { convertSquareToIdx, convertIdxToSquare } from '../utils/square';
import { isFenStr, isSquare } from '../utils/typeCheck';
import Gameboard from './Gameboard';
import {
  BOARD_IDX,
  BOARD_LENGTH,
  OPP_COLOR,
  VECTORS
} from '../utils/constants';
import { convertFromFen, convertToFen } from '../utils/fen';
import {
  getChecks,
  getMovesForColor,
  getLegalKingMoves,
  getLegalMoves
} from '../utils/getMoves';
import {
  GameConstructorParams,
  MoveDetailsInterface
} from '../types/interfaces';

export default class Game extends Gameboard {
  castleRights: Record<Colors, CastleRights>;
  enPassant: SquareIdx | null;
  halfmoves: number;
  fullmoves: number;
  activeColor: Colors;
  // if checks is null, that means it hasnt been cached yet
  private _checks: SquareIdx[] | null;

  constructor(
    fen: FenStr = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  ) {
    if (!isFenStr(fen))
      throw new Error('Game was not given a valid fen string');

    super();
    const {
      board,
      castleRights,
      enPassant,
      halfmoves,
      fullmoves,
      activeColor
    } = convertFromFen(fen, this.pushToPieceMap) as GameConstructorParams;

    this.board = board;
    this.castleRights = castleRights;
    this.enPassant = isSquare(enPassant) ? convertSquareToIdx(enPassant) : null;
    this.halfmoves = Number(halfmoves);
    this.fullmoves = Number(fullmoves);
    this.activeColor = activeColor;
    this._checks = null;
  }

  get checks() {
    // this._checks resets to null after every turn
    if (this._checks) return this._checks;
    this._checks = getChecks(
      OPP_COLOR[this.activeColor],
      this.pieceMap[this.activeColor].k[0],
      this.board
    );
    return this._checks;
  }

  at = (s: SquareIdx | Square, board = this.board) => {
    const idx: SquareIdx = typeof s === 'string' ? convertSquareToIdx(s) : s;
    return {
      ...super.at(s, board),
      moves: () => {
        const piece = board[idx];
        if (!piece) return null;
        const oppColor = OPP_COLOR[piece[0] as Colors];
        if (piece[1] === 'k') {
          return getLegalKingMoves(
            this.pieceMap[piece[0] as Colors].k[0],
            piece[0] as Colors,
            this.pieceMap[oppColor],
            this.castleRights[piece[0] as Colors],
            board
          );
        } else {
          return getLegalMoves(
            piece[1] as Exclude<PieceType, 'k'>,
            board,
            piece[0] as Colors,
            idx,
            this.pieceMap[piece[0] as Colors].k[0],
            this.checks,
            this.enPassant || undefined
          );
        }
      }
    };
  };

  makeMove = (
    from: Square,
    to: Square,
    promote?: Exclude<PieceType, 'k' | 'p'>
  ): MoveDetailsInterface | undefined => {
    const fromIdx = convertSquareToIdx(from);
    const toIdx = convertSquareToIdx(to);

    const piece = this.board[fromIdx];
    if (!piece) return;
    if (piece[0] !== this.activeColor) return;
    const valid = this.at(fromIdx).moves()?.includes(toIdx);
    if (!valid) return;

    //
    const moveDetails = {
      from,
      to,
      piece: piece,
      capture: !!this.board[toIdx]
    } as MoveDetailsInterface;
    // halfmoves measures moves since last capture or pawn advance
    if (!this.board[toIdx] && piece[1] !== 'p') this.halfmoves++;
    else this.halfmoves = 0;

    switch (piece[1]) {
      case 'k': {
        // toggle castle rights
        this.castleRights[this.activeColor] = {
          k: false,
          q: false
        };

        // move rook if its a castle move
        const distance = toIdx - fromIdx;
        if (distance === -2) {
          this.castle(this.activeColor, 'q');
          moveDetails.castle = 'q';
        }

        if (distance === 2) {
          this.castle(this.activeColor, 'k');
          moveDetails.castle = 'k';
        }

        if (distance !== 2 && distance !== -2) this.from(fromIdx).to(toIdx);
        break;
      }

      case 'r': {
        const kingIdx = this.pieceMap[this.activeColor].k[0];
        const kingside = kingIdx < fromIdx;

        this.castleRights[this.activeColor][kingside ? 'k' : 'q'] = false;

        this.from(fromIdx).to(toIdx);
        this.enPassant = null;
        break;
      }

      case 'p': {
        const forward = this.activeColor === 'w' ? 'up' : 'down';
        // check if capture by enPassant
        if (toIdx === this.enPassant) {
          const captureIdx = (toIdx - VECTORS[forward]) as SquareIdx;
          this.at(captureIdx).remove();
          moveDetails.capture = true;
        }
        // check if you need to toggle enPassant
        if (toIdx === 2 * VECTORS[forward] + fromIdx) {
          this.enPassant = (toIdx - VECTORS[forward]) as SquareIdx;
        } else this.enPassant = null;

        this.from(fromIdx).to(toIdx);
        const newRank = Math.floor(BOARD_IDX.indexOf(toIdx) / BOARD_LENGTH);
        const promoteRank = this.activeColor === 'w' ? 7 : 0;
        if (!promote) break;
        else if (newRank === promoteRank) {
          this.at(toIdx).promote(promote);
          moveDetails.promote = promote;
        }

        break;
      }

      default: {
        this.enPassant = null;
        this.from(fromIdx).to(toIdx);
      }
    }

    if (this.activeColor === 'b') this.fullmoves++;
    this.activeColor = OPP_COLOR[this.activeColor];
    this._checks = null;

    return moveDetails;
  };

  private isNoLegalMoves() {
    const legalMoves = getMovesForColor(
      this.board,
      this.pieceMap,
      this.activeColor,
      this.enPassant,
      this.castleRights[this.activeColor],
      this.checks
    );
    return !Object.keys(legalMoves)[0];
  }

  isGameOver = (fenList: FenStr[]) => {
    const gameOver = {
      checkmate: false,
      unforcedDraw: false,
      forcedDraw: false
    };

    // check for checkmate + stalemate
    const noLegalMoves = this.isNoLegalMoves();
    if (noLegalMoves && this.checks.length) {
      gameOver.checkmate = true;
      return gameOver;
    } else if (noLegalMoves) {
      gameOver.forcedDraw = true;
      return gameOver;
    }

    // check for move rule
    if (this.halfmoves >= 75) {
      gameOver.forcedDraw = true;
      return gameOver;
    }
    if (this.halfmoves >= 50) gameOver.unforcedDraw = true;

    // check for repetition
    fenList.push(convertToFen(this));
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
    const piecesLeft = Object.keys(this.pieceMap[this.activeColor])
      .sort()
      .join('');
    const oppPiecesLeft = Object.keys(
      this.pieceMap[OPP_COLOR[this.activeColor]]
    )
      .sort()
      .join('');

    const insufficientMaterial = {
      k: ['bk', 'kn', 'k'],
      bk: ['bk']
    };

    type PiecesLeft = keyof typeof insufficientMaterial;

    if (
      !insufficientMaterial[piecesLeft as PiecesLeft] &&
      !insufficientMaterial[oppPiecesLeft as PiecesLeft]
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
  };

  convertToFen() {
    return convertToFen(this);
  }

  createMoveNotation(
    details: MoveDetailsInterface | undefined
  ): MoveNotation | undefined {
    if (!details) return;

    let notation: MoveNotation;
    if (details.castle) {
      notation = details.castle === 'k' ? '0-0' : '0-0-0';
    } else {
      switch (details.piece[1]) {
        case 'p': {
          if (details.capture)
            notation = `${details.from[0] as Files}x${details.to}`;
          else notation = details.to;

          if (details.promote)
            notation += `=${details.promote.toUpperCase() as PieceUppercase}`;
          break;
        }
        case 'k': {
          if (details.capture)
            notation = `${details.piece[1].toUpperCase() as PieceUppercase}x${
              details.to
            }`;
          else
            notation = `${details.piece[1].toUpperCase() as PieceUppercase}${
              details.to
            }`;
          break;
        }
        default: {
          // have to copy bc you make the move first then get the notation
          const toIdx = convertSquareToIdx(details.to);
          const fromIdx = convertSquareToIdx(details.from);
          const copy = this.board.slice(0) as Board;
          if (copy[toIdx] === details.piece) {
            copy[toIdx] = null;
            copy[fromIdx] = details.piece;
          }
          const piecesThatHitSquare = getPiecesThatHitSquare(
            details.piece[1] as Exclude<PieceType, 'k' | 'p'>,
            details.piece[0] as Colors,
            toIdx,
            this.pieceMap[details.piece[0] as Colors],
            this.checks,
            copy,
            fromIdx
          );
          if (!piecesThatHitSquare)
            throw new Error('piece doesnt exist in piece map');
          let differentiation: Files | Square | Ranks | '' = '';
          switch (piecesThatHitSquare.length) {
            case 2:
              differentiation = details.from;
              break;
            case 1: {
              const otherPiece = convertIdxToSquare(
                piecesThatHitSquare[0]
              ) as Square;
              differentiation = (
                otherPiece[0] === details.from[0]
                  ? details.from[1]
                  : details.from[0]
              ) as Ranks | Files;
            }
          }

          if (details.capture)
            notation = `${
              details.piece[1].toUpperCase() as PieceUppercase
            }${differentiation}x${details.to}`;
          else
            notation = `${
              details.piece[1].toUpperCase() as PieceUppercase
            }${differentiation}${details.to}`;
        }
      }
    }

    let suffix: MoveSuffix | '' = '';
    if (this.checks.length) {
      suffix = this.isNoLegalMoves() ? '#' : '+';
    }

    return (notation += suffix);
  }
}

function getPiecesThatHitSquare(
  pieceType: Exclude<PieceType, 'k' | 'p'>,
  color: Colors,
  square: SquareIdx,
  pieceMap: PieceMap,
  check: SquareIdx[],
  board: Board,
  skip?: SquareIdx
): SquareIdx[] | undefined {
  const pieceSquares = pieceMap[pieceType];
  if (!pieceSquares) return;
  if (pieceSquares.length === 1) return [];

  return pieceSquares.filter((s) => {
    return s === skip
      ? false
      : getLegalMoves(
          pieceType,
          board,
          color,
          s,
          pieceMap.k[0],
          check
        ).includes(square);
  });
}
