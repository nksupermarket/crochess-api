import Gameboard from '../src/classes/Gameboard';
import { convertSquareToIdx } from '../src/utils/square';

describe('"at" interface works correctly', () => {
  const gameboard = new Gameboard();

  describe('place works', () => {
    test('place places a piece and pushes it to the piece map', () => {
      gameboard.at('a1')?.place('wr');
      const idx = convertSquareToIdx('a1');
      expect(gameboard.board[idx]).toBe('wr');
      expect(gameboard.pieceMap.w.r).toEqual([idx]);
    });
  });

  test('remove removes the piece from the board and piece map, if there are no more of that piece type the property is deleted', () => {
    gameboard.at('a1')?.remove();

    expect(gameboard.board[convertSquareToIdx('a1')]).toBe(null);
    expect('r' in gameboard.pieceMap.w).toEqual(false);
  });

  test('promote promotes the piece, removes the square from the piece map of the old piece type and adds it to the piece map of the new piece type', () => {
    gameboard.at('a1')?.place('bp');
    gameboard.at('a1')?.promote('q');

    const idx = convertSquareToIdx('a1');
    expect(gameboard.board[idx]).toBe('bq');
    expect('p' in gameboard.pieceMap.b).toBe(false);
    expect(gameboard.pieceMap.b.q).toEqual([idx]);
  });

  test('piece getter works', () => {
    gameboard.at('e5')?.place('wr');
    expect(gameboard.at('e5')?.piece).toBe('wr');
  });
});

test('from().to moves the piece on the board and on the piece map', () => {
  const gameboard = new Gameboard();

  gameboard.at('a1')?.place('bp');

  gameboard.from('a1')?.to('a2');

  expect(gameboard.at('a1')?.piece).toBe(null);
  expect(gameboard.at('a2')?.piece).toBe('bp');

  expect(gameboard.pieceMap.b.p).toEqual([convertSquareToIdx('a2')]);
});

test('from().to handles capturing pieces', () => {
  const gameboard = new Gameboard();

  gameboard.at('a1')?.place('bp');
  gameboard.at('b2')?.place('wp');
  gameboard.from('b2')?.to('a1');

  expect(gameboard.at('a1')?.piece).toBe('wp');
  expect(gameboard.at('b2')?.piece).toBe(null);

  expect('p' in gameboard.pieceMap.b).toEqual(false);
  expect(gameboard.pieceMap.w.p).toEqual([convertSquareToIdx('a1')]);
});

describe('castle works', () => {
  test('kingside', () => {
    const gameboard = new Gameboard();

    gameboard.at('e1')?.place('wk');
    gameboard.at('h1')?.place('wr');

    gameboard.at('e8')?.place('bk');
    gameboard.at('h8')?.place('br');

    gameboard.castle('w', 'k');
    gameboard.castle('b', 'k');

    expect(gameboard.pieceMap).toEqual({
      w: {
        k: [convertSquareToIdx('g1')],
        r: [convertSquareToIdx('f1')]
      },
      b: {
        k: [convertSquareToIdx('g8')],
        r: [convertSquareToIdx('f8')]
      }
    });
  });

  test('queenside', () => {
    const gameboard = new Gameboard();

    gameboard.at('e1')?.place('wk');
    gameboard.at('a1')?.place('wr');

    gameboard.at('e8')?.place('bk');
    gameboard.at('a8')?.place('br');

    gameboard.castle('w', 'q');
    gameboard.castle('b', 'q');

    expect(gameboard.pieceMap).toEqual({
      w: {
        k: [convertSquareToIdx('c1')],
        r: [convertSquareToIdx('d1')]
      },
      b: {
        k: [convertSquareToIdx('c8')],
        r: [convertSquareToIdx('d8')]
      }
    });
  });

  it('does nothing if the rook is not there', () => {
    const gameboard = new Gameboard();

    gameboard.at('e1')?.place('wk');

    gameboard.at('e8')?.place('bk');

    gameboard.castle('w', 'q');
    gameboard.castle('b', 'k');

    expect(gameboard.pieceMap).toEqual({
      w: {
        k: [convertSquareToIdx('e1')]
      },
      b: {
        k: [convertSquareToIdx('e8')]
      }
    });
  });
});
