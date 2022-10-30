import { convertSquareToIdx, convertIdxToSquare } from '../src/utils/square';

describe('convert to idx works', () => {
  test('e4 should equal [4,3]', () => {
    expect(convertSquareToIdx('e4')).toEqual(28);
  });

  test('a1 should equal 0', () => {
    expect(convertSquareToIdx('a1')).toEqual(0);
  });

  test('h8 should equal 63', () => {
    expect(convertSquareToIdx('h8')).toEqual(63);
  });
});

describe('convert to square works', () => {
  test('[4,3] should equal e4', () => {
    expect(convertIdxToSquare(28)).toEqual('e4');
  });

  test('a1 should equal 0', () => {
    expect(convertIdxToSquare(0)).toEqual('a1');
  });

  test('h8 should equal 63', () => {
    expect(convertIdxToSquare(63)).toEqual('h8');
  });
});
