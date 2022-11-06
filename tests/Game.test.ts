import { MoveDetailsInterface } from '../src/types/interfaces';
import Game from '../src/classes/Game';
import Gameboard from '../src/classes/Gameboard';
import { Square } from '../src/types/types';
import { convertBoardToFen } from '../src/utils/fen';
import { convertSquareToIdx } from '../src/utils/square';

describe('at().moves works correctly', () => {
  const game = new Game();
  test('in the inital position', () => {
    expect(game.at('e1').moves()).toEqual([]);

    expect(game.at('b1').moves()?.sort()).toEqual(
      ['a3', 'c3'].map((s) => convertSquareToIdx(s as Square)).sort()
    );

    expect(game.at('g1').moves()?.sort()).toEqual(
      ['h3', 'f3'].map((s) => convertSquareToIdx(s as Square)).sort()
    );
    expect(game.at('e2').moves()?.sort()).toEqual(
      ['e4', 'e3'].map((s) => convertSquareToIdx(s as Square)).sort()
    );
  });
});

describe('makeMoves works', () => {
  const game = new Game();
  it('moves the piece and changes turns', () => {
    game.makeMove('g1', 'f3');

    expect(game.pieceMap.w.n).toContain(convertSquareToIdx('f3'));
    expect(game.pieceMap.w.n).not.toContain(convertSquareToIdx('g1'));
    expect(game.activeColor).toBe('b');
  });

  it('toggles enPassant', () => {
    game.makeMove('e7', 'e5');
    expect(game.pieceMap.b.p).toContain(convertSquareToIdx('e5'));
    expect(game.pieceMap.b.p).not.toContain(convertSquareToIdx('e7'));
    expect(game.enPassant).toBe(convertSquareToIdx('e6'));
    expect(game.activeColor).toBe('w');

    game.makeMove('e2', 'e4');
    expect(game.pieceMap.w.p).toContain(convertSquareToIdx('e4'));
    expect(game.pieceMap.w.p).not.toContain(convertSquareToIdx('e2'));
    expect(game.enPassant).toBe(convertSquareToIdx('e3'));
  });

  it('untoggles enPassant on a piece move', () => {
    game.makeMove('b8', 'c6');

    expect(game.enPassant).toBe(null);
  });

  test('castle works correctly', () => {
    game.makeMove('f1', 'e2');
    game.makeMove('d7', 'd5');
    game.makeMove('e1', 'g1');

    expect(game.pieceMap.w.k).toEqual([convertSquareToIdx('g1')]);
    expect(game.pieceMap.w.r).toContain(convertSquareToIdx('f1'));
    expect(game.castleRights.w.k).toBe(false);
    expect(game.castleRights.w.q).toBe(false);
  });

  test('moving the rook on the kingside removes castling rights for that side', () => {
    game.makeMove('g8', 'f6');
    game.makeMove('d2', 'd4');
    game.makeMove('h8', 'g8');

    expect(game.castleRights.b.k).toBe(false);
  });

  it('can capture pieces', () => {
    game.makeMove('e4', 'd5');

    expect(game.pieceMap.w.p).toContain(convertSquareToIdx('d5'));
    expect(game.pieceMap.b.p).not.toContain(convertSquareToIdx('d5'));
  });

  it('can capture enPassant', () => {
    game.makeMove('c6', 'a5');
    game.makeMove('f1', 'e1');
    expect(game.activeColor).toBe('b');
    game.makeMove('c7', 'c5');
    game.makeMove('d5', 'c6');

    expect(game.pieceMap.w.p).toContain(convertSquareToIdx('c6'));
    expect(game.pieceMap.b.p).not.toContain(convertSquareToIdx('c5'));
  });

  test('promotion works', () => {
    game.makeMove('a5', 'c4');
    game.makeMove('c6', 'c7');
    game.makeMove('c8', 'd7');
    expect(game.activeColor).toBe('w');
    game.makeMove('c7', 'c8', 'q');

    expect(game.pieceMap.w.q).toContain(convertSquareToIdx('c8'));
  });

  describe('halfmoves increments correctly', () => {
    const game = new Game();
    it('increments on piece move if theres no capture', () => {
      expect(game.halfmoves).toBe(0);
      game.makeMove('g1', 'f3');
      expect(game.halfmoves).toBe(1);
    });

    it('resets when a pawn move is made', () => {
      expect(game.halfmoves).toBe(1);
      game.makeMove('e7', 'e5');
      expect(game.halfmoves).toBe(0);
    });

    it('resets when a capture is made', () => {
      expect(game.halfmoves).toBe(0);
      game.makeMove('b1', 'c3');
      game.makeMove('g8', 'f6');
      expect(game.halfmoves).toBe(2);
      game.makeMove('f3', 'e5');
      expect(game.halfmoves).toBe(0);
    });
  });

  test('fullmoves increments only after blacks turn', () => {
    const game = new Game();
    game.makeMove('e2', 'e4');
    expect(game.fullmoves).toBe(1);
    game.makeMove('e7', 'e5');
    expect(game.fullmoves).toBe(2);
  });
});

