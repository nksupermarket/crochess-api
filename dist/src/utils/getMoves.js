import { isSquareIdx } from './typeCheck';
function getLineMoves({ dir, board, start, range = Infinity, canCapture = true, onlyForward }) {
    const length = Math.sqrt(board.length);
    let lines = {
        diagonal: [length + 1, length - 1, -length + 1, -length - 1],
        xy: [1, -1, length, -length]
    }[dir];
    if (onlyForward) {
        const forward = onlyForward === 'w' ? length : -length;
        lines = lines.filter((l) => l + 2 > forward && l - 2 < forward);
    }
    const moves = [];
    lines.forEach((d) => {
        var _a;
        let rangeForLine = range;
        // can assume move is type SquareIdx because the while loops checks for it anyways
        let move = start + d;
        while (rangeForLine &&
            // move is a valid square on the board
            isSquareIdx(board.length, move)) {
            const piece = board[move];
            if (!piece) {
                moves.push(move);
            }
            else if (canCapture &&
                // square has piece that isn't same color as piece moving
                piece[0] !== ((_a = board[start]) === null || _a === void 0 ? void 0 : _a[0])) {
                moves.push(move);
                break;
            }
            else {
                break;
            }
            move = move + d;
            rangeForLine--;
        }
    });
    return moves;
}
export const getPieceMoves = (pieceType, board, square) => {
    switch (pieceType) {
        case 'n': {
            const length = Math.sqrt(board.length);
            const jumps = [
                -2 * length + 1,
                -2 * length - 1,
                2 * length - 1,
                2 * length + 1,
                length + 2,
                length - 2,
                -length + 2,
                -length - 2
            ];
            return jumps.reduce((acc, curr) => {
                const move = square + curr;
                if (isSquareIdx(board.length, move))
                    acc.push(move);
                return acc;
            }, []);
        }
        case 'b': {
            return getLineMoves({ board, dir: 'diagonal', start: square });
        }
        case 'r': {
            return getLineMoves({ board, dir: 'xy', start: square });
        }
        case 'q': {
            return getLineMoves({ board, dir: 'diagonal', start: square }).concat(getLineMoves({ board, dir: 'xy', start: square }));
        }
        case 'k': {
            return getLineMoves({
                board,
                dir: 'diagonal',
                start: square,
                range: 1
            }).concat(getLineMoves({ board, dir: 'xy', start: square, range: 1 }));
        }
        default:
            return [];
    }
};
export const getPawnMoves = (board, color, square, enPassant) => {
    const rank = Math.floor(square / Math.sqrt(board.length)) + 1;
    const firstMove = (color === 'w' && rank === 2) || (color === 'b' && rank === 7);
    const regMoves = getLineMoves({
        board,
        start: square,
        dir: 'xy',
        range: firstMove ? 2 : 1,
        onlyForward: color,
        canCapture: false
    });
    const captureMoves = getLineMoves({
        board,
        start: square,
        dir: 'diagonal',
        range: 1,
        onlyForward: color
    }).filter((m) => {
        const piece = board[m];
        // check if it's the same as enpassant square
        return (m === enPassant ||
            // check if there's a piece capture
            (piece && piece[0] !== color));
    });
    return regMoves.concat(captureMoves);
};
export function getValidKingMoves(kingSquare, oppColor, oppPieceMap, castleRights, castleSquares, board) {
    if (!isSquareIdx(board.length, kingSquare))
        return;
    // need to remove king because rooks/queens/bishops control the square behind the king as well
    const copy = [...board];
    copy[kingSquare] = null;
    const kingMoves = getPieceMoves('k', board, kingSquare);
    const allEnemyMoves = getAllMoves(copy, oppPieceMap, oppColor);
    // check if king can castle
    for (const [side, canCastle] of Object.entries(castleRights)) {
        if (!canCastle)
            continue;
        if (
        // castle squares are not empty or is under control by enemy piece
        !castleSquares[side].every((s) => {
            if (!isSquareIdx(board.length, s))
                return false;
            if (board[s] !== null)
                return false;
            return !allEnemyMoves[s];
        }))
            continue;
        kingMoves.concat(castleSquares[side][1]);
    }
    return kingMoves.filter((s) => allEnemyMoves[s]);
}
function getAllMoves(board, pieceMap, color) {
    const allMoves = {};
    for (const [type, pieceSquares] of Object.entries(pieceMap)) {
        const pieceType = type;
        for (let i = 0; i < pieceSquares.length; i++) {
            const moves = pieceType === 'p'
                ? getPawnMoves(board, color, pieceSquares[i])
                : getPieceMoves(pieceType, board, pieceSquares[i]);
            moves.forEach((m) => (allMoves[m] = true));
        }
    }
    return allMoves;
}
//# sourceMappingURL=getMoves.js.map