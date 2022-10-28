import { Board, Colors, PieceMap, PieceType, Square, Files, EnumerateFromOne, SquareIdx, Piece } from '../types/types';
export default class Gameboard<Size extends number> {
    board: Board<Size>;
    pieceMap: Record<Colors, PieceMap<Size>>;
    readonly length: number;
    constructor(size: Size, board?: Board<Size>);
    create(size: Size): Board<Size>;
    init(board?: import("../types/types").Tuple<"br" | "bb" | "bp" | "bq" | "bk" | "bn" | "wb" | "wp" | "wq" | "wk" | "wn" | "wr" | null, Size>): void;
    pushToPieceMap(pieceType: PieceType, color: Colors, squareIdx: SquareIdx<Size>): void;
    at(square: Square<Files, EnumerateFromOne<typeof this.length>>, board?: import("../types/types").Tuple<"br" | "bb" | "bp" | "bq" | "bk" | "bn" | "wb" | "wp" | "wq" | "wk" | "wn" | "wr" | null, Size>): {
        readonly piece: import("../types/types").Tuple<"br" | "bb" | "bp" | "bq" | "bk" | "bn" | "wb" | "wp" | "wq" | "wk" | "wn" | "wr" | null, Size>[import("../types/types").Enumerate<Size>];
        placePiece(piece: Piece): void;
        remove(): void;
        promote(newType: Exclude<PieceType, 'p'>): void;
    } | undefined;
    from(s1: Square<Files, EnumerateFromOne<typeof this.length>>, board?: import("../types/types").Tuple<"br" | "bb" | "bp" | "bq" | "bk" | "bn" | "wb" | "wp" | "wq" | "wk" | "wn" | "wr" | null, Size>): {
        to: (s2: Square<Files, EnumerateFromOne<Size>>) => void;
    } | undefined;
}
