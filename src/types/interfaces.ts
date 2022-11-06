import {
  Square,
  PieceType,
  Side,
  Colors,
  CastleRights,
  Board,
  EnPassant,
  Piece
} from './types';

export interface MoveDetailsInterface {
  castle?: Side;
  from: Square;
  to: Square;
  piece: Piece;
  promote?: Exclude<PieceType, 'k' | 'p'>;
  capture?: boolean;
}

export interface GameConstructorParams {
  halfmoves: string;
  fullmoves: string;
  castleRights: Record<Colors, CastleRights>;
  board: Board;
  enPassant: EnPassant;
  activeColor: Colors;
}
