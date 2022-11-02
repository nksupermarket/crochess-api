import Gameboard from '../src/classes/Gameboard';
import { Square } from '../src/types/types';
import {} from '../src/utils/constants';
import {
  getPieceMoves,
  getPawnMoves,
  exportedForTesting,
  getLegalKingMoves,
  getChecks,
  getLegalMoves
} from '../src/utils/getMoves';
import { convertIdxToSquare, convertSquareToIdx } from '../src/utils/square';

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

    it('can capture own pieces with flag', () => {
      const board = new Gameboard().board;
      board[36] = 'wb';
      board[27] = 'bn';
      board[45] = 'wp';

      expect(getPieceMoves('b', board, 36, undefined, true).sort()).toEqual(
        [27, 45, 57, 50, 43, 29, 22, 15].sort()
      );
    });
  });

  describe('knight moves works', () => {
    test('works on an empty board', () => {
      const board = new Gameboard().board;

      expect(getPieceMoves('n', board, 35).sort()).toEqual(
        [18, 20, 25, 29, 45, 41, 50, 52].sort()
      );
    });

    it('cannot capture own pieces without flag', () => {
      const gameboard = new Gameboard();

      gameboard.at(18).place('wp');
      gameboard.at(35).place('wn');

      expect(getPieceMoves('n', gameboard.board, 35).sort()).toEqual(
        [20, 25, 29, 45, 41, 50, 52].sort()
      );
    });

    it('includes own pieces with flag', () => {
      const gameboard = new Gameboard();

      gameboard.at(18).place('wp');
      gameboard.at(35).place('wn');

      expect(
        getPieceMoves('n', gameboard.board, 35, undefined, true).sort()
      ).toEqual([18, 20, 25, 29, 45, 41, 50, 52].sort());
    });
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

    it('can capture own piece with flag', () => {
      const board = new Gameboard().board;
      board[36] = 'wr';
      board[35] = 'bn';
      board[44] = 'wp';

      expect(getPieceMoves('r', board, 36, undefined, true).sort()).toEqual(
        convertArrToIdx([
          [3, 4],
          [2, 4],
          [1, 4],
          [0, 4],
          [4, 3],
          [4, 5],
          [4, 6],
          [4, 7]
        ])
          .concat([44])
          .sort()
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

  test('pawns can jump two squares on their first move', () => {
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
    gameboard.at(convertSquareToIdx('e2'))?.place('wp');
    gameboard.at(convertSquareToIdx('e1'))?.place('wk');
    gameboard.at(convertSquareToIdx('e8'))?.place('bq');

    expect(isPiecePinned(12, 4, 'b', gameboard.board)).toBe(8);
  });

  test('works on x axis', () => {
    const gameboard = new Gameboard();
    gameboard.at(convertSquareToIdx('b1'))?.place('wp');
    gameboard.at(convertSquareToIdx('e1'))?.place('wk');
    gameboard.at(convertSquareToIdx('a1'))?.place('bq');

    expect(isPiecePinned(1, 4, 'b', gameboard.board)).toBe(-1);
  });

  describe('works on diagonals', () => {
    test('upper left', () => {
      const gameboard = new Gameboard();
      gameboard.at(convertSquareToIdx('e1'))?.place('wk');
      gameboard.at(convertSquareToIdx('d2'))?.place('wp');
      gameboard.at(convertSquareToIdx('b4'))?.place('bq');

      expect(isPiecePinned(11, 4, 'b', gameboard.board)).toBe(7);
    });
    test('upper right', () => {
      const gameboard = new Gameboard();
      gameboard.at(convertSquareToIdx('e1'))?.place('wk');
      gameboard.at(convertSquareToIdx('f2'))?.place('wp');
      gameboard.at(convertSquareToIdx('h4'))?.place('bq');

      expect(isPiecePinned(13, 4, 'b', gameboard.board)).toBe(9);
    });
    test('bottom left', () => {
      const gameboard = new Gameboard();
      gameboard.at(convertSquareToIdx('e4'))?.place('wk');
      gameboard.at(convertSquareToIdx('d3'))?.place('wr');
      gameboard.at(convertSquareToIdx('b1'))?.place('bb');

      expect(isPiecePinned(19, 28, 'b', gameboard.board)).toBe(-9);
    });
    test('bottom right', () => {
      const gameboard = new Gameboard();
      gameboard.at(convertSquareToIdx('e4'))?.place('wk');
      gameboard.at(convertSquareToIdx('f3'))?.place('wr');
      gameboard.at(convertSquareToIdx('h1'))?.place('bb');

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

describe('getLegalKingMoves works', () => {
  test('controlled squares are not legal', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('e8')).place('bk');
    gameboard.at(convertSquareToIdx('f1')).place('wq');
    gameboard.at(convertSquareToIdx('d1')).place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        gameboard.pieceMap.w,
        {
          k: false,
          q: false
        },
        gameboard.board
      )
    ).toEqual([convertSquareToIdx('e7')]);
  });

  test('squares xrayed by piece are not legal', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('d7')).place('bk');
    gameboard.at(convertSquareToIdx('b5')).place('wb');

    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        gameboard.pieceMap.w,
        {
          k: false,
          q: false
        },
        gameboard.board
      )
    ).toEqual(
      getPieceMoves('k', gameboard.board, gameboard.pieceMap.b.k[0]).filter(
        (s) => s !== convertSquareToIdx('c6') && s !== convertSquareToIdx('e8')
      )
    );
  });

  it('doesnt show squares controlled by pawns', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('d7')).place('bk');
    gameboard.at(convertSquareToIdx('b5')).place('wp');

    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        gameboard.pieceMap.w,
        {
          k: false,
          q: false
        },
        gameboard.board
      )
    ).toEqual(
      getPieceMoves('k', gameboard.board, gameboard.pieceMap.b.k[0]).filter(
        (s) => s !== convertSquareToIdx('c6')
      )
    );
  });

  it('doesnt include squares protected by rooks', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('e8')).place('bk');
    gameboard.at(convertSquareToIdx('f8')).place('wr');
    gameboard.at(convertSquareToIdx('f1')).place('wq');
    gameboard.at(convertSquareToIdx('d1')).place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        gameboard.pieceMap.w,
        {
          k: false,
          q: false
        },
        gameboard.board
      )
    ).toEqual([convertSquareToIdx('e7')]);
  });

  it('doesnt include squares protected by bishops', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('e8')).place('bk');
    gameboard.at(convertSquareToIdx('f8')).place('wr');
    gameboard.at(convertSquareToIdx('g7')).place('wb');
    gameboard.at(convertSquareToIdx('d1')).place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        gameboard.pieceMap.w,
        {
          k: false,
          q: false
        },
        gameboard.board
      )
    ).toEqual([convertSquareToIdx('e7')]);
  });

  it('doesnt include squares protected by queens', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('e8')).place('bk');
    gameboard.at(convertSquareToIdx('f8')).place('wr');
    gameboard.at(convertSquareToIdx('g8')).place('wq');
    gameboard.at(convertSquareToIdx('d1')).place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        gameboard.pieceMap.w,
        {
          k: false,
          q: false
        },
        gameboard.board
      )
    ).toEqual([convertSquareToIdx('e7')]);
  });

  it('doesnt include squares protected by pawns', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('e8')).place('bk');
    gameboard.at(convertSquareToIdx('f8')).place('wr');
    gameboard.at(convertSquareToIdx('g7')).place('wp');
    gameboard.at(convertSquareToIdx('d1')).place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        gameboard.pieceMap.w,
        {
          k: false,
          q: false
        },
        gameboard.board
      )
    ).toEqual([convertSquareToIdx('e7')]);
  });

  describe('castling stuff', () => {
    it('includes castle squares', () => {
      const gameboard = new Gameboard();

      expect(
        getLegalKingMoves(
          convertSquareToIdx('e1'),
          gameboard.pieceMap.b,
          {
            k: true,
            q: true
          },
          gameboard.board
        ).sort()
      ).toEqual(
        ['e2', 'f2', 'd2', 'd1', 'f1', 'g1', 'c1']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('doesnt include castle squares when square is threatened', () => {
      const gameboard = new Gameboard();

      gameboard.at('g5').place('br');
      gameboard.at('b2').place('bp');

      expect(
        getLegalKingMoves(
          convertSquareToIdx('e1'),
          gameboard.pieceMap.b,
          {
            k: true,
            q: true
          },
          gameboard.board
        ).sort()
      ).toEqual(
        ['e2', 'f2', 'd2', 'd1', 'f1']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('doesnt include castle squares when square in between is threatened', () => {
      const gameboard = new Gameboard();

      gameboard.at('f5').place('br');
      gameboard.at('c2').place('bp');

      expect(
        getLegalKingMoves(
          convertSquareToIdx('e1'),
          gameboard.pieceMap.b,
          {
            k: true,
            q: true
          },
          gameboard.board
        ).sort()
      ).toEqual(
        ['e2', 'd2'].map((s) => convertSquareToIdx(s as Square)).sort()
      );
    });

    it('doesnt include castle squares when castle squares are occupied', () => {
      const gameboard = new Gameboard();

      gameboard.at('e1').place('wk');
      gameboard.at('d1').place('wq');
      gameboard.at('g1').place('wn');

      expect(
        getLegalKingMoves(
          convertSquareToIdx('e1'),
          gameboard.pieceMap.b,
          {
            k: true,
            q: true
          },
          gameboard.board
        ).sort()
      ).toEqual(
        ['e2', 'f2', 'd2', 'f1']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });
  });
});

describe('get checks work', () => {
  test('knight checks', () => {
    const gameboard = new Gameboard();

    gameboard.at('e4').place('wk');
    gameboard.at('c3').place('bn');
    gameboard.at('c5').place('bn');
    expect(
      getChecks('b', convertSquareToIdx('e4'), gameboard.board).sort()
    ).toEqual(['c3', 'c5'].map((s) => convertSquareToIdx(s as Square)).sort());

    gameboard.at('c3').remove();
    gameboard.at('c5').remove();
    gameboard.at('d2').place('bn');
    gameboard.at('d6').place('bn');
    expect(
      getChecks('b', convertSquareToIdx('e4'), gameboard.board).sort()
    ).toEqual(['d2', 'd6'].map((s) => convertSquareToIdx(s as Square)).sort());

    gameboard.at('d2').remove();
    gameboard.at('d6').remove();
    gameboard.at('f2').place('bn');
    gameboard.at('f6').place('bn');
    expect(
      getChecks('b', convertSquareToIdx('e4'), gameboard.board).sort()
    ).toEqual(['f2', 'f6'].map((s) => convertSquareToIdx(s as Square)).sort());

    gameboard.at('f2').remove();
    gameboard.at('f6').remove();
    gameboard.at('g3').place('bn');
    gameboard.at('g5').place('bn');
    expect(
      getChecks('b', convertSquareToIdx('e4'), gameboard.board).sort()
    ).toEqual(['g3', 'g5'].map((s) => convertSquareToIdx(s as Square)).sort());
  });

  describe('pawn checks', () => {
    test('white pawn black king', () => {
      const gameboard = new Gameboard();

      gameboard.at('e5').place('bk');
      gameboard.at('d4').place('wp');
      gameboard.at('f4').place('wp');

      expect(
        getChecks('w', convertSquareToIdx('e5'), gameboard.board).sort()
      ).toEqual(
        ['d4', 'f4'].map((s) => convertSquareToIdx(s as Square)).sort()
      );
    });

    test('black pawn white king', () => {
      const gameboard = new Gameboard();

      gameboard.at('e5').place('wk');
      gameboard.at('d6').place('bp');
      gameboard.at('f6').place('bp');

      expect(
        getChecks('b', convertSquareToIdx('e5'), gameboard.board).sort()
      ).toEqual(
        ['d6', 'f6'].map((s) => convertSquareToIdx(s as Square)).sort()
      );
    });
  });

  describe('queen checks', () => {
    test('on a diagonal', () => {
      const gameboard = new Gameboard();

      gameboard.at('e5').place('wk');
      gameboard.at('b8').place('bq');

      expect(getChecks('b', convertSquareToIdx('e5'), gameboard.board)).toEqual(
        ['b8'].map((s) => convertSquareToIdx(s as Square))
      );
    });

    it('shouldnt include blocked checks on a diagonal', () => {
      const gameboard = new Gameboard();

      gameboard.at('e5').place('wk');
      gameboard.at('b8').place('bq');
      gameboard.at('c7').place('wr');

      expect(
        getChecks('b', convertSquareToIdx('e5'), gameboard.board).length
      ).toEqual(0);
    });

    test('on a file', () => {
      const gameboard = new Gameboard();

      gameboard.at('e5').place('wk');
      gameboard.at('e8').place('bq');

      expect(getChecks('b', convertSquareToIdx('e5'), gameboard.board)).toEqual(
        ['e8'].map((s) => convertSquareToIdx(s as Square))
      );
    });

    it('shouldnt included blocked checks on a file', () => {
      const gameboard = new Gameboard();

      gameboard.at('e5').place('wk');
      gameboard.at('e8').place('bq');
      gameboard.at('e7').place('wr');

      expect(
        getChecks('b', convertSquareToIdx('e5'), gameboard.board).length
      ).toEqual(0);
    });
  });
});

describe.only('getLegalMoves works', () => {
  test('pieces have no moves if there are two checks', () => {
    const gameboard = new Gameboard();

    gameboard.at('a1').place('wk');
    gameboard.at('h8').place('bb');
    gameboard.at('a8').place('br');
    gameboard.at('h1').place('wr');

    expect(
      getLegalMoves(
        'r',
        gameboard.board,
        'w',
        convertSquareToIdx('h1'),
        0,
        ['h8', 'a8'].map((s) => convertSquareToIdx(s as Square))
      ).length
    ).toBe(0);
  });

  test('pieces have no moves if there is one check and they cant block or capture', () => {
    const gameboard = new Gameboard();

    gameboard.at('a1').place('wk');
    gameboard.at('g7').place('bb');
    gameboard.at('h1').place('wr');

    expect(
      getLegalMoves(
        'r',
        gameboard.board,
        'w',
        convertSquareToIdx('h1'),
        0,
        ['g7'].map((s) => convertSquareToIdx(s as Square))
      ).length
    ).toBe(0);
  });

  test('pieces can capture check', () => {
    const gameboard = new Gameboard();

    gameboard.at('a1').place('wk');
    gameboard.at('h8').place('bb');
    gameboard.at('h1').place('wr');

    expect(
      getLegalMoves(
        'r',
        gameboard.board,
        'w',
        convertSquareToIdx('h1'),
        0,
        ['h8'].map((s) => convertSquareToIdx(s as Square))
      )
    ).toEqual([63]);
  });

  test('pieces can block', () => {
    const gameboard = new Gameboard();

    gameboard.at('a1').place('wk');
    gameboard.at('h8').place('bb');
    gameboard.at('d1').place('wn');

    expect(
      getLegalMoves(
        'n',
        gameboard.board,
        'w',
        convertSquareToIdx('d1'),
        0,
        ['h8'].map((s) => convertSquareToIdx(s as Square))
      ).sort()
    ).toEqual([convertSquareToIdx('b2'), convertSquareToIdx('c3')].sort());
  });

  test('pawns can block enPassant', () => {
    const gameboard = new Gameboard();

    gameboard.at('h1').place('wk');
    gameboard.at('a8').place('bb');
    gameboard.at('b5').place('wp');
    gameboard.at('c5').place('bp');

    expect(
      getLegalMoves(
        'p',
        gameboard.board,
        'w',
        convertSquareToIdx('b5'),
        7,
        ['a8'].map((s) => convertSquareToIdx(s as Square)),
        convertSquareToIdx('c6')
      )
    ).toEqual([convertSquareToIdx('c6')]);
  });

  test('pieces can only move in the direction/opposite direction of the pin', () => {
    const gameboard = new Gameboard();

    gameboard.at('e1').place('wk');
    gameboard.at('e5').place('br');
    gameboard.at('e3').place('wq');

    expect(
      getLegalMoves(
        'q',
        gameboard.board,
        'w',
        convertSquareToIdx('e3'),
        convertSquareToIdx('e1'),
        []
      ).sort()
    ).toEqual(
      ['e2', 'e4', 'e5'].map((s) => convertSquareToIdx(s as Square)).sort()
    );
  });
});
