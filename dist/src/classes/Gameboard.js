import { BOARD_SIZE, COLORS, PIECE_TYPES } from '../utils/constants';
import { convertSquareToIdx } from '../utils/square';
import { isSquare } from '../utils/typeCheck';
export default class Gameboard {
    constructor(size, board) {
        this.board = board || this.create(size);
        this.length = Math.sqrt(size);
        this.pieceMap = (() => {
            return COLORS.reduce((acc, curr) => {
                acc[curr] = PIECE_TYPES.reduce((acc, curr) => {
                    acc[curr] = [];
                    return acc;
                }, {});
                return acc;
            }, {});
        })();
    }
    create(size) {
        return Array(size)
            .fill(null)
            .map(() => null);
    }
    init(board = this.board) {
        if (board.length !== BOARD_SIZE)
            return;
        const length = Math.sqrt(board.length);
        const initPositions = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
        for (let i = 0; i < initPositions.length; i++) {
            board[i] = `w${initPositions[i]}`;
            board[i + length] = `wp`;
            board[
            // need to reverse the order for black side
            board.length - 1 - i] = `b${initPositions[initPositions.length - 1 - i]}`;
            board[board.length - 1 - i - length] = 'bp';
        }
    }
    pushToPieceMap(pieceType, color, squareIdx) {
        this.pieceMap[color][pieceType].push(squareIdx);
    }
    at(square, board = this.board) {
        if (!isSquare(board.length, square))
            return;
        const idx = convertSquareToIdx(square, board.length);
        return {
            get piece() {
                return board[idx];
            },
            placePiece(piece) {
                board[idx] = piece;
            },
            remove() {
                board[idx] = null;
            },
            promote(newType) {
                const piece = board[idx];
                if (!piece)
                    return;
                board[idx] = `${piece[0]}${newType}`;
            }
        };
    }
    from(s1, board = this.board) {
        if (!isSquare(this.board.length, s1))
            return;
        return {
            to: (s2) => {
                if (!isSquare(this.board.length, s2))
                    return;
                if (s1 === s2)
                    return;
                const s1Idx = convertSquareToIdx(s1, board.length);
                const s2Idx = convertSquareToIdx(s2, board.length);
                const piece = board[s1Idx];
                board[s1Idx] = null;
                board[s2Idx] = piece;
            }
        };
    }
}
//# sourceMappingURL=Gameboard.js.map