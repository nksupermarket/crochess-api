import { convertSquareToIdx, convertIdxToSquare } from '../src/utils/square';

describe('convert to idx works', () => {
  test('e4 should equal 55', () => {
    expect(convertSquareToIdx('e4')).toEqual(55);
  });

  test('a1 should equal 21', () => {
    expect(convertSquareToIdx('a1')).toEqual(21);
  });

  test('h8 should equal 98', () => {
    expect(convertSquareToIdx('h8')).toEqual(98);
  });
});

describe('convert to square works', () => {
  test('55 should equal e4', () => {
    expect(convertIdxToSquare(55)).toEqual('e4');
  });

  test('a1 should equal 21', () => {
    expect(convertIdxToSquare(21)).toEqual('a1');
  });

  test('h8 should equal 98', () => {
    expect(convertIdxToSquare(98)).toEqual('h8');
  });
});
