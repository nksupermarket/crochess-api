import {
  AllPieceMap,
  Colors,
  PieceType,
  SquareIdx,
  Piece,
  Board
} from '../types/types';

export function getEmptyPieceMap(): AllPieceMap {
  return { w: { k: [] }, b: { k: [] } };
}

export function buildPieceMap(board: Board) {
  return board.reduce<AllPieceMap>((acc, piece, i) => {
    if (!piece) return acc;

    const pieceSquares = acc[piece[0] as Colors][piece[1] as PieceType];
    if (pieceSquares) {
      pieceSquares.push(i as SquareIdx);
      pieceSquares.sort();
    } else acc[piece[0] as Colors][piece[1] as PieceType] = [i as SquareIdx];

    return acc;
  }, getEmptyPieceMap());
}

export function pushToPieceMap(
  pieceMap: AllPieceMap,
  piece: Piece,
  sIdx: SquareIdx
) {
  if ((piece[1] as PieceType) in pieceMap[piece[0] as Colors]) {
    pieceMap[piece[0] as Colors][piece[1] as PieceType]?.push(sIdx);
    pieceMap[piece[0] as Colors][piece[1] as PieceType]?.sort();
  } else pieceMap[piece[0] as Colors][piece[1] as PieceType] = [sIdx];
}

export function moveInPieceMap(
  pieceMap: AllPieceMap,
  piece: Piece,
  start: SquareIdx,
  end: SquareIdx
) {
  const pieceSquares = pieceMap[piece[0] as Colors][piece[1] as PieceType];
  if (typeof pieceSquares !== 'undefined')
    pieceMap[piece[0] as Colors][piece[1] as PieceType] = pieceSquares.map(
      (s) => {
        if (s !== start) return s;
        return end;
      }
    );
}

export function removeFromPieceMap(
  pieceMap: AllPieceMap,
  piece: Piece,
  squareIdx: SquareIdx
) {
  const pieceSquares = pieceMap[piece[0] as Colors][piece[1] as PieceType];
  if (typeof pieceSquares !== 'undefined')
    pieceMap[piece[0] as Colors][piece[1] as PieceType] = pieceSquares.filter(
      (s) => s !== squareIdx
    );

  if (!pieceMap[piece[0] as Colors][piece[1] as PieceType]?.length)
    delete pieceMap[piece[0] as Colors][piece[1] as PieceType];
}
