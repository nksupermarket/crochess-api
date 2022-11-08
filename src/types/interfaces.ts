import {
  Square,
  PromotePieceType,
  Side,
  Colors,
  AllCastleRights,
  Board,
  EnPassant,
  Piece
} from './types';

export interface MoveDetailsInterface {
  castle?: Side;
  from: Square;
  to: Square;
  piece: Piece;
  promote?: PromotePieceType;
  capture?: boolean;
  checkmate?: boolean;
}

export interface GameState {
  halfmoves: string;
  fullmoves: string;
  castleRights: AllCastleRights;
  board: Board;
  enPassant: EnPassant;
  activeColor: Colors;
}
