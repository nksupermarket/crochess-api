import Gameboard from '../src/classes/Gameboard';
import { convertSquareToIdx } from '../src/utils/square';

test('init works correctly', () => {
  const gameboard = new Gameboard();

  gameboard.init();

  expect(gameboard.board[0]).toEqual('wr');
  expect(gameboard.board[1]).toEqual('wn');
  expect(gameboard.board[2]).toEqual('wb');
  expect(gameboard.board[3]).toEqual('wq');
  expect(gameboard.board[4]).toEqual('wk');
  expect(gameboard.board[5]).toEqual('wb');
  expect(gameboard.board[6]).toEqual('wn');
  expect(gameboard.board[7]).toEqual('wr');

  expect(gameboard.board[8]).toEqual('wp');
  expect(gameboard.board[9]).toEqual('wp');
  expect(gameboard.board[10]).toEqual('wp');
  expect(gameboard.board[11]).toEqual('wp');
  expect(gameboard.board[12]).toEqual('wp');
  expect(gameboard.board[13]).toEqual('wp');
  expect(gameboard.board[14]).toEqual('wp');
  expect(gameboard.board[15]).toEqual('wp');

  expect(gameboard.board[56]).toEqual('br');
  expect(gameboard.board[57]).toEqual('bn');
  expect(gameboard.board[58]).toEqual('bb');
  expect(gameboard.board[59]).toEqual('bq');
  expect(gameboard.board[60]).toEqual('bk');
  expect(gameboard.board[61]).toEqual('bb');
  expect(gameboard.board[62]).toEqual('bn');
  expect(gameboard.board[63]).toEqual('br');

  expect(gameboard.board[48]).toEqual('bp');
  expect(gameboard.board[49]).toEqual('bp');
  expect(gameboard.board[50]).toEqual('bp');
  expect(gameboard.board[51]).toEqual('bp');
  expect(gameboard.board[52]).toEqual('bp');
  expect(gameboard.board[53]).toEqual('bp');
  expect(gameboard.board[54]).toEqual('bp');
  expect(gameboard.board[55]).toEqual('bp');
});

describe('"at" interface works correctly', () => {
  const gameboard = new Gameboard();
  test('place places a piece and pushes it to the piece map', () => {
    gameboard.at('a1')?.place('wr');

    expect(gameboard.board[0]).toBe('wr');
    expect(gameboard.pieceMap.w.r).toEqual([0]);
  });

  test('remove removes the piece from the board and piece map, if there are no more of that piece type the property is deleted', () => {
    gameboard.at('a1')?.remove();

    expect(gameboard.board[0]).toBe(null);
    expect(gameboard.pieceMap.w.r).toEqual(undefined);
  });

  test('promote promotes the piece, removes the square from the piece map of the old piece type and adds it to the piece map of the new piece type', () => {
    gameboard.at('a1')?.place('bp');
    gameboard.at('a1')?.promote('q');

    expect(gameboard.board[0]).toBe('bq');
    expect(gameboard.pieceMap.b.p).toBe(undefined);
    expect(gameboard.pieceMap.b.q).toEqual([0]);
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