describe('isGameOver works', () => {
  describe('checkmate/stalemate works', () => {
    test('checkmate works', () => {
      const gameboard = new Gameboard();

      gameboard.at('h1')?.place('wk');
      gameboard.at('g1')?.place('wr');
      gameboard.at('h2')?.place('wp');
      gameboard.at('g2')?.place('wp');
      gameboard.at('f2')?.place('bn');

      const game = new Game(
        `${convertBoardToFen(gameboard.board)} w KQkq - 0 1`
      );
      expect(game.isGameOver([])).toEqual({
        checkmate: true,
        unforcedDraw: false,
        forcedDraw: false
      });
    });

    test('stalemate works', () => {
      const gameboard = new Gameboard();

      gameboard.at('h1')?.place('wk');
      gameboard.at('f1')?.place('bk');
      gameboard.at('a2')?.place('bq');

      const game = new Game(
        `${convertBoardToFen(gameboard.board)} w KQkq - 0 1`
      );
      expect(game.isGameOver([])).toEqual({
        checkmate: false,
        unforcedDraw: false,
        forcedDraw: true
      });
    });
  });

  describe('halfmoves checks work', () => {
    test('forced draw at 75 halfmoves', () => {
      const game = new Game();
      game.halfmoves = 75;

      expect(game.isGameOver([])).toEqual({
        checkmate: false,
        unforcedDraw: false,
        forcedDraw: true
      });
    });

    test('unforced draw at 50 halfmoves', () => {
      const game = new Game();
      game.halfmoves = 50;

      expect(
        game.isGameOver([
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        ])
      ).toEqual({
        checkmate: false,
        unforcedDraw: true,
        forcedDraw: false
      });
    });
  });

  describe('repetition works', () => {
    const game = new Game();
    test('threefold repetition returns an unforced draw', () => {
      expect(
        game.isGameOver([
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        ])
      ).toEqual({
        checkmate: false,
        unforcedDraw: true,
        forcedDraw: false
      });
    });
    test('fivefold repetition returns a forced draw', () => {
      expect(
        game.isGameOver([
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        ])
      ).toEqual({
        checkmate: false,
        unforcedDraw: true,
        forcedDraw: true
      });
    });
  });

  describe('draw by insufficient material works', () => {
    test('king vs king returns a draw', () => {
      const gameboard = new Gameboard();
      gameboard.at('e1').place('wk');
      gameboard.at('e2').place('bk');

      const game = new Game(
        `${convertBoardToFen(gameboard.board)} w KQkq - 0 1`
      );

      expect(game.isGameOver([])).toEqual({
        checkmate: false,
        forcedDraw: true,
        unforcedDraw: false
      });
    });

    test('king vs king + bishop returns a draw', () => {
      const gameboard = new Gameboard();
      gameboard.at('e1').place('wk');
      gameboard.at('e2').place('bk');
      gameboard.at('e4').place('bb');

      const game = new Game(
        `${convertBoardToFen(gameboard.board)} w KQkq - 0 1`
      );

      expect(game.isGameOver([])).toEqual({
        checkmate: false,
        forcedDraw: true,
        unforcedDraw: false
      });

      const gameboard2 = new Gameboard();
      gameboard.at('e1').place('bk');
      gameboard.at('e2').place('wk');
      gameboard.at('e4').place('wb');

      const game2 = new Game(
        `${convertBoardToFen(gameboard2.board)} w KQkq - 0 1`
      );

      expect(game2.isGameOver([])).toEqual({
        checkmate: false,
        forcedDraw: true,
        unforcedDraw: false
      });
    });

    test('king vs king + knight returns a draw', () => {
      const gameboard = new Gameboard();
      gameboard.at('e1').place('wk');
      gameboard.at('e2').place('bk');
      gameboard.at('e4').place('bn');

      const game = new Game(
        `${convertBoardToFen(gameboard.board)} w KQkq - 0 1`
      );

      expect(game.isGameOver([])).toEqual({
        checkmate: false,
        forcedDraw: true,
        unforcedDraw: false
      });

      const gameboard2 = new Gameboard();
      gameboard.at('e1').place('bk');
      gameboard.at('e2').place('wk');
      gameboard.at('e4').place('wn');

      const game2 = new Game(
        `${convertBoardToFen(gameboard2.board)} w KQkq - 0 1`
      );

      expect(game2.isGameOver([])).toEqual({
        checkmate: false,
        forcedDraw: true,
        unforcedDraw: false
      });
    });
  });
});

