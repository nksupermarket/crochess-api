import { isFenStr } from '../src/utils/typeCheck';

test('isFenStr works', () => {
  expect(
    isFenStr('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  ).toBe(true);
});
