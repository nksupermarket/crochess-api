import GameState from 'src/classes/GameState';
import Piece from '../classes/Piece';
import {
  Board,
  Rank,
  Colors,
  SquareIdx,
  PieceAbr,
  PieceType,
  Enumerate,
  Square,
  Files,
  CastleRightsStr,
  EnPassant
} from '../types/types';
import { ABR_TO_PIECE_MAP, PIECE_TO_ABR_MAP } from './constants';

export function convertFromFen<Size extends number>(
  fen: string,
  cb?: (pieceType: PieceType, color: Colors, squareIdx: SquareIdx<Size>) => void
): any {
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
  const splitIntoRanks = boardStr.split('/');
  const board = splitIntoRanks
    .reverse()
    .reduce<Board<Size>>((acc, curr, idx) => {
      // iterate over the string representation of the rank
      // for each character, adjust the rank accordingly

      let rank: (Piece | null)[] = [];
      for (let i = 0; i < curr.length; i++) {
        if (Number(curr[i])) {
          rank = rank.concat(Array(Number(curr[i])).fill(null));
          continue;
        }

        // curr[i] represents a piece
        const color = curr[i].toLowerCase() === curr[i] ? 'b' : 'w';
        rank.push(
          new Piece(ABR_TO_PIECE_MAP[curr[i].toLowerCase() as PieceAbr], color)
        );
        cb &&
          cb(ABR_TO_PIECE_MAP[curr[i] as PieceAbr], color, [
            idx as Enumerate<Size>,
            i as Enumerate<Size>
          ]);
      }

      acc.push(rank as Rank<Size>);
      return acc;
    }, [] as Board<Size>);

  return new GameState<Size>({
    activeColor,
    halfmoves,
    fullmoves,
    board,
    castleRightsStr: castleRightsStr as CastleRightsStr,
    enPassant: enPassant as EnPassant<Size>
  });
}

export function convertToFen<Size extends number>(board: Board<Size>) {
  const boardStr = board.reverse().reduce((acc, rank) => {
    let rankStr = '';
    for (let i = 0; i < rank.length; i++) {
      if (
        // square is empty
        !rank[i]
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
        const piece = rank[i] as Piece;
        rankStr +=
          piece.color === 'w'
            ? PIECE_TO_ABR_MAP[piece.type].toUpperCase()
            : PIECE_TO_ABR_MAP[piece.type];
      }
    }

    return acc ? `${acc}/${rankStr}` : rankStr;
  }, '');

  return boardStr;
}
