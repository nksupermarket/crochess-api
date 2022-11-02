import { BOARD_SIZE, COLORS, PIECE_TYPES } from '../utils/constants';
export default class Gameboard {
    constructor(board) {
        this.board = board || this.create();
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
    create() {
        return Array(BOARD_SIZE)
            .fill(null)
            .map(() => null);
    }
    init(board = this.board) {
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
    moveInPieceMap(pieceType, color, start, end) {
        this.pieceMap[color][pieceType] = this.pieceMap[color][pieceType].map((s) => {
            if (s !== start)
                return s;
            return end;
        });
    }
    removeFromPieceMap(pieceType, color, squareIdx) {
        this.pieceMap[color][pieceType] = this.pieceMap[color][pieceType].filter((s) => s !== squareIdx);
        if (!this.pieceMap[color][pieceType].length)
            delete this.pieceMap[color][pieceType];
    }
    at(idx, board = this.board) {
        return {
            get piece() {
                return board[idx];
            },
            place: (piece) => {
                board[idx] = piece;
                this.pushToPieceMap(piece[1], piece[0], idx);
            },
            remove: () => {
                const piece = board[idx];
                if (piece)
                    this.removeFromPieceMap(piece[1], piece[0], idx);
                board[idx] = null;
            },
            promote: (newType) => {
                const piece = board[idx];
                if (!piece)
                    return;
                board[idx] = `${piece[0]}${newType}`;
                this.removeFromPieceMap(piece[1], piece[0], idx);
                this.pushToPieceMap(newType, piece[0], idx);
            }
        };
    }
    from(s1Idx, board = this.board) {
        return {
            to: (s2Idx) => {
                if (s1Idx === s2Idx)
                    return;
                const piece = board[s1Idx];
                if (!piece)
                    return;
                board[s1Idx] = null;
                board[s2Idx] = piece;
                this.moveInPieceMap(piece[1], piece[0], s1Idx, s2Idx);
            }
        };
    }
    castle(color, side, board = this.board) {
        const kingIdx = this.pieceMap[color].k[0];
        const rookIdx = this.pieceMap[color].r.find((s) => side === 'q' ? s < kingIdx : s > kingIdx);
        this.from(rookIdx, board).to((side === 'q' ? kingIdx - 1 : kingIdx + 1));
        this.from(kingIdx, board).to((side === 'q' ? kingIdx - 2 : kingIdx + 2));
    }
}
//# sourceMappingURL=Gameboard.js.map