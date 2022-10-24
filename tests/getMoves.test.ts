// import Gameboard from '../src/classes/Gameboard';
// import { BOARD_SIZE } from '../src/utils/constants';
// import { getPieceMoves, getPawnMoves } from '../src/utils/getMoves';

// describe('getPieceMoves works', () => {
//   describe('bishop moves works', () => {
//     it('works on an empty board', () => {
//       const board = new Gameboard(BOARD_SIZE).board;
//       expect(
//         getPieceMoves<typeof BOARD_SIZE>('bishop', board, [4, 4]).sort()
//       ).toEqual(
//         [
//           [0, 0],
//           [1, 1],
//           [2, 2],
//           [3, 3],
//           [5, 5],
//           [6, 6],
//           [7, 7],
//           [7, 1],
//           [6, 2],
//           [5, 3],
//           [3, 5],
//           [2, 6],
//           [1, 7]
//         ].sort()
//       );
//     });

//     it('works when a piece of the same color is blocking', () => {
//       const board = new Gameboard(BOARD_SIZE).board;
//       board[4][4] = new Piece('bishop', 'w');
//       board[5][5] = new Piece('pawn', 'w');

//       expect(
//         getPieceMoves<typeof BOARD_SIZE>('bishop', board, [4, 4]).sort()
//       ).toEqual(
//         [
//           [0, 0],
//           [1, 1],
//           [2, 2],
//           [3, 3],
//           [7, 1],
//           [6, 2],
//           [5, 3],
//           [3, 5],
//           [2, 6],
//           [1, 7]
//         ].sort()
//       );
//     });

//     it('works when a piece of the opposite color is blocking', () => {
//       const board = new Gameboard(BOARD_SIZE).board;
//       board[4][4] = new Piece('bishop', 'w');
//       board[3][3] = new Piece('knight', 'b');
//       expect(
//         getPieceMoves<typeof BOARD_SIZE>('bishop', board, [4, 4]).sort()
//       ).toEqual(
//         [
//           [3, 3],
//           [5, 5],
//           [6, 6],
//           [7, 7],
//           [7, 1],
//           [6, 2],
//           [5, 3],
//           [3, 5],
//           [2, 6],
//           [1, 7]
//         ].sort()
//       );
//     });

//     it('works when pieces of both colors block at the same time', () => {
//       const board = new Gameboard(BOARD_SIZE).board;
//       board[4][4] = new Piece('bishop', 'w');
//       board[3][3] = new Piece('knight', 'b');
//       board[5][5] = new Piece('pawn', 'w');

//       expect(
//         getPieceMoves<typeof BOARD_SIZE>('bishop', board, [4, 4]).sort()
//       ).toEqual(
//         [
//           [3, 3],
//           [7, 1],
//           [6, 2],
//           [5, 3],
//           [3, 5],
//           [2, 6],
//           [1, 7]
//         ].sort()
//       );
//     });
//   });

//   describe('knight moves works', () => {
//     const board = new Gameboard(BOARD_SIZE).board;

//     expect(
//       getPieceMoves<typeof BOARD_SIZE>('knight', board, [4, 3]).sort()
//     ).toEqual(
//       [
//         [2, 2],
//         [2, 4],
//         [3, 1],
//         [3, 5],
//         [5, 5],
//         [5, 1],
//         [6, 2],
//         [6, 4]
//       ].sort()
//     );
//   });

//   describe('rook moves works', () => {
//     it('works on an empty board', () => {
//       const board = new Gameboard(BOARD_SIZE).board;
//       expect(
//         getPieceMoves<typeof BOARD_SIZE>('rook', board, [4, 4]).sort()
//       ).toEqual(
//         [
//           [3, 4],
//           [2, 4],
//           [1, 4],
//           [0, 4],
//           [5, 4],
//           [6, 4],
//           [7, 4],
//           [4, 3],
//           [4, 2],
//           [4, 1],
//           [4, 0],
//           [4, 5],
//           [4, 6],
//           [4, 7]
//         ].sort()
//       );
//     });

//     it('works when a piece of the same color is blocking', () => {
//       const board = new Gameboard(BOARD_SIZE).board;
//       board[4][4] = new Piece('rook', 'w');
//       board[5][4] = new Piece('pawn', 'w');

//       expect(
//         getPieceMoves<typeof BOARD_SIZE>('rook', board, [4, 4]).sort()
//       ).toEqual(
//         [
//           [3, 4],
//           [2, 4],
//           [1, 4],
//           [0, 4],
//           [4, 3],
//           [4, 2],
//           [4, 1],
//           [4, 0],
//           [4, 5],
//           [4, 6],
//           [4, 7]
//         ].sort()
//       );
//     });

//     it('works when a piece of the opposite color is blocking', () => {
//       const board = new Gameboard(BOARD_SIZE).board;
//       board[4][4] = new Piece('rook', 'w');
//       board[4][3] = new Piece('knight', 'b');
//       expect(
//         getPieceMoves<typeof BOARD_SIZE>('rook', board, [4, 4]).sort()
//       ).toEqual(
//         [
//           [3, 4],
//           [2, 4],
//           [1, 4],
//           [0, 4],
//           [5, 4],
//           [6, 4],
//           [7, 4],
//           [4, 3],
//           [4, 5],
//           [4, 6],
//           [4, 7]
//         ].sort()
//       );
//     });

