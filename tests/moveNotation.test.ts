import Game from '../src/classes/Game';
import Gameboard from '../src/classes/Gameboard';
import { convertBoardToFen } from '../src/utils/fen';
import createMoveNotation from '../src/utils/moveNotation';

const game = new Game();
// unless a new game is created you have to run these tests together otherwise they wont work. they all use the game state

test('basic move', () => {
  const details = game.makeMove('e2', 'e4');
  const notation = createMoveNotation(
    details,
    game.board,
    game.pieceMap,
    game.checks
  );
  expect(notation).toBe('e4');
});

test('pawn capture', () => {
  game.makeMove('d7', 'd5');
  const details = game.makeMove('e4', 'd5');
  const notation = createMoveNotation(
    details,
    game.board,
    game.pieceMap,
    game.checks
  );

  expect(notation).toBe('exd5');
});

test('enPassant capture', () => {
  game.makeMove('e7', 'e5');

  const details = game.makeMove('d5', 'e6');
  const notation = createMoveNotation(
    details,
    game.board,
    game.pieceMap,
    game.checks
  );

  expect(notation).toBe('dxe6');
});

describe('multiple pieces can go to the same square', () => {
  test('different file', () => {
    const gameboard = new Gameboard();
    gameboard.at('c3').place('wn');
    gameboard.at('g1').place('wn');
    const game = new Game(`${convertBoardToFen(gameboard.board)} w KQkq - 0 1`);
    const details = game.makeMove('c3', 'e2');
    const notation = createMoveNotation(
      details,
      game.board,
      game.pieceMap,
      game.checks
    );

    expect(notation).toBe('Nce2');
  });
  test('different rank', () => {
    const gameboard = new Gameboard();
    gameboard.at('e2').place('wn');
    gameboard.at('g1').place('wn');
    gameboard.at('e4').place('wn');

    const game = new Game(`${convertBoardToFen(gameboard.board)} w KQkq - 0 1`);
    const details = game.makeMove('e4', 'c3');
    const notation = createMoveNotation(
      details,
      game.board,
      game.pieceMap,
      game.checks
    );

    expect(notation).toBe('N4c3');
  });
  test('different file + rank', () => {
    const gameboard = new Gameboard();
    gameboard.at('e2').place('wn');
    gameboard.at('b5').place('wn');
    gameboard.at('e4').place('wn');

    const game = new Game(`${convertBoardToFen(gameboard.board)} w KQkq - 0 1`);
    const details = game.makeMove('e4', 'c3');
    const notation = createMoveNotation(
      details,
      game.board,
      game.pieceMap,
      game.checks
    );

    expect(notation).toBe('Ne4c3');
  });
});

describe('checks/checkmates work', () => {
  test('checks', () => {
    const gameboard = new Gameboard();
    gameboard.at('e1').place('wk');
    gameboard.at('b4').place('bb');

    const fenBoard = convertBoardToFen(gameboard.board);
    const game = new Game(`${fenBoard} w KQkq - 0 2`);

    expect(
      createMoveNotation(
        {
          from: 'f8',
          to: 'c4',
          piece: 'bb'
        },
        game.board,
        game.pieceMap,
        game.checks
      )
    ).toBe('Bc4+');
  });

  test('checkmate', () => {
    const gameboard = new Gameboard();
    gameboard.at('h1')?.place('wk');
    gameboard.at('g1')?.place('wr');
    gameboard.at('h2')?.place('wp');
    gameboard.at('g2')?.place('wp');
    gameboard.at('f2')?.place('bn');

    const fenBoard = convertBoardToFen(gameboard.board);
    const game = new Game(`${fenBoard} w KQkq - 0 2`);

    expect(
      createMoveNotation(
        {
          from: 'h3',
          to: 'f2',
          piece: 'bn',
          checkmate: true
        },
        game.board,
        game.pieceMap,
        game.checks
      )
    ).toBe('Nf2#');
  });
});

test('promotion works', () => {
  const game = new Game();
  expect(
    createMoveNotation(
      {
        from: 'a7',
        to: 'a8',
        piece: 'wp',
        promote: 'q'
      },
      game.board,
      game.pieceMap,
      game.checks
    )
  ).toBe('a8=Q');
});

describe('castling works', () => {
  const game = new Game();
  test('kingside', () => {
    expect(
      createMoveNotation(
        {
          from: 'e1',
          to: 'g1',
          piece: 'wk',
          castle: 'k'
        },
        game.board,
        game.pieceMap,
        game.checks
      )
    ).toBe('0-0');
  });
  test('kingside', () => {
    expect(
      createMoveNotation(
        {
          from: 'e1',
          to: 'c1',
          piece: 'wk',
          castle: 'q'
        },
        game.board,
        game.pieceMap,
        game.checks
      )
    ).toBe('0-0-0');
  });
});
