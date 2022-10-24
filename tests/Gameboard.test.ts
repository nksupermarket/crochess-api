import Gameboard from '../src/classes/Gameboard';
import { BOARD_SIZE } from '../src/utils/constants';

test('init works correctly', () => {
  const gameboard = new Gameboard(BOARD_SIZE);

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