//     it('works when pieces of both colors block at the same time', () => {
//       const board = new Gameboard(BOARD_SIZE).board;
//       board[4][4] = new Piece('rook', 'w');
//       board[4][3] = new Piece('knight', 'b');
//       board[5][4] = new Piece('pawn', 'w');

//       expect(
//         getPieceMoves<typeof BOARD_SIZE>('rook', board, [4, 4]).sort()
//       ).toEqual(
//         [
//           [3, 4],
//           [2, 4],
//           [1, 4],
//           [0, 4],
//           [4, 3],
//           [4, 5],
//           [4, 6],
//           [4, 7]
//         ].sort()
//       );
//     });
//   });

//   test('queen moves works', () => {
//     const board = new Gameboard(BOARD_SIZE).board;
//     expect(
//       getPieceMoves<typeof BOARD_SIZE>('queen', board, [4, 4]).sort()
//     ).toEqual(
//       [
//         [3, 4],
//         [2, 4],
//         [1, 4],
//         [0, 4],
//         [5, 4],
//         [6, 4],
//         [7, 4],
//         [4, 3],
//         [4, 2],
//         [4, 1],
//         [4, 0],
//         [4, 5],
//         [4, 6],
//         [4, 7],
//         [0, 0],
//         [1, 1],
//         [2, 2],
//         [3, 3],
//         [5, 5],
//         [6, 6],
//         [7, 7],
//         [7, 1],
//         [6, 2],
//         [5, 3],
//         [3, 5],
//         [2, 6],
//         [1, 7]
//       ].sort()
//     );
//   });

//   test('king moves works', () => {
//     const board = new Gameboard(BOARD_SIZE).board;
//     expect(
//       getPieceMoves<typeof BOARD_SIZE>('king', board, [4, 4]).sort()
//     ).toEqual(
//       [
//         [3, 3],
//         [5, 5],
//         [4, 3],
//         [4, 5],
//         [3, 4],
//         [3, 5],
//         [5, 3],
//         [5, 4]
//       ].sort()
//     );
//   });
// });

// describe('getPawnMoves works', () => {
//   const board = new Gameboard(BOARD_SIZE).board;

//   it('works on an empty board', () => {
//     expect(getPawnMoves<typeof BOARD_SIZE>(board, 'w', [4, 4]).sort()).toEqual([
//       [5, 4]
//     ]);
//   });

//   it('works when pawn is on start square', () => {
//     expect(getPawnMoves<typeof BOARD_SIZE>(board, 'w', [1, 4]).sort()).toEqual(
//       [
//         [3, 4],
//         [2, 4]
//       ].sort()
//     );

//     expect(getPawnMoves<typeof BOARD_SIZE>(board, 'b', [6, 4]).sort()).toEqual(
//       [
//         [5, 4],
//         [4, 4]
//       ].sort()
//     );
//   });

//   describe('it works with captures', () => {
//     it('works', () => {
//       const board = new Gameboard(BOARD_SIZE).board;

//       board[5][5] = new Piece('pawn', 'b');
//       board[5][3] = new Piece('pawn', 'b');
//       expect(
//         getPawnMoves<typeof BOARD_SIZE>(board, 'w', [4, 4]).sort()
//       ).toEqual(
//         [
//           [5, 4],
//           [5, 5],
//           [5, 3]
//         ].sort()
//       );

//       board[4][3] = new Piece('pawn', 'w');
//       board[4][1] = new Piece('pawn', 'w');

//       expect(
//         getPawnMoves<typeof BOARD_SIZE>(board, 'b', [5, 2]).sort()
//       ).toEqual(
//         [
//           [4, 2],
//           [4, 3],
//           [4, 1]
//         ].sort()
//       );
//     });

//     it('doesnt include own pieces', () => {
//       const board = new Gameboard(BOARD_SIZE).board;

//       board[5][5] = new Piece('pawn', 'w');
//       board[5][3] = new Piece('pawn', 'w');
//       expect(
//         getPawnMoves<typeof BOARD_SIZE>(board, 'w', [4, 4]).sort()
//       ).toEqual([[5, 4]].sort());

//       board[4][3] = new Piece('pawn', 'b');
//       board[4][1] = new Piece('pawn', 'b');

//       expect(
//         getPawnMoves<typeof BOARD_SIZE>(board, 'b', [5, 2]).sort()
//       ).toEqual([[4, 2]].sort());
//     });

//     it('works with enPassant', () => {
//       expect(
//         getPawnMoves<typeof BOARD_SIZE>(board, 'w', [4, 4], [5, 3]).sort()
//       ).toEqual(
//         [
//           [5, 4],
//           [5, 3]
//         ].sort()
//       );
//     });

//     it('doesnt include enPassant square if its not a legal move for the pawn', () => {
//       expect(
//         getPawnMoves<typeof BOARD_SIZE>(board, 'w', [4, 4], [5, 2]).sort()
//       ).toEqual([[5, 4]].sort());
//     });
//   });
// });
