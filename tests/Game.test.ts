import Game from '../src/classes/Game';
import { Square } from '../src/types/types';
import { convertSquareToIdx } from '../src/utils/square';

describe('at().moves works correctly', () => {
  const game = new Game();

  test('in the inital position', () => {
    game.init();
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

describe.only('makeMoves works', () => {
  const game = new Game();
  game.init();
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
});
