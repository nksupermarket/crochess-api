import Game from '../classes/Game';
import { convertIdxToSquare } from './square';
import { isFenStr } from './typeCheck';
import { BOARD_LENGTH } from './constants';
export function convertFromFen(fen, pushToPieceMap) {
    if (!isFenStr(fen))
        return;
    const split = fen.split(' ');
    const [boardStr, activeColor, castleRightsStr, enPassant, halfmoves, fullmoves] = split;
    // convert board
    // need to reverse the array because fen string starts with the 8th rank first
    const splitIntoRanks = boardStr.split('/');
    splitIntoRanks.reverse();
    const board = splitIntoRanks
        // need to split each str because each str represent a whole rank
        .map((str) => str.split(''))
        .flat()
        .reduce((acc, curr) => {
        // iterate over the string representation of the rank
        if (curr === '/')
            return acc;
        if (Number(curr)) {
            return acc.concat(Array(Number(curr)).fill(null));
        }
        // curr represents a piece
        const pieceType = curr;
        const piece = pieceType.toLowerCase() === pieceType
            ? `b${pieceType}`
            : `w${pieceType.toLowerCase()}`;
        pushToPieceMap &&
            pushToPieceMap(pieceType, piece[0], acc.length);
        acc.push(piece);
        return acc;
    }, []);
    return new Game({
        halfmoves,
        fullmoves,
        board: board,
        castleRightsStr: castleRightsStr,
        enPassant: enPassant,
        activeColor: activeColor
    });
}
export function convertToFen(game) {
    let fen = '';
    // need to iterate over twice
    // first loop for ranks
    // inner loop for files
    for (let rank = BOARD_LENGTH - 1; rank >= 0; rank--) {
        let rankStr = '';
        for (let file = 0; file < BOARD_LENGTH; file++) {
            const idx = rank * BOARD_LENGTH + file;
            if (
            // square is empty
            !game.board[idx]) {
                if (Number(rankStr[rankStr.length - 1])) {
                    // if square is empty and end of string is number, just add 1 to the number that is at the end
                    rankStr = rankStr.replace(/\d$/, `${Number(rankStr[rankStr.length - 1]) + 1}`);
                }
                else
                    rankStr += '1';
            }
            else {
                // rank[i] is a piece
                const piece = game.board[idx];
                rankStr += piece[0] === 'w' ? piece[1].toUpperCase() : piece[1];
            }
        }
        fen += `${rankStr}/`;
    }
    fen += ` ${game.activeColor}`;
    const castleRightsStr = `${game.castleRights.w.k ? 'K' : ''}${game.castleRights.w.q ? 'Q' : ''}${game.castleRights.b.k ? 'k' : ''}${game.castleRights.w.q ? 'q' : ''}`;
    fen += ` ${castleRightsStr}`;
    const enPassantStr = game.enPassant
        ? convertIdxToSquare(game.enPassant)
        : '-';
    fen += ` ${enPassantStr} ${game.halfmoves} ${game.fullmoves}`;
    return fen;
}
//# sourceMappingURL=fen.js.map