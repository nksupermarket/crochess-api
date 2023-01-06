import {
  Square,
  PromotePieceType,
  Side,
  Colors,
  AllCastleRights,
  Board,
  Piece,
  SquareIdx
} from './types';

export interface MoveDetailsInterface {
  castle?: Side;
  from: Square;
  to: Square;
  piece: Piece;
  promote?: PromotePieceType;
  capture?: boolean;
}

export interface GameState {
  halfmoves: number;
  fullmoves: number;
  castleRights: AllCastleRights;
  board: Board;
  enPassant: SquareIdx | null;
  activeColor: Colors;
}
