import Gameboard from '../src/classes/Gameboard';
import { BOARD_SIZE } from '../src/utils/constants';
import { convertSquareToIdx, convertIdxToSquare } from '../src/utils/square';

describe('convert to idx works', () => {
  test('e4 should equal [4,3]', () => {
    expect(convertSquareToIdx('e4', BOARD_SIZE)).toEqual(28);
  });

  test('a1 should equal 0', () => {
    expect(convertSquareToIdx('a1', BOARD_SIZE)).toEqual(0);
  });

  test('h8 should equal 63', () => {
    expect(convertSquareToIdx('h8', BOARD_SIZE)).toEqual(63);
  });
});

describe('convert to square works', () => {
  test('[4,3] should equal e4', () => {
    expect(convertIdxToSquare(28, BOARD_SIZE)).toEqual('e4');
  });

  test('a1 should equal 0', () => {
    expect(convertIdxToSquare(0, BOARD_SIZE)).toEqual('a1');
  });

  test('h8 should equal 63', () => {
    expect(convertIdxToSquare(63, BOARD_SIZE)).toEqual('h8');
  });
});
