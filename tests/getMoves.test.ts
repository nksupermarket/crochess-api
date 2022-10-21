import createBoard from '../src/utils/createBoard';
import { BOARD_SIZE } from '../src/utils/constants';
import { getPieceMoves } from '../src/utils/getMoves';
import Piece from '../src/classes/Piece';

describe('bishop moves works', () => {
  it('works on an empty board', () => {
    const board = createBoard(BOARD_SIZE);
    expect(
      getPieceMoves<typeof BOARD_SIZE>('bishop', board, [4, 4]).sort()
    ).toEqual(
      [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [5, 5],
        [6, 6],
        [7, 7],
        [7, 1],
        [6, 2],
        [5, 3],
        [3, 5],
        [2, 6],
        [1, 7]
      ].sort()
    );
  });

  it('works when a piece of the same color is blocking', () => {
    const board = createBoard(BOARD_SIZE);
    board[4][4] = new Piece('bishop', 'white');
    board[5][5] = new Piece('pawn', 'white');

    expect(
      getPieceMoves<typeof BOARD_SIZE>('bishop', board, [4, 4]).sort()
    ).toEqual(
      [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [7, 1],
        [6, 2],
        [5, 3],
        [3, 5],
        [2, 6],
        [1, 7]
      ].sort()
    );
  });

  it('works when a piece of the opposite color is blocking', () => {
    const board = createBoard(BOARD_SIZE);
    board[4][4] = new Piece('bishop', 'white');
    board[3][3] = new Piece('knight', 'black');
    expect(
      getPieceMoves<typeof BOARD_SIZE>('bishop', board, [4, 4]).sort()
    ).toEqual(
      [
        [3, 3],
        [5, 5],
        [6, 6],
        [7, 7],
        [7, 1],
        [6, 2],
        [5, 3],
        [3, 5],
        [2, 6],
        [1, 7]
      ].sort()
    );
  });

  it('works when pieces of both colors block at the same time', () => {
    const board = createBoard(BOARD_SIZE);
    board[4][4] = new Piece('bishop', 'white');
    board[3][3] = new Piece('knight', 'black');
    board[5][5] = new Piece('pawn', 'white');

    expect(
      getPieceMoves<typeof BOARD_SIZE>('bishop', board, [4, 4]).sort()
    ).toEqual(
      [
        [3, 3],
        [7, 1],
        [6, 2],
        [5, 3],
        [3, 5],
        [2, 6],
        [1, 7]
      ].sort()
    );
  });
});

describe('knight moves works', () => {
  const board = createBoard(BOARD_SIZE);

  expect(
    getPieceMoves<typeof BOARD_SIZE>('knight', board, [4, 3]).sort()
  ).toEqual(
    [
      [2, 2],
      [2, 4],
      [3, 1],
      [3, 5],
      [5, 5],
      [5, 1],
      [6, 2],
      [6, 4]
    ].sort()
  );
});

describe('rook moves works', () => {
  it('works on an empty board', () => {
    const board = createBoard(BOARD_SIZE);
    expect(
      getPieceMoves<typeof BOARD_SIZE>('rook', board, [4, 4]).sort()
    ).toEqual(
      [
        [3, 4],
        [2, 4],
        [1, 4],
        [0, 4],
        [5, 4],
        [6, 4],
        [7, 4],
        [4, 3],
        [4, 2],
        [4, 1],
        [4, 0],
        [4, 5],
        [4, 6],
        [4, 7]
      ].sort()
    );
  });

  it('works when a piece of the same color is blocking', () => {
    const board = createBoard(BOARD_SIZE);
    board[4][4] = new Piece('rook', 'white');
    board[5][4] = new Piece('pawn', 'white');

    expect(
      getPieceMoves<typeof BOARD_SIZE>('rook', board, [4, 4]).sort()
    ).toEqual(
      [
        [3, 4],
        [2, 4],
        [1, 4],
        [0, 4],
        [4, 3],
        [4, 2],
        [4, 1],
        [4, 0],
        [4, 5],
        [4, 6],
        [4, 7]
      ].sort()
    );
  });

  it('works when a piece of the opposite color is blocking', () => {
    const board = createBoard(BOARD_SIZE);
    board[4][4] = new Piece('rook', 'white');
    board[4][3] = new Piece('knight', 'black');
    expect(
      getPieceMoves<typeof BOARD_SIZE>('rook', board, [4, 4]).sort()
    ).toEqual(
      [
        [3, 4],
        [2, 4],
        [1, 4],
        [0, 4],
        [5, 4],
        [6, 4],
        [7, 4],
        [4, 3],
        [4, 5],
        [4, 6],
        [4, 7]
      ].sort()
    );
  });

  it('works when pieces of both colors block at the same time', () => {
    const board = createBoard(BOARD_SIZE);
    board[4][4] = new Piece('rook', 'white');
    board[4][3] = new Piece('knight', 'black');
    board[5][4] = new Piece('pawn', 'white');

    expect(
      getPieceMoves<typeof BOARD_SIZE>('rook', board, [4, 4]).sort()
    ).toEqual(
      [
        [3, 4],
        [2, 4],
        [1, 4],
        [0, 4],
        [4, 3],
        [4, 5],
        [4, 6],
        [4, 7]
      ].sort()
    );
  });
});

test('queen moves works', () => {
  const board = createBoard(BOARD_SIZE);
  expect(
    getPieceMoves<typeof BOARD_SIZE>('queen', board, [4, 4]).sort()
  ).toEqual(
    [
      [3, 4],
      [2, 4],
      [1, 4],
      [0, 4],
      [5, 4],
      [6, 4],
      [7, 4],
      [4, 3],
      [4, 2],
      [4, 1],
      [4, 0],
      [4, 5],
      [4, 6],
      [4, 7],
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [5, 5],
      [6, 6],
      [7, 7],
      [7, 1],
      [6, 2],
      [5, 3],
      [3, 5],
      [2, 6],
      [1, 7]
    ].sort()
  );
});

test('king moves works', () => {
  const board = createBoard(BOARD_SIZE);
  expect(
    getPieceMoves<typeof BOARD_SIZE>('king', board, [4, 4]).sort()
  ).toEqual(
    [
      [3, 3],
      [5, 5],
      [4, 3],
      [4, 5],
      [3, 4],
      [3, 5],
      [5, 3],
      [5, 4]
    ].sort()
  );
});
