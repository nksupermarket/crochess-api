import { BOARD_LENGTH, BOARD_SIZE, COLORS, FILES, PIECE_TYPES } from './constants';
export function isSquareIdx(value) {
    return value >= 0 && value < BOARD_SIZE;
}
export function isFiles(char) {
    return !!FILES.find((v) => v === char);
}
export function isSquare(value) {
    if (value.length > 2)
        return false;
    if (!isFiles(value[0]))
        return false;
    if (FILES.indexOf(value[0]) >= BOARD_LENGTH)
        return false;
    if (+value[1] > BOARD_LENGTH)
        return false;
    return true;
}
export function isColor(char) {
    return COLORS.includes(char);
}
function isCastleRightsStr(str) {
    const castleRights = ['K', 'k', 'Q', 'q'];
    const strMap = {};
    for (let i = 0; i < str.length; i++) {
        if (castleRights.indexOf(str[i]) === -1)
            return;
        if (strMap[str[i]])
            return false;
    }
    return true;
}
export function isPieceType(char) {
    if (char.length > 1)
        return false;
    return PIECE_TYPES.indexOf(char.toLowerCase()) !== -1;
}
export function isFenStr(str) {
    const split = str.split(' ');
    const [boardStr, activeColor, castleRightsStr, enPassant, halfmoves, fullmoves] = split;
    const splitIntoRanks = boardStr.split('/');
    if (splitIntoRanks.length !== BOARD_LENGTH)
        return false;
    if (splitIntoRanks.some((r) => {
        // find a rank whose length is not equal to size
        let rankSize = 0;
        for (let i = 0; i < r.length; i++) {
            if (Number(r[i]))
                rankSize += Number(r[i]);
            else if (isPieceType(r[i]))
                rankSize++;
            else
                return true;
        }
        return rankSize !== BOARD_LENGTH;
    })) {
        return false;
    }
    if (!isColor(activeColor))
        return false;
    if (!isCastleRightsStr(castleRightsStr))
        return false;
    if (!isSquare(enPassant) && enPassant !== '-')
        return false;
    if (isNaN(Number(halfmoves)))
        return false;
    if (isNaN(Number(fullmoves)))
        return false;
    return true;
}
//# sourceMappingURL=typeCheck.js.map