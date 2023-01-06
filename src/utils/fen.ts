import {
  Board,
  Colors,
  SquareIdx,
  PieceType,
  Square,
  Piece,
  AllCastleRights,
  FenStr
} from '../types/types';
import { convertIdxToSquare, convertSquareToIdx } from './square';
import { isFenStr } from './typeCheck';
import { BOARD_IDX, COLORS, BOARD_LENGTH } from './constants';
import { GameState } from '../types/interfaces';
import { createBoard } from './board';

export function getActiveColor(fen: FenStr): Colors | undefined {
  if (!isFenStr(fen)) return;
  const split = fen.split(' ');

  return split[1] as Colors;
}

export function convertFromFen(
  fen: FenStr,
  pushToPieceMap?: (
    pieceType: PieceType,
    color: Colors,
    squareIdx: SquareIdx
  ) => void
): GameState | undefined {
  if (!isFenStr(fen)) return;
  const split = fen.split(' ');
  const [
    boardStr,
    activeColor,
    castleRightsStr,
    enPassant,
    halfmoves,
    fullmoves
  ] = split;

  // convert board
  // need to split into ranks then reverse because otherwise each rank is reversed
  // need to reverse the array because fen string starts with the 8th rank first

  const reversed = boardStr.split('/').reverse().join('');
  let idx = 0;
  const tenBytwelve = createBoard();
  for (let j = 0; j < reversed.length; j++) {
    const char = reversed[j];
    if (char === '/') continue;

    if (Number(char)) {
      for (let i = 0; i < Number(char); i++) {
        tenBytwelve[BOARD_IDX[idx]] = null;
        idx++;
      }
      continue;
    }

    // char represents a piece
    const pieceType = char as PieceType;
    const piece =
      pieceType.toLowerCase() === pieceType
        ? (`b${pieceType}` as Piece)
        : (`w${pieceType.toLowerCase()}` as Piece);

    // need to access BOARD_IDX because it is a collection of indexes that represent the actual 8x8 board
    tenBytwelve[BOARD_IDX[idx]] = piece;
    pushToPieceMap &&
      pushToPieceMap(piece[1] as PieceType, piece[0] as Colors, BOARD_IDX[idx]);
    idx++;
  }

  const castleRights = COLORS.reduce<AllCastleRights>((acc, color) => {
    const kingsideStr = color === 'w' ? 'K' : 'k';
    const queensideStr = color === 'w' ? 'Q' : 'q';

    acc[color] = {
      k: castleRightsStr.includes(kingsideStr),
      q: castleRightsStr.includes(queensideStr)
    };
    return acc;
  }, {} as AllCastleRights);

  return {
    castleRights,
    halfmoves: Number(halfmoves),
    fullmoves: Number(fullmoves),
    board: tenBytwelve as Board,
    enPassant:
      enPassant !== '-' ? convertSquareToIdx(enPassant as Square) : null,
    activeColor: activeColor as Colors
  };
}

export function convertBoardToFen(board: Board) {
  let fen = '';

  // need to iterate over twice
  // need to iterate over rank first because each fen rank reads the board left to right
  // first loop for ranks
  // inner loop for files
  for (let rank = BOARD_LENGTH - 1; rank >= 0; rank--) {
    let rankStr = '';
    for (let file = 0; file < BOARD_LENGTH; file++) {
      const idx = BOARD_IDX[rank * BOARD_LENGTH + file];
      if (
        // square is empty
        !board[idx]
      ) {
        if (Number(rankStr[rankStr.length - 1])) {
          // if square is empty and end of string is number, just add 1 to the number that is at the end
          rankStr = rankStr.replace(
            /\d$/,
            `${Number(rankStr[rankStr.length - 1]) + 1}`
          );
        } else rankStr += '1';
      } else {
        // rank[i] is a piece
        const piece = board[idx] as Piece;
        rankStr += piece[0] === 'w' ? piece[1].toUpperCase() : piece[1];
      }
    }
    fen += `${rankStr}`;
    if (rank !== 0) fen += '/';
  }
  return fen;
}

export function convertToFen(game: GameState) {
  let fen = convertBoardToFen(game.board);

  fen += ` ${game.activeColor}`;

  const castleRightsStr = `${game.castleRights.w.k ? 'K' : ''}${
    game.castleRights.w.q ? 'Q' : ''
  }${game.castleRights.b.k ? 'k' : ''}${game.castleRights.w.q ? 'q' : ''}`;

  fen += ` ${castleRightsStr}`;

  const enPassantStr = game.enPassant
    ? convertIdxToSquare(game.enPassant)
    : '-';

  fen += ` ${enPassantStr} ${game.halfmoves} ${game.fullmoves}`;

  return fen;
}
