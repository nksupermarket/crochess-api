import Gameboard from '../src/classes/Gameboard';
import {} from '../src/utils/constants';
import {
  getPieceMoves,
  getPawnMoves,
  exportedForTesting
} from '../src/utils/getMoves';
import { convertSquareToIdx } from '../src/utils/square';

// wrote this function because I changed the board implementation from a 2d array to a 1d array. Instead of manually converting each expected array I wrote this function instead
function convertArrToIdx(arr: number[][]) {
  return arr.map((v) => {
    const [rank, file] = v;
    return rank * 8 + file;
  });
}

describe('getPieceMoves works', () => {
  describe('bishop moves works', () => {
    it('works on an empty board', () => {
      const board = new Gameboard().board;
      expect(getPieceMoves('b', board, 36).sort()).toEqual(
        [0, 9, 18, 27, 45, 54, 63, 57, 50, 43, 29, 22, 15].sort()
      );
    });

    it('works when a piece of the same color is blocking', () => {
      const board = new Gameboard().board;
      board[36] = 'wb';
      board[45] = 'wp';

      expect(getPieceMoves('b', board, 36).sort()).toEqual(
        [0, 9, 18, 27, 57, 50, 43, 29, 22, 15].sort()
      );
    });

    it('works when a piece of the opposite color is blocking', () => {
      const board = new Gameboard().board;
      board[36] = 'wb';
      board[27] = 'bn';
      expect(getPieceMoves('b', board, 36).sort()).toEqual(
        [27, 45, 54, 63, 57, 50, 43, 29, 22, 15].sort()
      );
    });

    it('works when pieces of both colors block at the same time', () => {
      const board = new Gameboard().board;
      board[36] = 'wb';
      board[27] = 'bn';
      board[45] = 'wp';

      expect(getPieceMoves('b', board, 36).sort()).toEqual(
        [27, 57, 50, 43, 29, 22, 15].sort()
      );
    });
  });

  describe('knight moves works', () => {
    const board = new Gameboard().board;

    expect(getPieceMoves('n', board, 35).sort()).toEqual(
      [18, 20, 25, 29, 45, 41, 50, 52].sort()
    );
  });

  describe('rook moves works', () => {
    it('works on an empty board', () => {
      const board = new Gameboard().board;
      expect(getPieceMoves('r', board, 36).sort()).toEqual(
        convertArrToIdx([
          [3, 4],
          [2, 4],
          [1, 4],
          [0, 4],
          [5, 4],
          [6, 4],
          [7, 4],
          [4, 3],
          [4, 2],
          [4, 1],
          [4, 0],
          [4, 5],
          [4, 6],
          [4, 7]
        ]).sort()
      );
    });

    it('works when a piece of the same color is blocking', () => {
      const board = new Gameboard().board;
      board[36] = 'wr';
      board[44] = 'wp';

      expect(getPieceMoves('r', board, 36).sort()).toEqual(
        convertArrToIdx([
          [3, 4],
          [2, 4],
          [1, 4],
          [0, 4],
          [4, 3],
          [4, 2],
          [4, 1],
          [4, 0],
          [4, 5],
          [4, 6],
          [4, 7]
        ]).sort()
      );
    });

    it('works when a piece of the opposite color is blocking', () => {
      const board = new Gameboard().board;
      board[36] = 'wr';
      board[35] = 'bn';
      expect(getPieceMoves('r', board, 36).sort()).toEqual(
        convertArrToIdx([
          [3, 4],
          [2, 4],
          [1, 4],
          [0, 4],
          [5, 4],
          [6, 4],
          [7, 4],
          [4, 3],
          [4, 5],
          [4, 6],
          [4, 7]
        ]).sort()
      );
    });

    it('works when pieces of both colors block at the same time', () => {
      const board = new Gameboard().board;
      board[36] = 'wr';
      board[35] = 'bn';
      board[44] = 'wp';

      expect(getPieceMoves('r', board, 36).sort()).toEqual(
        convertArrToIdx([
          [3, 4],
          [2, 4],
          [1, 4],
          [0, 4],
          [4, 3],
          [4, 5],
          [4, 6],
          [4, 7]
        ]).sort()
      );
    });
  });

  test('queen moves works', () => {
    const board = new Gameboard().board;
    expect(getPieceMoves('q', board, 36).sort()).toEqual(
      convertArrToIdx([
        [3, 4],
        [2, 4],
        [1, 4],
        [0, 4],
        [5, 4],
        [6, 4],
        [7, 4],
        [4, 3],
        [4, 2],
        [4, 1],
        [4, 0],
        [4, 5],
        [4, 6],
        [4, 7],
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [5, 5],
        [6, 6],
        [7, 7],
        [7, 1],
        [6, 2],
        [5, 3],
        [3, 5],
        [2, 6],
        [1, 7]
      ]).sort()
    );
  });

  test('king moves works', () => {
    const board = new Gameboard().board;
    expect(getPieceMoves('k', board, 36).sort()).toEqual(
      convertArrToIdx([
        [3, 3],
        [5, 5],
        [4, 3],
        [4, 5],
        [3, 4],
        [3, 5],
        [5, 3],
        [5, 4]
      ]).sort()
    );
  });
});

