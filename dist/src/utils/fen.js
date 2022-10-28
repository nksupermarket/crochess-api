import Game from '../classes/Game';
import { isFenStr } from './typeCheck';
export function convertFromFen(fen, cb) {
    if (!isFenStr(fen))
        return;
    const split = fen.split(' ');
    const [boardStr, activeColor, castleRightsStr, enPassant, halfmoves, fullmoves] = split;
    // convert board
    const splitIntoRanks = boardStr.split('/');
    splitIntoRanks.reverse();
    const board = splitIntoRanks.reduce((acc, curr, idx) => {
        // iterate over the string representation of the rank
        // for each character, adjust the rank accordingly
        // idx represents rank
        let rank = [];
        for (let i = 0; i < curr.length; i++) {
            if (Number(curr[i])) {
                rank = rank.concat(Array(Number(curr[i])).fill(null));
                continue;
            }
            // curr[i] represents a piece
            const pieceType = curr[i];
            const piece = pieceType.toLowerCase() === pieceType
                ? `b${pieceType}`
                : `w${pieceType.toLowerCase()}`;
            rank.push(piece);
            cb &&
                cb(pieceType, piece[0], ((idx - 1) * splitIntoRanks.length +
                    rank.length -
                    1));
        }
        acc = acc.concat(rank);
        return acc;
    }, []);
    return new Game({
        board,
        halfmoves,
        fullmoves,
        boardSize: board.length,
        castleRightsStr: castleRightsStr,
        enPassant: enPassant,
        activeColor: activeColor
    });
}
export function convertToFen(board) {
    let boardStr = '';
    const length = Math.sqrt(board.length);
    // need to iterate over twice
    // first loop for ranks
    // inner loop for files
    for (let rank = length - 1; rank >= 0; rank--) {
        let rankStr = '';
        for (let file = 0; file < length; file++) {
            const idx = rank * length + file;
            if (
            // square is empty
            !board[idx]) {
                if (Number(rankStr[rankStr.length - 1])) {
                    // if square is empty and end of string is number, just add 1 to the number that is at the end
                    rankStr = rankStr.replace(/\d$/, `${Number(rankStr[rankStr.length - 1]) + 1}`);
                }
                else
                    rankStr += '1';
            }
            else {
                // rank[i] is a piece
                const piece = board[idx];
                rankStr += piece[0] === 'w' ? piece[1].toUpperCase() : piece[1];
            }
        }
        boardStr += `${rankStr}/`;
    }
    return boardStr;
}
//# sourceMappingURL=fen.js.map