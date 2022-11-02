import { convertSquareToIdx } from '../utils/square';
import { isFenStr, isSquare } from '../utils/typeCheck';
import Gameboard from './Gameboard';
import { BOARD_LENGTH, COLORS, OPP_COLOR, VECTORS } from '../utils/constants';
import { convertToFen } from '../utils/fen';
import { getChecks, getMovesForColor, getLegalKingMoves, getLegalMoves } from 'src/utils/getMoves';
export default class Game extends Gameboard {
    constructor({ castleRightsStr = 'KQkq', board, enPassant = '-', halfmoves = 0, fullmoves = 0, activeColor = 'w' }) {
        super(board);
        this.castleRights = COLORS.reduce((acc, curr) => {
            const kingsideStr = curr === 'w' ? 'K' : 'k';
            const queensideStr = curr === 'w' ? 'Q' : 'q';
            acc[curr] = {
                k: castleRightsStr.includes(kingsideStr),
                q: castleRightsStr.includes(queensideStr)
            };
            return acc;
        }, {});
        this.enPassant = isSquare(enPassant) ? convertSquareToIdx(enPassant) : null;
        this.halfmoves = Number(halfmoves);
        this.fullmoves = Number(fullmoves);
        this.activeColor = activeColor;
        this._checks = null;
    }
    get checks() {
        // this._checks resets to null after every turn
        if (this._checks)
            return this._checks;
        this._checks = getChecks(OPP_COLOR[this.activeColor], this.pieceMap[this.activeColor].k[0], this.board);
        return this._checks;
    }
    at(idx, board = this.board) {
        return Object.assign(Object.assign({}, super.at(idx, board)), { moves: () => {
                const piece = board[idx];
                if (!piece)
                    return null;
                const oppColor = OPP_COLOR[piece[0]];
                if (piece[1] === 'k') {
                    return getLegalKingMoves(this.pieceMap[piece[0]].k[0], this.pieceMap[oppColor], this.castleRights[piece[0]], board);
                }
                else {
                    return getLegalMoves(piece[1], board, piece[0], idx, this.pieceMap[piece[0]].k[0], this.checks, this.enPassant || undefined);
                }
            } });
    }
    makeMove(from, to, promote) {
        var _a, _b;
        const fromIdx = convertSquareToIdx(from);
        const toIdx = convertSquareToIdx(to);
        const piece = this.at(fromIdx).piece;
        if (!piece)
            return;
        if (piece[0] !== this.activeColor)
            return;
        const valid = (_b = (_a = this.at(fromIdx)) === null || _a === void 0 ? void 0 : _a.moves()) === null || _b === void 0 ? void 0 : _b.includes(toIdx);
        if (!valid)
            return;
        // measures halfmoves since last capture or pawn advance
        if (!!this.board[toIdx] || piece[1] === 'p')
            this.halfmoves++;
        switch (piece[1]) {
            case 'k': {
                // toggle castle rights
                this.castleRights[this.activeColor] = {
                    k: false,
                    q: false
                };
                // move rook if its a castle move
                const distance = fromIdx - toIdx;
                if (distance === -2) {
                    this.castle(this.activeColor, 'q');
                }
                if (distance === 2) {
                    this.castle(this.activeColor, 'k');
                }
                if (distance !== 2 && distance !== -2)
                    this.from(fromIdx).to(toIdx);
                break;
            }
            case 'r': {
                const kingIdx = this.pieceMap[this.activeColor].k[0];
                const kingside = kingIdx < fromIdx;
                this.castleRights[this.activeColor][kingside ? 'k' : 'q'] = false;
                this.from(fromIdx).to(toIdx);
                this.enPassant = null;
                break;
            }
            case 'p': {
                const forward = this.activeColor === 'w' ? 'up' : 'down';
                // check if capture by enPassant
                if (toIdx === this.enPassant) {
                    const captureIdx = (toIdx - VECTORS[forward]);
                    this.at(captureIdx).remove();
                }
                // check if you need to toggle enPassant
                if (toIdx === 2 * VECTORS[forward] + fromIdx) {
                    this.enPassant = (toIdx - VECTORS[forward]);
                }
                else
                    this.enPassant = null;
                this.from(fromIdx).to(toIdx);
                const newRank = Math.floor(toIdx / BOARD_LENGTH);
                const promoteRank = this.activeColor === 'w' ? 7 : 0;
                if (!promote)
                    return;
                if (newRank === promoteRank)
                    this.at(toIdx).promote(promote);
                break;
            }
            default: {
                this.enPassant = null;
                this.from(fromIdx).to(toIdx);
            }
        }
        if (this.activeColor === 'b')
            this.fullmoves++;
        this.activeColor = OPP_COLOR[this.activeColor];
        this._checks = null;
    }
    isGameOver(fenList) {
        const gameOver = {
            checkmate: false,
            unforcedDraw: false,
            forcedDraw: true
        };
        // check for checkmate + stalemate
        const legalMoves = getMovesForColor(this.board, this.pieceMap, this.activeColor, this.enPassant, this.castleRights[this.activeColor], this.checks);
        const noLegalMoves = !!Object.keys(legalMoves)[0];
        if (noLegalMoves && this.checks.length) {
            gameOver.checkmate = true;
            return gameOver;
        }
        else if (noLegalMoves) {
            gameOver.forcedDraw = true;
            return gameOver;
        }
        // check for move rule
        if (this.halfmoves >= 75) {
            gameOver.forcedDraw = true;
            return gameOver;
        }
        if (this.halfmoves >= 50)
            gameOver.unforcedDraw = true;
        // check for repetition
        fenList.push(convertToFen(this));
        const map = {};
        for (let i = 0; i < fenList.length; i++) {
            if (!isFenStr(fenList[i]))
                throw new Error('encountered a string that was not a fen string');
            // need to remove fullmoves + halfmoves from fen string before comparing
            const normalized = fenList[i].split(' ');
            normalized.splice(-2);
            const joined = normalized.join(' ');
            if (map[joined])
                map[joined]++;
            else
                map[joined] = 1;
            if (map[joined] === 5) {
                gameOver.forcedDraw = true;
                return gameOver;
            }
            if (map[joined] === 3) {
                gameOver.unforcedDraw = true;
            }
        }
        // check for insufficient material
        // join the array of pieces left so you can compare as as string
        const piecesLeft = Object.keys(this.pieceMap[this.activeColor])
            .sort()
            .join('');
        const oppPiecesLeft = Object.keys(this.pieceMap[OPP_COLOR[this.activeColor]])
            .sort()
            .join('');
        const insufficientMaterial = {
            k: ['bk', 'kn'],
            kb: ['bk']
        };
        if (!insufficientMaterial[piecesLeft] &&
            !insufficientMaterial[oppPiecesLeft])
            return gameOver;
        if (insufficientMaterial[piecesLeft].includes(oppPiecesLeft) ||
            insufficientMaterial[oppPiecesLeft].includes(piecesLeft)) {
            gameOver.forcedDraw = true;
            return gameOver;
        }
        return gameOver;
    }
}
//# sourceMappingURL=Game.js.map