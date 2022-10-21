import Piece from '../classes/Piece';
import { PieceAbr } from '../types/types';
import { PIECE_ABR_MAP } from './constants';

export function convertFromFen(fen: string): any {
  const split = fen.split(' ');
  const [board, activeColor, castleRights, enPassant, halfmoves, fullmoves] =
    split;

  // convert board
  const splitIntoRanks = board.split('/');
  const convertedBoard = splitIntoRanks.reduce((acc, curr) => {
    // iterate over the string representation of the rank
    // for each character, adjust the rank accordingly

    let rank: (Piece | null)[] = [];
    for (let i = 0; i < curr.length; i++) {
      if (Number(curr[i])) {
        rank = rank.concat(Array(Number(curr[i])).fill(null));
        continue;
      }

      if (curr[i].toLowerCase() === curr[i]) {
        rank.push(new Piece(PIECE_ABR_MAP[curr[i] as PieceAbr], 'black'));
      } else {
        rank.push(
          new Piece(PIECE_ABR_MAP[curr[i].toLowerCase() as PieceAbr], 'white')
        );
      }
    }

    acc.push(rank);
    return acc;
  }, [] as any[]);

  return {
    activeColor,
    castleRights,
    enPassant,
    halfmoves,
    fullmoves,
    board: convertedBoard.reverse()
  };
}
