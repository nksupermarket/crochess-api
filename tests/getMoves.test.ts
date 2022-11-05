import Gameboard from '../src/classes/Gameboard';
import { Square, SquareIdx } from '../src/types/types';
import { BOARD_IDX, VECTORS } from '../src/utils/constants';
import {
  getPieceMoves,
  getPawnMoves,
  exportedForTesting,
  getLegalKingMoves,
  getChecks,
  getLegalMoves
} from '../src/utils/getMoves';
import { convertSquareToIdx, convertIdxToSquare } from '../src/utils/square';

function convertArrToIdx(arr: number[][]) {
  return arr.map((v) => {
    const [rank, file] = v;
    return rank * 8 + file;
  });
}

describe('getPieceMoves works', () => {
  const gameboard = new Gameboard();
  beforeEach(() => (gameboard.board = gameboard.create()));

  describe('bishop moves works', () => {
    it('works on an empty board', () => {
      expect(
        getPieceMoves(
          'b',
          'b',
          gameboard.board,
          convertSquareToIdx('e4')
        ).sort()
      ).toEqual(
        [
          'd3',
          'c2',
          'b1',
          'f3',
          'g2',
          'h1',
          'f5',
          'g6',
          'h7',
          'd5',
          'c6',
          'b7',
          'a8'
        ]
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('works when a piece of the same color is blocking', () => {
      gameboard.board[convertSquareToIdx('e4')] = 'wb';
      gameboard.board[convertSquareToIdx('f5')] = 'wp';

      expect(
        getPieceMoves(
          'b',
          'w',
          gameboard.board,
          convertSquareToIdx('e4')
        ).sort()
      ).toEqual(
        ['d3', 'c2', 'b1', 'f3', 'g2', 'h1', 'd5', 'c6', 'b7', 'a8']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('works when a piece of the opposite color is blocking', () => {
      gameboard.board[convertSquareToIdx('e4')] = 'wb';
      gameboard.board[convertSquareToIdx('f5')] = 'bn';

      expect(
        getPieceMoves(
          'b',
          'w',
          gameboard.board,
          convertSquareToIdx('e4')
        ).sort()
      ).toEqual(
        ['d3', 'c2', 'b1', 'f3', 'g2', 'h1', 'f5', 'd5', 'c6', 'b7', 'a8']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('works when pieces of both colors block at the same time', () => {
      gameboard.board[convertSquareToIdx('e4')] = 'wb';
      gameboard.board[convertSquareToIdx('f3')] = 'bn';
      gameboard.board[convertSquareToIdx('f5')] = 'wp';

      expect(
        getPieceMoves(
          'b',
          'w',
          gameboard.board,
          convertSquareToIdx('e4')
        ).sort()
      ).toEqual(
        ['d3', 'c2', 'b1', 'f3', 'd5', 'c6', 'b7', 'a8']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('can capture own pieces with flag', () => {
      gameboard.board[convertSquareToIdx('e4')] = 'wb';
      gameboard.board[convertSquareToIdx('d3')] = 'bn';
      gameboard.board[convertSquareToIdx('f3')] = 'wp';

      expect(
        getPieceMoves(
          'b',
          'w',
          gameboard.board,
          convertSquareToIdx('e4'),
          undefined,
          true
        ).sort()
      ).toEqual(
        ['d3', 'f3', 'd5', 'c6', 'b7', 'a8', 'f5', 'g6', 'h7']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });
  });

  describe('knight moves works', () => {
    test('works on an empty board', () => {
      expect(
        getPieceMoves(
          'n',
          'b',
          gameboard.board,
          convertSquareToIdx('e4')
        ).sort()
      ).toEqual(
        ['f2', 'f6', 'g3', 'g5', 'd2', 'd6', 'c3', 'c5']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('cannot capture own pieces without flag', () => {
      gameboard.at('f2')?.place('wp');
      gameboard.at('e4')?.place('wn');

      expect(
        getPieceMoves(
          'n',
          'w',
          gameboard.board,
          convertSquareToIdx('e4')
        ).sort()
      ).toEqual(
        ['f6', 'g3', 'g5', 'd2', 'd6', 'c3', 'c5']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('includes own pieces with flag', () => {
      gameboard.at(convertSquareToIdx('f2'))?.place('wp');
      gameboard.at(convertSquareToIdx('e4'))?.place('wn');

      expect(
        getPieceMoves(
          'n',
          'w',
          gameboard.board,
          convertSquareToIdx('e4'),
          undefined,
          true
        ).sort()
      ).toEqual(
        ['f2', 'f6', 'g3', 'g5', 'd2', 'd6', 'c3', 'c5']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    describe('doesnt include moves that wrap around the board', () => {
      gameboard.board = gameboard.create();
      test('on the g file, 1st rank', () => {
        expect(
          getPieceMoves(
            'n',
            'w',
            gameboard.board,
            convertSquareToIdx('g1')
          ).sort()
        ).toEqual(
          ['h3', 'f3', 'e2'].map((s) => convertSquareToIdx(s as Square)).sort()
        );
      });

      test('on the h file, 2st rank', () => {
        expect(
          getPieceMoves(
            'n',
            'w',
            gameboard.board,
            convertSquareToIdx('h2')
          ).sort()
        ).toEqual(
          ['f1', 'f3', 'g4'].map((s) => convertSquareToIdx(s as Square)).sort()
        );
      });

      test('on the b file, 1st rank', () => {
        expect(
          getPieceMoves(
            'n',
            'w',
            gameboard.board,
            convertSquareToIdx('b1')
          ).sort()
        ).toEqual(
          ['a3', 'c3', 'd2'].map((s) => convertSquareToIdx(s as Square)).sort()
        );
      });

      test('on the a file, 2st rank', () => {
        expect(
          getPieceMoves(
            'n',
            'w',
            gameboard.board,
            convertSquareToIdx('a2')
          ).sort()
        ).toEqual(
          ['c1', 'c3', 'b4'].map((s) => convertSquareToIdx(s as Square)).sort()
        );
      });

      test('on the b file, 8th rank', () => {
        expect(
          getPieceMoves(
            'n',
            'w',
            gameboard.board,
            convertSquareToIdx('b8')
          ).sort()
        ).toEqual(
          ['a6', 'd7', 'c6'].map((s) => convertSquareToIdx(s as Square)).sort()
        );
      });

      test('on the a file, 7th rank', () => {
        expect(
          getPieceMoves(
            'n',
            'w',
            gameboard.board,
            convertSquareToIdx('a7')
          ).sort()
        ).toEqual(
          ['c8', 'c6', 'b5'].map((s) => convertSquareToIdx(s as Square)).sort()
        );
      });

      test('on the g file, 8th rank', () => {
        expect(
          getPieceMoves(
            'n',
            'w',
            gameboard.board,
            convertSquareToIdx('g8')
          ).sort()
        ).toEqual(
          ['h6', 'e7', 'f6'].map((s) => convertSquareToIdx(s as Square)).sort()
        );
      });

      test('on the h file, 7th rank', () => {
        expect(
          getPieceMoves(
            'n',
            'w',
            gameboard.board,
            convertSquareToIdx('h7')
          ).sort()
        ).toEqual(
          ['f8', 'f6', 'g5'].map((s) => convertSquareToIdx(s as Square)).sort()
        );
      });
    });
  });

  describe('rook moves works', () => {
    it('works on an empty board', () => {
      expect(
        getPieceMoves(
          'r',
          'w',
          gameboard.board,
          convertSquareToIdx('e5')
        ).sort()
      ).toEqual(
        [
          'a5',
          'b5',
          'c5',
          'd5',
          'f5',
          'g5',
          'h5',
          'e4',
          'e3',
          'e2',
          'e1',
          'e6',
          'e7',
          'e8'
        ]
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('works when a piece of the same color is blocking', () => {
      gameboard.board[convertSquareToIdx('e4')] = 'wr';
      gameboard.board[convertSquareToIdx('e5')] = 'wp';

      expect(
        getPieceMoves(
          'r',
          'w',
          gameboard.board,
          convertSquareToIdx('e4')
        ).sort()
      ).toEqual(
        ['e3', 'e2', 'e1', 'd4', 'c4', 'b4', 'a4', 'f4', 'g4', 'h4']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('works when a piece of the opposite color is blocking', () => {
      gameboard.board[convertSquareToIdx('e4')] = 'wr';
      gameboard.board[convertSquareToIdx('d4')] = 'bn';
      expect(
        getPieceMoves(
          'r',
          'w',
          gameboard.board,
          convertSquareToIdx('e4')
        ).sort()
      ).toEqual(
        ['e3', 'e2', 'e1', 'd4', 'f4', 'g4', 'h4', 'e5', 'e6', 'e7', 'e8']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('works when pieces of both colors block at the same time', () => {
      gameboard.board[convertSquareToIdx('e4')] = 'wr';
      gameboard.board[convertSquareToIdx('d4')] = 'bn';
      gameboard.board[convertSquareToIdx('e5')] = 'wp';

      expect(
        getPieceMoves(
          'r',
          'w',
          gameboard.board,
          convertSquareToIdx('e4')
        ).sort()
      ).toEqual(
        ['e3', 'e2', 'e1', 'd4', 'f4', 'g4', 'h4']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });

    it('can capture own piece with flag', () => {
      gameboard.board[convertSquareToIdx('e4')] = 'wr';
      gameboard.board[convertSquareToIdx('d4')] = 'bn';
      gameboard.board[convertSquareToIdx('e5')] = 'wp';

      expect(
        getPieceMoves(
          'r',
          'w',
          gameboard.board,
          convertSquareToIdx('e4'),
          undefined,
          true
        ).sort()
      ).toEqual(
        ['e5', 'e3', 'e2', 'e1', 'd4', 'f4', 'g4', 'h4']
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });
  });

  test('queen moves works', () => {
    expect(
      getPieceMoves('q', 'w', gameboard.board, convertSquareToIdx('e4')).sort()
    ).toEqual(
      [
        'b1',
        'c2',
        'd3',
        'f5',
        'g6',
        'h7',
        'a8',
        'b7',
        'c6',
        'd5',
        'f3',
        'g2',
        'h1',
        'e1',
        'e2',
        'e3',
        'e5',
        'e6',
        'e7',
        'e8',
        'a4',
        'b4',
        'c4',
        'd4',
        'f4',
        'g4',
        'h4'
      ]
        .map((s) => convertSquareToIdx(s as Square))
        .sort()
    );
  });

  test('king moves works', () => {
    expect(
      getPieceMoves('k', 'w', gameboard.board, convertSquareToIdx('e4')).sort()
    ).toEqual(
      ['e5', 'f5', 'd5', 'd4', 'f4', 'e3', 'd3', 'f3']
        .map((s) => convertSquareToIdx(s as Square))
        .sort()
    );
  });

  describe('pieces dont include moves that wrap around the board', () => {
    test('king', () => {
      expect(
        getPieceMoves(
          'k',
          'w',
          gameboard.board,
          convertSquareToIdx('h1')
        ).sort()
      ).toEqual(
        ['g1', 'g2', 'h2'].map((s) => convertSquareToIdx(s as Square)).sort()
      );
    });

    test('queen', () => {
      expect(
        getPieceMoves(
          'q',
          'w',
          gameboard.board,
          convertSquareToIdx('a3')
        ).sort()
      ).toEqual(
        [
          'b3',
          'c3',
          'd3',
          'e3',
          'f3',
          'g3',
          'h3',
          'b2',
          'c1',
          'b4',
          'c5',
          'd6',
          'e7',
          'f8',
          'a1',
          'a2',
          'a4',
          'a5',
          'a6',
          'a7',
          'a8'
        ]
          .map((s) => convertSquareToIdx(s as Square))
          .sort()
      );
    });
  });
});

describe('getPawnMoves works', () => {
  const gameboard = new Gameboard();
  beforeEach(() => (gameboard.board = gameboard.create()));

  it('works on an empty board', () => {
    expect(
      getPawnMoves(gameboard.board, 'w', convertSquareToIdx('e4')).sort()
    ).toEqual([convertSquareToIdx('e5')]);
  });

  test('pawns can jump two squares on their first move', () => {
    expect(
      getPawnMoves(gameboard.board, 'w', convertSquareToIdx('e2')).sort()
    ).toEqual(['e3', 'e4'].map((s) => convertSquareToIdx(s as Square)).sort());

    expect(
      getPawnMoves(gameboard.board, 'b', convertSquareToIdx('e7')).sort()
    ).toEqual(['e6', 'e5'].map((s) => convertSquareToIdx(s as Square)).sort());
  });

  describe('it works with captures', () => {
    it('works', () => {
      gameboard.board[convertSquareToIdx('d5')] = 'bp';
      gameboard.board[convertSquareToIdx('f5')] = 'bp';
      expect(
        getPawnMoves(gameboard.board, 'w', convertSquareToIdx('e4')).sort()
      ).toEqual(
        ['e5', 'd5', 'f5'].map((s) => convertSquareToIdx(s as Square)).sort()
      );

      gameboard.board[convertSquareToIdx('c4')] = 'wp';
      gameboard.board[convertSquareToIdx('e4')] = 'wp';

      expect(
        getPawnMoves(gameboard.board, 'b', convertSquareToIdx('d5')).sort()
      ).toEqual(
        ['e4', 'd4', 'c4'].map((s) => convertSquareToIdx(s as Square)).sort()
      );
    });

    it('doesnt include own pieces', () => {
      gameboard.board[convertSquareToIdx('e4')] = 'wp';
      gameboard.board[convertSquareToIdx('d5')] = 'wb';
      expect(
        getPawnMoves(gameboard.board, 'w', convertSquareToIdx('e4')).sort()
      ).toEqual([convertSquareToIdx('e5')]);

      gameboard.board[convertSquareToIdx('d4')] = 'bp';
      gameboard.board[convertSquareToIdx('c3')] = 'bb';

      expect(
        getPawnMoves(gameboard.board, 'b', convertSquareToIdx('d4')).sort()
      ).toEqual([convertSquareToIdx('d3')]);
    });

    it('works with enPassant', () => {
      expect(
        getPawnMoves(
          gameboard.board,
          'w',
          convertSquareToIdx('e5'),
          convertSquareToIdx('d6')
        ).sort()
      ).toEqual(
        ['e6', 'd6'].map((s) => convertSquareToIdx(s as Square)).sort()
      );
    });

    it('doesnt include enPassant square if its not a legal move for the pawn', () => {
      expect(
        getPawnMoves(
          gameboard.board,
          'w',
          convertSquareToIdx('e4'),
          convertSquareToIdx('d6')
        )
      ).toEqual([convertSquareToIdx('e5')]);
    });
  });
});

describe('isPiecePinned', () => {
  const { isPiecePinned } = exportedForTesting;
  const gameboard = new Gameboard();
  beforeEach(() => (gameboard.board = gameboard.create()));

  test('works on y axis', () => {
    const pIdx = convertSquareToIdx('e2');
    const kIdx = convertSquareToIdx('e1');
    gameboard.at(pIdx)?.place('wp');
    gameboard.at(kIdx)?.place('wk');
    gameboard.at(convertSquareToIdx('e8'))?.place('bq');

    expect(isPiecePinned(pIdx, kIdx, 'b', gameboard.board)).toBe(VECTORS.up);
  });

  test('works on x axis', () => {
    const pIdx = convertSquareToIdx('b1');
    const kIdx = convertSquareToIdx('e1');
    gameboard.at(pIdx)?.place('wp');
    gameboard.at(kIdx)?.place('wk');
    gameboard.at(convertSquareToIdx('a1'))?.place('bq');

    expect(isPiecePinned(pIdx, kIdx, 'b', gameboard.board)).toBe(VECTORS.left);
  });

  describe('works on diagonals', () => {
    test('upper left', () => {
      const pIdx = convertSquareToIdx('d2');
      const kIdx = convertSquareToIdx('e1');
      gameboard.at(kIdx)?.place('wk');
      gameboard.at(pIdx)?.place('wp');
      gameboard.at(convertSquareToIdx('b4'))?.place('bq');

      expect(isPiecePinned(pIdx, kIdx, 'b', gameboard.board)).toBe(
        VECTORS['up left']
      );
    });
    test('upper right', () => {
      const pIdx = convertSquareToIdx('f2');
      const kIdx = convertSquareToIdx('e1');
      gameboard.at(kIdx)?.place('wk');
      gameboard.at(pIdx)?.place('wp');
      gameboard.at(convertSquareToIdx('h4'))?.place('bq');

      expect(isPiecePinned(pIdx, kIdx, 'b', gameboard.board)).toBe(
        VECTORS['up right']
      );
    });
    test('bottom left', () => {
      const pIdx = convertSquareToIdx('d3');
      const kIdx = convertSquareToIdx('e4');
      gameboard.at(kIdx)?.place('wk');
      gameboard.at(pIdx)?.place('wr');
      gameboard.at(convertSquareToIdx('b1'))?.place('bb');

      expect(isPiecePinned(pIdx, kIdx, 'b', gameboard.board)).toBe(
        VECTORS['down left']
      );
    });
    test('bottom right', () => {
      const pIdx = convertSquareToIdx('f3');
      const kIdx = convertSquareToIdx('e4');
      gameboard.at(kIdx)?.place('wk');
      gameboard.at(pIdx)?.place('wr');
      gameboard.at(convertSquareToIdx('h1'))?.place('bb');

      expect(isPiecePinned(pIdx, kIdx, 'b', gameboard.board)).toBe(
        VECTORS['down right']
      );
    });
  });
});

describe('getSquaresBetweenTwoSquares works', () => {
  const { getSquaresBetweenTwoSquares } = exportedForTesting;
  const gameboard = new Gameboard();

  test('when squares are on same file', () => {
    const a1Idx = convertSquareToIdx('a1');
    const a8Idx = convertSquareToIdx('a8');
    expect(
      Object.keys(
        getSquaresBetweenTwoSquares(gameboard.board, a1Idx, a8Idx) as object
      )
        .map((v) => Number(v))
        .sort()
    ).toEqual(
      ['a2', 'a3', 'a4', 'a5', 'a6', 'a7']
        .map((s) => convertSquareToIdx(s as Square))
        .sort()
    );

    expect(
      Object.keys(
        getSquaresBetweenTwoSquares(gameboard.board, a8Idx, a1Idx) as object
      )
        .map((v) => Number(v))
        .sort()
    ).toEqual(
      ['a2', 'a3', 'a4', 'a5', 'a6', 'a7']
        .map((s) => convertSquareToIdx(s as Square))
        .sort()
    );
  });

  test('when squares are on the same rank', () => {
    expect(
      Object.keys(
        getSquaresBetweenTwoSquares(
          gameboard.board,
          convertSquareToIdx('a1'),
          convertSquareToIdx('h1')
        ) as object
      )
        .map((v) => Number(v))
        .sort()
    ).toEqual(
      ['b1', 'c1', 'd1', 'e1', 'f1', 'g1']
        .map((s) => convertSquareToIdx(s as Square))
        .sort()
    );
  });

  test('diagonals', () => {
    const b3Idx = convertSquareToIdx('b3');
    const d5Idx = convertSquareToIdx('d5');
    const c4Idx = convertSquareToIdx('c4');
    expect(
      Object.keys(
        getSquaresBetweenTwoSquares(gameboard.board, b3Idx, d5Idx) as object
      )
        .map((v) => Number(v))
        .sort()
    ).toEqual([c4Idx].sort());

    expect(
      Object.keys(
        getSquaresBetweenTwoSquares(gameboard.board, d5Idx, b3Idx) as object
      )
        .map((v) => Number(v))
        .sort()
    ).toEqual([c4Idx].sort());
  });
});

describe('getLegalKingMoves works', () => {
  test('controlled squares are not legal', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('e8'))?.place('bk');
    gameboard.at(convertSquareToIdx('f1'))?.place('wq');
    gameboard.at(convertSquareToIdx('d1'))?.place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        'b',
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

    gameboard.at(convertSquareToIdx('d7'))?.place('bk');
    gameboard.at(convertSquareToIdx('b5'))?.place('wb');

    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        'b',
        gameboard.pieceMap.w,
        {
          k: false,
          q: false
        },
        gameboard.board
      )
    ).toEqual(
      getPieceMoves(
        'k',
        'b',
        gameboard.board,
        gameboard.pieceMap.b.k[0]
      ).filter(
        (s) => s !== convertSquareToIdx('c6') && s !== convertSquareToIdx('e8')
      )
    );
  });

  it('doesnt show squares controlled by pawns', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('d7'))?.place('bk');
    gameboard.at(convertSquareToIdx('b5'))?.place('wp');

    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        'b',
        gameboard.pieceMap.w,
        {
          k: false,
          q: false
        },
        gameboard.board
      )
    ).toEqual(
      getPieceMoves(
        'k',
        'b',
        gameboard.board,
        gameboard.pieceMap.b.k[0]
      ).filter((s) => s !== convertSquareToIdx('c6'))
    );
  });

  it('doesnt include squares protected by rooks', () => {
    const gameboard = new Gameboard();

    gameboard.at(convertSquareToIdx('e8'))?.place('bk');
    gameboard.at(convertSquareToIdx('f8'))?.place('wr');
    gameboard.at(convertSquareToIdx('f1'))?.place('wq');
    gameboard.at(convertSquareToIdx('d1'))?.place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        'w',
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

    gameboard.at(convertSquareToIdx('e8'))?.place('bk');
    gameboard.at(convertSquareToIdx('f8'))?.place('wr');
    gameboard.at(convertSquareToIdx('g7'))?.place('wb');
    gameboard.at(convertSquareToIdx('d1'))?.place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        'w',
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

    gameboard.at(convertSquareToIdx('e8'))?.place('bk');
    gameboard.at(convertSquareToIdx('f8'))?.place('wr');
    gameboard.at(convertSquareToIdx('g8'))?.place('wq');
    gameboard.at(convertSquareToIdx('d1'))?.place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        'b',
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

    gameboard.at(convertSquareToIdx('e8'))?.place('bk');
    gameboard.at(convertSquareToIdx('f8'))?.place('wr');
    gameboard.at(convertSquareToIdx('g7'))?.place('wp');
    gameboard.at(convertSquareToIdx('d1'))?.place('wr');
    expect(
      getLegalKingMoves(
        gameboard.pieceMap.b.k[0],
        'b',
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
          'w',
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

      gameboard.at('g5')?.place('br');
      gameboard.at('b2')?.place('bp');

      expect(
        getLegalKingMoves(
          convertSquareToIdx('e1'),
          'w',
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

      gameboard.at('f5')?.place('br');
      gameboard.at('c2')?.place('bp');

      expect(
        getLegalKingMoves(
          convertSquareToIdx('e1'),
          'w',
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

      gameboard.at('e1')?.place('wk');
      gameboard.at('d1')?.place('wq');
      gameboard.at('g1')?.place('wn');

      expect(
        getLegalKingMoves(
          convertSquareToIdx('e1'),
          'w',
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

    gameboard.at('e4')?.place('wk');
    gameboard.at('c3')?.place('bn');
    gameboard.at('c5')?.place('bn');
    expect(
      getChecks('b', convertSquareToIdx('e4'), gameboard.board).sort()
    ).toEqual(['c3', 'c5'].map((s) => convertSquareToIdx(s as Square)).sort());

    gameboard.at('c3')?.remove();
    gameboard.at('c5')?.remove();
    gameboard.at('d2')?.place('bn');
    gameboard.at('d6')?.place('bn');
    expect(
      getChecks('b', convertSquareToIdx('e4'), gameboard.board).sort()
    ).toEqual(['d2', 'd6'].map((s) => convertSquareToIdx(s as Square)).sort());

    gameboard.at('d2')?.remove();
    gameboard.at('d6')?.remove();
    gameboard.at('f2')?.place('bn');
    gameboard.at('f6')?.place('bn');
    expect(
      getChecks('b', convertSquareToIdx('e4'), gameboard.board).sort()
    ).toEqual(['f2', 'f6'].map((s) => convertSquareToIdx(s as Square)).sort());

    gameboard.at('f2')?.remove();
    gameboard.at('f6')?.remove();
    gameboard.at('g3')?.place('bn');
    gameboard.at('g5')?.place('bn');
    expect(
      getChecks('b', convertSquareToIdx('e4'), gameboard.board).sort()
    ).toEqual(['g3', 'g5'].map((s) => convertSquareToIdx(s as Square)).sort());
  });

  describe('pawn checks', () => {
    test('white pawn black king', () => {
      const gameboard = new Gameboard();

      gameboard.at('d4')?.place('wp');
      gameboard.at('f4')?.place('wp');
      gameboard.at('e5')?.place('bk');

      expect(
        getChecks('w', convertSquareToIdx('e5'), gameboard.board).sort()
      ).toEqual(
        ['d4', 'f4'].map((s) => convertSquareToIdx(s as Square)).sort()
      );
    });

    test('black pawn white king', () => {
      const gameboard = new Gameboard();

      gameboard.at('e5')?.place('wk');
      gameboard.at('d6')?.place('bp');
      gameboard.at('f6')?.place('bp');

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

      gameboard.at('b8')?.place('bq');
      gameboard.at('e5')?.place('wk');

      expect(getChecks('b', convertSquareToIdx('e5'), gameboard.board)).toEqual(
        ['b8'].map((s) => convertSquareToIdx(s as Square))
      );
    });

    it('shouldnt include blocked checks on a diagonal', () => {
      const gameboard = new Gameboard();

      gameboard.at('e5')?.place('wk');
      gameboard.at('b8')?.place('bq');
      gameboard.at('c7')?.place('wr');

      expect(
        getChecks('b', convertSquareToIdx('e5'), gameboard.board).length
      ).toEqual(0);
    });

    test('on a file', () => {
      const gameboard = new Gameboard();

      gameboard.at('e8')?.place('bq');
      gameboard.at('e5')?.place('wk');

      expect(getChecks('b', convertSquareToIdx('e5'), gameboard.board)).toEqual(
        ['e8'].map((s) => convertSquareToIdx(s as Square))
      );
    });

    it('shouldnt included blocked checks on a file', () => {
      const gameboard = new Gameboard();

      gameboard.at('e5')?.place('wk');
      gameboard.at('e8')?.place('bq');
      gameboard.at('e7')?.place('wr');

      expect(
        getChecks('b', convertSquareToIdx('e5'), gameboard.board).length
      ).toEqual(0);
    });
  });
});

describe('getLegalMoves works', () => {
  test('pieces have no moves if there are two checks', () => {
    const gameboard = new Gameboard();

    gameboard.at('a1')?.place('wk');
    gameboard.at('h8')?.place('bb');
    gameboard.at('a8')?.place('br');
    gameboard.at('h1')?.place('wr');

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

    gameboard.at('a1')?.place('wk');
    gameboard.at('g7')?.place('bb');
    gameboard.at('h1')?.place('wr');

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

    gameboard.at('a1')?.place('wk');
    gameboard.at('h8')?.place('bb');
    gameboard.at('h1')?.place('wr');

    const h8Idx = convertSquareToIdx('h8');
    expect(
      getLegalMoves(
        'r',
        gameboard.board,
        'w',
        convertSquareToIdx('h1'),
        convertSquareToIdx('a1'),
        [h8Idx]
      )
    ).toEqual([h8Idx]);
  });

  test('pieces can block', () => {
    const gameboard = new Gameboard();

    gameboard.at('a1')?.place('wk');
    gameboard.at('h8')?.place('bb');
    gameboard.at('d1')?.place('wn');

    expect(
      getLegalMoves(
        'n',
        gameboard.board,
        'w',
        convertSquareToIdx('d1'),
        convertSquareToIdx('a1'),
        ['h8'].map((s) => convertSquareToIdx(s as Square))
      ).sort()
    ).toEqual(['b2', 'c3'].map((s) => convertSquareToIdx(s as Square)).sort());
  });

  test('pawns can block enPassant', () => {
    const gameboard = new Gameboard();

    gameboard.at('h1')?.place('wk');
    gameboard.at('a8')?.place('bb');
    gameboard.at('b5')?.place('wp');
    gameboard.at('c5')?.place('bp');

    expect(
      getLegalMoves(
        'p',
        gameboard.board,
        'w',
        convertSquareToIdx('b5'),
        convertSquareToIdx('h1'),
        ['a8'].map((s) => convertSquareToIdx(s as Square)),
        convertSquareToIdx('c6')
      )
    ).toEqual([convertSquareToIdx('c6')]);
  });

  test('pieces can only move in the direction/opposite direction of the pin', () => {
    const gameboard = new Gameboard();

    gameboard.at('e1')?.place('wk');
    gameboard.at('e5')?.place('br');
    gameboard.at('e3')?.place('wq');

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
