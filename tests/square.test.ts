import Gameboard from 'src/classes/Gameboard';
import { convertSquareToIdx, convertIdxToSquare } from '../src/utils/square';

describe('convert to square works', () => {
  test('e4 should equal [4,3]', () => {
    expect(convertSquareToIdx('e4')).toEqual([4, 3]);
  });

  test('a1 should equal [0,0]', () => {
    expect(convertSquareToIdx('a1')).toEqual([0, 0]);
  });

  test('h8 should equal [7,7]', () => {
    expect(convertSquareToIdx('h8')).toEqual([7, 7]);
  });
});

describe('convert to idx works', () => {
  test('[4,3] should equal e4', () => {
    expect(convertIdxToSquare([4, 3])).toEqual('e4');
  });

  test('a1 should equal [0,0]', () => {
    expect(convertIdxToSquare([0, 0])).toEqual('a1');
  });

  test('h8 should equal [7,7]', () => {
    expect(convertIdxToSquare([7, 7])).toEqual('h8');
  });
});
