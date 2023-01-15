import { BOARD_IDX } from '../src/utils/constants';
import { SquareIdx } from '../src/types/types';
import { createBoard, init } from '../src/utils/board';

test('init works correctly', () => {
  const board = init(createBoard());

  expect(board[BOARD_IDX[0]]).toEqual('wr');
  expect(board[BOARD_IDX[1]]).toEqual('wn');
  expect(board[BOARD_IDX[2]]).toEqual('wb');
  expect(board[BOARD_IDX[3]]).toEqual('wq');
  expect(board[BOARD_IDX[4]]).toEqual('wk');
  expect(board[BOARD_IDX[5]]).toEqual('wb');
  expect(board[BOARD_IDX[6]]).toEqual('wn');
  expect(board[BOARD_IDX[7]]).toEqual('wr');

  expect(board[BOARD_IDX[8]]).toEqual('wp');
  expect(board[BOARD_IDX[9]]).toEqual('wp');
  expect(board[BOARD_IDX[10]]).toEqual('wp');
  expect(board[BOARD_IDX[11]]).toEqual('wp');
  expect(board[BOARD_IDX[12]]).toEqual('wp');
  expect(board[BOARD_IDX[13]]).toEqual('wp');
  expect(board[BOARD_IDX[14]]).toEqual('wp');
  expect(board[BOARD_IDX[15]]).toEqual('wp');

  expect(board[BOARD_IDX[56]]).toEqual('br');
  expect(board[BOARD_IDX[57]]).toEqual('bn');
  expect(board[BOARD_IDX[58]]).toEqual('bb');
  expect(board[BOARD_IDX[59]]).toEqual('bq');
  expect(board[BOARD_IDX[60]]).toEqual('bk');
  expect(board[BOARD_IDX[61]]).toEqual('bb');
  expect(board[BOARD_IDX[62]]).toEqual('bn');
  expect(board[BOARD_IDX[63]]).toEqual('br');

  expect(board[BOARD_IDX[48]]).toEqual('bp');
  expect(board[BOARD_IDX[49]]).toEqual('bp');
  expect(board[BOARD_IDX[50]]).toEqual('bp');
  expect(board[BOARD_IDX[51]]).toEqual('bp');
  expect(board[BOARD_IDX[52]]).toEqual('bp');
  expect(board[BOARD_IDX[53]]).toEqual('bp');
  expect(board[BOARD_IDX[54]]).toEqual('bp');
  expect(board[BOARD_IDX[55]]).toEqual('bp');

  expect(
    board.every((s, i) => {
      if (BOARD_IDX.includes(i as SquareIdx)) return s !== 0;
      return true;
    })
  ).toBe(true);
});
