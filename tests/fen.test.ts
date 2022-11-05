import Gameboard from '../src/classes/Gameboard';
import Game from '../src/classes/Game';
import { convertFromFen, convertToFen } from '../src/utils/fen';
import { convertSquareToIdx } from '../src/utils/square';

describe('convertFromFen works', () => {
  const gameboard = new Gameboard();

  it('works for starting position', () => {
    gameboard.init();
    expect(
      convertFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        .board
    ).toEqual(gameboard.board);
  });

  it('works when pieces are in the middle of the board', () => {
    gameboard.from(convertSquareToIdx('e2'))?.to(convertSquareToIdx('e4'));

    expect(
      convertFromFen(
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      ).board
    ).toEqual(gameboard.board);
  });
});

describe('convertToFen works', () => {
  const gameboard = new Gameboard();
  gameboard.init();

  const game = new Game({
    board: gameboard.board
  });

  it('works for starting position', () => {
    expect(convertToFen(game)).toBe(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0'
    );
  });

  it('works when a piece moves', () => {
    game.from(convertSquareToIdx('e2')).to(convertSquareToIdx('e4'));
    game.enPassant = convertSquareToIdx('e3');
    game.activeColor = 'b';

    expect(convertToFen(game)).toBe(
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 0'
    );
  });
});
