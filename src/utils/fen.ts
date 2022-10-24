import Gameboard from '../classes/Gameboard';
import Game from '../classes/Game';
import {
  Board,
  Colors,
  SquareIdx,
  PieceType,
  Enumerate,
  CastleRightsStr,
  EnPassant,
  Piece,
  FenStr
} from '../types/types';
import { isFenStr } from './typeCheck';

export function convertFromFen<Size extends number>(
  fen: FenStr,
  cb?: (pieceType: PieceType, color: Colors, squareIdx: SquareIdx<Size>) => void
): Game<Size>;
export function convertFromFen<Size extends number>(
  fen: string,
  cb?: (pieceType: PieceType, color: Colors, squareIdx: SquareIdx<Size>) => void
): undefined;
export function convertFromFen<Size extends number>(
  fen: string,
  cb?: (pieceType: PieceType, color: Colors, squareIdx: SquareIdx<Size>) => void
) {
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
  const splitIntoRanks = boardStr.split('/');
  splitIntoRanks.reverse();
  const board = splitIntoRanks.reduce<Board<Size>>((acc, curr, idx) => {
    // iterate over the string representation of the rank
    // for each character, adjust the rank accordingly
    // idx represents rank
    let rank: (Piece | null)[] = [];
    for (let i = 0; i < curr.length; i++) {
      if (Number(curr[i])) {
        rank = rank.concat(Array(Number(curr[i])).fill(null));
        continue;
      }

      // curr[i] represents a piece
      const pieceType = curr[i] as PieceType;
      const piece =
        pieceType.toLowerCase() === pieceType
          ? (`b${pieceType}` as Piece)
          : (`w${pieceType.toLowerCase()}` as Piece);
      rank.push(piece);
      cb &&
        cb(
          pieceType,
          piece[0] as Colors,
          ((idx - 1) * splitIntoRanks.length +
            rank.length -
            1) as Enumerate<Size>
        );
    }

    acc = acc.concat(rank) as Board<Size>;
    return acc;
  }, [] as Board<Size>);

  return new Game<Size>({
    board,
    halfmoves,
    fullmoves,
    boardSize: board.length as Size,
    castleRightsStr: castleRightsStr as CastleRightsStr,
    enPassant: enPassant as EnPassant<Size>,
    activeColor: activeColor as Colors
  });
}

export function convertToFen<Size extends number>(board: Board<Size>) {
  let boardStr = '';
  const length = Math.sqrt(board.length);
  // need to iterate over twice
  // first loop for ranks
  // inner loop for files
  for (let rank = length - 1; rank >= 0; rank--) {
    let rankStr = '';
    for (let file = 0; file < length; file++) {
      const idx = rank * length + file;
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
    boardStr += `${rankStr}/`;
  }

  return boardStr;
}