describe('moveNotation works', () => {
  const game = new Game();
  // unless a new game is created you have to run these tests together otherwise they wont work. they all use the game state

  test('basic move', () => {
    const details = game.makeMove('e2', 'e4');
    const notation = game.createMoveNotation(details);
    expect(notation).toBe('e4');
  });

  test('pawn capture', () => {
    game.makeMove('d7', 'd5');
    const details = game.makeMove('e4', 'd5');
    const notation = game.createMoveNotation(details);

    expect(notation).toBe('exd5');
  });

  test('enPassant capture', () => {
    game.makeMove('e7', 'e5');

    const details = game.makeMove('d5', 'e6');
    const notation = game.createMoveNotation(details);

    expect(notation).toBe('dxe6');
  });

  describe('multiple pieces can go to the same square', () => {
    test('different file', () => {
      game.makeMove('a7', 'a6');
      game.makeMove('b1', 'c3');
      game.makeMove('a6', 'a5');
      const details = game.makeMove('c3', 'e2');
      const notation = game.createMoveNotation(details);

      expect(notation).toBe('Nce2');
    });
    test('different rank', () => {
      game.at('e4').place('wn');
      game.makeMove('e4', 'c3');
      const notation = game.createMoveNotation({
        from: 'e4',
        to: 'c3',
        piece: 'wn'
      });

      expect(notation).toBe('N4c3');
    });
    test('different file + rank', () => {
      game.at('b5').place('wn');
      const notation = game.createMoveNotation({
        from: 'e4',
        to: 'c3',
        piece: 'wn'
      });

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
        game.createMoveNotation({
          from: 'f8',
          to: 'c4',
          piece: 'bb'
        })
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
        game.createMoveNotation({
          from: 'h3',
          to: 'f2',
          piece: 'bn'
        })
      ).toBe('Nf2#');
    });
  });

  test('promotion works', () => {
    const game = new Game();
    expect(
      game.createMoveNotation({
        from: 'a7',
        to: 'a8',
        piece: 'wp',
        promote: 'q'
      })
    ).toBe('a8=Q');
  });

  describe('castling works', () => {
    const game = new Game();
    test('kingside', () => {
      expect(
        game.createMoveNotation({
          from: 'e1',
          to: 'g1',
          piece: 'wk',
          castle: 'k'
        })
      ).toBe('0-0');
    });
    test('kingside', () => {
      expect(
        game.createMoveNotation({
          from: 'e1',
          to: 'c1',
          piece: 'wk',
          castle: 'q'
        })
      ).toBe('0-0-0');
    });
  });
});
