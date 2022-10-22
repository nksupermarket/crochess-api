import Gameboard from '../src/classes/Gameboard';
import Piece from '../src/classes/Piece';
import { BOARD_SIZE } from '../src/utils/constants';

test('initBoard works correctly', () => {
  const gameboard = new Gameboard(BOARD_SIZE);

  gameboard.initBoard();

  expect(gameboard.board[0][0]).toEqual(new Piece('rook', 'w'));
  expect(gameboard.board[0][1]).toEqual(new Piece('knight', 'w'));
  expect(gameboard.board[0][2]).toEqual(new Piece('bishop', 'w'));
  expect(gameboard.board[0][3]).toEqual(new Piece('queen', 'w'));
  expect(gameboard.board[0][4]).toEqual(new Piece('king', 'w'));
  expect(gameboard.board[0][5]).toEqual(new Piece('bishop', 'w'));
  expect(gameboard.board[0][6]).toEqual(new Piece('knight', 'w'));
  expect(gameboard.board[0][7]).toEqual(new Piece('rook', 'w'));

  expect(gameboard.board[1][0]).toEqual(new Piece('pawn', 'w'));
  expect(gameboard.board[1][1]).toEqual(new Piece('pawn', 'w'));
  expect(gameboard.board[1][2]).toEqual(new Piece('pawn', 'w'));
  expect(gameboard.board[1][3]).toEqual(new Piece('pawn', 'w'));
  expect(gameboard.board[1][4]).toEqual(new Piece('pawn', 'w'));
  expect(gameboard.board[1][5]).toEqual(new Piece('pawn', 'w'));
  expect(gameboard.board[1][6]).toEqual(new Piece('pawn', 'w'));
  expect(gameboard.board[1][7]).toEqual(new Piece('pawn', 'w'));

  expect(gameboard.board[7][0]).toEqual(new Piece('rook', 'b'));
  expect(gameboard.board[7][1]).toEqual(new Piece('knight', 'b'));
  expect(gameboard.board[7][2]).toEqual(new Piece('bishop', 'b'));
  expect(gameboard.board[7][3]).toEqual(new Piece('queen', 'b'));
  expect(gameboard.board[7][4]).toEqual(new Piece('king', 'b'));
  expect(gameboard.board[7][5]).toEqual(new Piece('bishop', 'b'));
  expect(gameboard.board[7][6]).toEqual(new Piece('knight', 'b'));
  expect(gameboard.board[7][7]).toEqual(new Piece('rook', 'b'));

  expect(gameboard.board[6][0]).toEqual(new Piece('pawn', 'b'));
  expect(gameboard.board[6][1]).toEqual(new Piece('pawn', 'b'));
  expect(gameboard.board[6][2]).toEqual(new Piece('pawn', 'b'));
  expect(gameboard.board[6][3]).toEqual(new Piece('pawn', 'b'));
  expect(gameboard.board[6][4]).toEqual(new Piece('pawn', 'b'));
  expect(gameboard.board[6][5]).toEqual(new Piece('pawn', 'b'));
  expect(gameboard.board[6][6]).toEqual(new Piece('pawn', 'b'));
  expect(gameboard.board[6][7]).toEqual(new Piece('pawn', 'b'));
});

// describe('board is converted correctly', () => {
//   const gameboard = new Gameboard(BOARD_SIZE);

//   //   it('works for starting position', () => {
//   //     expect(
//   //       convertFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
//   //         .board
//   //     ).toEqual(board);
//   //   });

//   //   it('works when pieces are in the middle of the board', () => {
//   //     board[3][4] = board[1][4];
//   //     board[1][4] = null;

//   //     expect(
//   //       convertFromFen(
//   //         'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
//   //       ).board
//   //     ).toEqual(board);
//   //   });
// });
