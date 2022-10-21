import { Colors, PieceType } from '../types/types';

export default class Piece {
  type: PieceType;
  color: Colors;

  constructor(type: PieceType, color: Colors) {
    this.type = type;
    this.color = color;
  }
}
