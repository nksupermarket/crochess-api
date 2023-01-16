import Game from '../src/classes/Game';
import Gameboard from '../src/classes/Gameboard';
import { PromotePieceType, Square } from '../src/types/types';
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

  it.only('doesnt make errors', () => {
    const movesStr =
      'e2e4 b8c6 d2d4 d7d5 e4e5 g8h6 c1h6 g7h6 h2h4 f8g7 g1f3 c8g4 c2c3 e8g8 b1d2 f7f6 e5f6 f8f6 f1e2 f6g6 d1b3 a8b8 e1c1 g4f5 h1g1 g6d6';

    const moves = movesStr.split(' ');

    moves.forEach((move) => {
      const from = move.slice(0, 2) as Square;
      const to = move.slice(2, 4) as Square;
      const promote = move[5] as PromotePieceType | undefined;
      game.makeMove(from, to, promote);
    });

    expect(game.board[convertSquareToIdx('d6')]).toBe('br');
  });

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