describe('getPawnMoves works', () => {
  const board = new Gameboard().board;

  it('works on an empty board', () => {
    expect(getPawnMoves(board, 'w', 36).sort()).toEqual(
      convertArrToIdx([[5, 4]])
    );
  });

  it('works when pawn is on start square', () => {
    expect(getPawnMoves(board, 'w', 12).sort()).toEqual(
      convertArrToIdx([
        [3, 4],
        [2, 4]
      ]).sort()
    );

    expect(getPawnMoves(board, 'b', 52).sort()).toEqual(
      convertArrToIdx([
        [5, 4],
        [4, 4]
      ]).sort()
    );
  });

  describe('it works with captures', () => {
    it('works', () => {
      const board = new Gameboard().board;

      board[45] = 'bp';
      board[43] = 'bp';
      expect(getPawnMoves(board, 'w', 36).sort()).toEqual(
        convertArrToIdx([
          [5, 4],
          [5, 5],
          [5, 3]
        ]).sort()
      );

      board[35] = 'wp';
      board[33] = 'wp';

      expect(getPawnMoves(board, 'b', 42).sort()).toEqual(
        convertArrToIdx([
          [4, 2],
          [4, 3],
          [4, 1]
        ]).sort()
      );
    });

    it('doesnt include own pieces', () => {
      const board = new Gameboard().board;

      board[45] = 'wp';
      board[43] = 'wb';
      expect(getPawnMoves(board, 'w', 36).sort()).toEqual(
        convertArrToIdx([[5, 4]]).sort()
      );

      board[35] = 'bp';
      board[33] = 'bb';

      expect(getPawnMoves(board, 'b', 42).sort()).toEqual(
        convertArrToIdx([[4, 2]]).sort()
      );
    });

    it('works with enPassant', () => {
      expect(getPawnMoves(board, 'w', 36, 43).sort()).toEqual(
        convertArrToIdx([
          [5, 4],
          [5, 3]
        ]).sort()
      );
    });

    it('doesnt include enPassant square if its not a legal move for the pawn', () => {
      expect(getPawnMoves(board, 'w', 36, 42).sort()).toEqual(
        convertArrToIdx([[5, 4]]).sort()
      );
    });
  });
});

describe('isPiecePinned', () => {
  const { isPiecePinned } = exportedForTesting;

  test('works on y axis', () => {
    const gameboard = new Gameboard();
    gameboard.at(convertSquareToIdx('e2'))?.placePiece('wp');
    gameboard.at(convertSquareToIdx('e1'))?.placePiece('wk');
    gameboard.at(convertSquareToIdx('e8'))?.placePiece('bq');

    expect(isPiecePinned(12, 4, 'b', gameboard.board)).toBe(8);
  });

  test('works on x axis', () => {
    const gameboard = new Gameboard();
    gameboard.at(convertSquareToIdx('b1'))?.placePiece('wp');
    gameboard.at(convertSquareToIdx('e1'))?.placePiece('wk');
    gameboard.at(convertSquareToIdx('a1'))?.placePiece('bq');

    expect(isPiecePinned(1, 4, 'b', gameboard.board)).toBe(-1);
  });

  describe('works on diagonals', () => {
    test('upper left', () => {
      const gameboard = new Gameboard();
      gameboard.at(convertSquareToIdx('e1'))?.placePiece('wk');
      gameboard.at(convertSquareToIdx('d2'))?.placePiece('wp');
      gameboard.at(convertSquareToIdx('b4'))?.placePiece('bq');

      expect(isPiecePinned(11, 4, 'b', gameboard.board)).toBe(7);
    });
    test('upper right', () => {
      const gameboard = new Gameboard();
      gameboard.at(convertSquareToIdx('e1'))?.placePiece('wk');
      gameboard.at(convertSquareToIdx('f2'))?.placePiece('wp');
      gameboard.at(convertSquareToIdx('h4'))?.placePiece('bq');

      expect(isPiecePinned(13, 4, 'b', gameboard.board)).toBe(9);
    });
    test('bottom left', () => {
      const gameboard = new Gameboard();
      gameboard.at(convertSquareToIdx('e4'))?.placePiece('wk');
      gameboard.at(convertSquareToIdx('d3'))?.placePiece('wr');
      gameboard.at(convertSquareToIdx('b1'))?.placePiece('bb');

      expect(isPiecePinned(19, 28, 'b', gameboard.board)).toBe(-9);
    });
    test('bottom right', () => {
      const gameboard = new Gameboard();
      gameboard.at(convertSquareToIdx('e4'))?.placePiece('wk');
      gameboard.at(convertSquareToIdx('f3'))?.placePiece('wr');
      gameboard.at(convertSquareToIdx('h1'))?.placePiece('bb');

      expect(isPiecePinned(21, 28, 'b', gameboard.board)).toBe(-7);
    });
  });
});

describe('getSquaresBetweenTwoSquares works', () => {
  const { getSquaresBetweenTwoSquares } = exportedForTesting;

  test('when squares are on same file', () => {
    expect(
      Object.keys(getSquaresBetweenTwoSquares(0, 56) as object)
        .map((v) => Number(v))
        .sort()
    ).toEqual([8, 16, 24, 32, 40, 48].sort());

    expect(
      Object.keys(getSquaresBetweenTwoSquares(56, 0) as object)
        .map((v) => Number(v))
        .sort()
    ).toEqual([8, 16, 24, 32, 40, 48].sort());
  });

  test('when squares are on the same rank', () => {
    expect(
      Object.keys(getSquaresBetweenTwoSquares(0, 7) as object)
        .map((v) => Number(v))
        .sort()
    ).toEqual([1, 2, 3, 4, 5, 6].sort());
  });

  test('diagonals', () => {
    expect(
      Object.keys(getSquaresBetweenTwoSquares(11, 29) as object)
        .map((v) => Number(v))
        .sort()
    ).toEqual([20].sort());

    expect(
      Object.keys(getSquaresBetweenTwoSquares(15, 29) as object)
        .map((v) => Number(v))
        .sort()
    ).toEqual([22].sort());
  });
});
