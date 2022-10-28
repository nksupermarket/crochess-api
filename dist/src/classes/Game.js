import { convertSquareToIdx } from '../utils/square';
import { isSquare } from '../utils/typeCheck';
import Gameboard from './Gameboard';
import { COLORS } from '../utils/constants';
export default class Game extends Gameboard {
    constructor({ boardSize, castleRightsStr = 'KQkq', board, enPassant, halfmoves = 0, fullmoves = 0, activeColor = 'w' }) {
        super(boardSize, board && board);
        this.castleRights = COLORS.reduce((acc, curr) => {
            const kingsideStr = curr === 'w' ? 'K' : 'k';
            const queensideStr = curr === 'w' ? 'Q' : 'q';
            acc[curr] = {
                kingside: castleRightsStr.includes(kingsideStr),
                queenside: castleRightsStr.includes(queensideStr)
            };
            return acc;
        }, {});
        this.enPassant = isSquare(boardSize, enPassant)
            ? convertSquareToIdx(enPassant, boardSize)
            : null;
        this.halfmoves = Number(halfmoves);
        this.fullmoves = Number(fullmoves);
        this.activeColor = activeColor;
    }
}
//# sourceMappingURL=Game.js.map