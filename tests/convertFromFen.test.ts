import { convertFromFen } from '../utils/fen';
import createBoard from '../utils/createBoard';
import Piece from '../classes/Piece';
import { BOARD_SIZE } from '../utils/constants';

describe('board is converted correctly', () => {
  const board = createBoard(BOARD_SIZE);
  board[0][0] = new Piece('rook', 'white');
  board[0][1] = new Piece('knight', 'white');
  board[0][2] = new Piece('bishop', 'white');
  board[0][3] = new Piece('queen', 'white');
  board[0][4] = new Piece('king', 'white');
  board[0][5] = new Piece('bishop', 'white');
  board[0][6] = new Piece('knight', 'white');
  board[0][7] = new Piece('rook', 'white');

  board[1][0] = new Piece('pawn', 'white');
  board[1][1] = new Piece('pawn', 'white');
  board[1][2] = new Piece('pawn', 'white');
  board[1][3] = new Piece('pawn', 'white');
  board[1][4] = new Piece('pawn', 'white');
  board[1][5] = new Piece('pawn', 'white');
  board[1][6] = new Piece('pawn', 'white');
  board[1][7] = new Piece('pawn', 'white');

  board[7][0] = new Piece('rook', 'black');
  board[7][1] = new Piece('knight', 'black');
  board[7][2] = new Piece('bishop', 'black');
  board[7][3] = new Piece('queen', 'black');
  board[7][4] = new Piece('king', 'black');
  board[7][5] = new Piece('bishop', 'black');
  board[7][6] = new Piece('knight', 'black');
  board[7][7] = new Piece('rook', 'black');

  board[6][0] = new Piece('pawn', 'black');
  board[6][1] = new Piece('pawn', 'black');
  board[6][2] = new Piece('pawn', 'black');
  board[6][3] = new Piece('pawn', 'black');
  board[6][4] = new Piece('pawn', 'black');
  board[6][5] = new Piece('pawn', 'black');
  board[6][6] = new Piece('pawn', 'black');
  board[6][7] = new Piece('pawn', 'black');

  it('works for starting position', () => {
    expect(
      convertFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        .board
    ).toEqual(board);
  });

  it('works when pieces are in the middle of the board', () => {
    board[3][4] = board[1][4];
    board[1][4] = null;

    expect(
      convertFromFen(
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      ).board
    ).toEqual(board);
  });
});
