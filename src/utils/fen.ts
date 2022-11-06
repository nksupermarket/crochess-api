import Game from '../classes/Game';
import {
  Board,
  Colors,
  SquareIdx,
  PieceType,
  EnPassant,
  Piece,
  CastleRights
} from '../types/types';
import { convertIdxToSquare } from './square';
import { isFenStr } from './typeCheck';
import { BOARD_IDX, BOARD_LENGTH, COLORS } from './constants';
import Gameboard from '../classes/Gameboard';
import { GameConstructorParams } from 'src/types/interfaces';

export function convertFromFen(
  fen: string,
  pushToPieceMap?: (
    pieceType: PieceType,
    color: Colors,
    squareIdx: SquareIdx
  ) => void
): GameConstructorParams | undefined {
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
  // need to reverse the array because fen string starts with the 8th rank first
  const splitIntoRanks = boardStr.split('/');
  splitIntoRanks.reverse();

  const eightByEight = splitIntoRanks
    // need to split each str because each str represent a whole rank
    .map((str) => str.split(''))
    .flat()
    .reduce<(Piece | null)[]>((acc, curr) => {
      // iterate over the string representation of the rank

      if (curr === '/') return acc;

      if (Number(curr)) {
        return acc.concat(Array(Number(curr)).fill(null));
      }

      // curr represents a piece
      const pieceType = curr as PieceType;
      const piece =
        pieceType.toLowerCase() === pieceType
          ? (`b${pieceType}` as Piece)
          : (`w${pieceType.toLowerCase()}` as Piece);

      acc.push(piece);
      return acc;
    }, []);

  const tenBytwelve = new Gameboard().create();
  eightByEight.forEach((s, i) => {
    tenBytwelve[BOARD_IDX[i]] = s;
    if (s) {
      pushToPieceMap &&
        pushToPieceMap(s[1] as PieceType, s[0] as Colors, BOARD_IDX[i]);
    }
  });

  const castleRights = COLORS.reduce<Record<Colors, CastleRights>>(
    (acc, curr) => {
      const kingsideStr = curr === 'w' ? 'K' : 'k';
      const queensideStr = curr === 'w' ? 'Q' : 'q';

      acc[curr] = {
        k: castleRightsStr.includes(kingsideStr),
        q: castleRightsStr.includes(queensideStr)
      };
      return acc;
    },
    {} as Record<Colors, CastleRights>
  );

  return {
    halfmoves,
    fullmoves,
    castleRights,
    board: tenBytwelve as Board,
    enPassant: enPassant as EnPassant,
    activeColor: activeColor as Colors
  };
}

export function convertBoardToFen(board: Board) {
  let fen = '';

  // need to iterate over twice
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

export function convertToFen(game: Game) {
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
