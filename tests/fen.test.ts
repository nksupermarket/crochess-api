import { Files, Square } from 'src/types/types';
import Gameboard from '../src/classes/Gameboard';
import { BOARD_SIZE } from '../src/utils/constants';
import { convertFromFen, convertToFen } from '../src/utils/fen';

describe('convertFromFen works', () => {
  const gameboard = new Gameboard(BOARD_SIZE);

  it('works for starting position', () => {
    gameboard.init();
    expect(
      convertFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        .board
    ).toEqual(gameboard.board);
  });

  it('works when pieces are in the middle of the board', () => {
    gameboard.from('e2')?.to('e4');

    expect(
      convertFromFen(
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      ).board
    ).toEqual(gameboard.board);
  });
});

describe('convertToFen works', () => {
  const gameboard = new Gameboard(BOARD_SIZE);

  it('works for starting position', () => {
    gameboard.init();
    expect(convertToFen(gameboard.board)).toContain(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
    );
  });

  it('works when a pice moves', () => {
    gameboard.from('e2')?.to('e4');

    expect(convertToFen(gameboard.board)).toContain(
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR'
    );
  });
});
