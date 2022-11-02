import { ALL_VECTORS, BOARD_LENGTH, DIAGONAL_VECTORS, FILES, KNIGHT_JUMPS, OPP_COLOR, VECTORS, XY_VECTORS } from './constants';
import { convertIdxToSquare } from './square';
import { isSquareIdx } from './typeCheck';
function traverseAlongVector(vector, start, range, cb) {
    // can assume move is type SquareIdx because the while loops checks for it anyways
    let square = start + vector;
    while (range &&
        // move is a valid square on the board
        isSquareIdx(square)) {
        let shouldBreak = false;
        cb(square, () => (shouldBreak = true), (BOARD_LENGTH - range + 1));
        if (shouldBreak)
            break;
        // need to stop at the edge of the board
        const endOfBoard = vector === VECTORS.up || vector === VECTORS.down
            ? square <= 7 || square >= 56
            : square % BOARD_LENGTH === 0 ||
                square % BOARD_LENGTH === BOARD_LENGTH - 1;
        if (endOfBoard)
            break;
        square = square + vector;
        range--;
    }
}
function getLineMoves({ board, start, vectors, range = BOARD_LENGTH, canCapture = true, onlyCapture = false, includeOwnPieces = false }) {
    const moves = [];
    vectors.forEach((d) => {
        traverseAlongVector(d, start, range, (move, breakLoop) => {
            var _a;
            const piece = board[move];
            if (!piece && !onlyCapture) {
                moves.push(move);
            }
            else if (
            // square has piece that isn't same color as piece moving
            piece &&
                (includeOwnPieces || (canCapture && piece[0] !== ((_a = board[start]) === null || _a === void 0 ? void 0 : _a[0])))) {
                moves.push(move);
                breakLoop();
            }
            else {
                // there is a piece and piece is the same color
                breakLoop();
            }
        });
    });
    return moves;
}
export const getPieceMoves = (pieceType, board, pIdx, pinVector, includeOwnPieces) => {
    function filterOutPinVector(v) {
        const pv = pinVector;
        return v === pv || v === -pv;
    }
    switch (pieceType) {
        case 'n': {
            if (pinVector)
                return [];
            return KNIGHT_JUMPS.reduce((acc, curr) => {
                var _a, _b;
                const move = pIdx + curr;
                if (!isSquareIdx(move))
                    return acc;
                if (!board[move] ||
                    includeOwnPieces ||
                    ((_a = board[move]) === null || _a === void 0 ? void 0 : _a[0]) !== ((_b = board[pIdx]) === null || _b === void 0 ? void 0 : _b[0]))
                    acc.push(move);
                return acc;
            }, []);
        }
        case 'b': {
            return getLineMoves({
                board,
                includeOwnPieces,
                start: pIdx,
                vectors: pinVector
                    ? DIAGONAL_VECTORS.filter(filterOutPinVector)
                    : DIAGONAL_VECTORS
            });
        }
        case 'r': {
            return getLineMoves({
                board,
                includeOwnPieces,
                vectors: pinVector ? XY_VECTORS.filter(filterOutPinVector) : XY_VECTORS,
                start: pIdx
            });
        }
        case 'q': {
            return getLineMoves({
                board,
                includeOwnPieces,
                vectors: pinVector
                    ? ALL_VECTORS.filter(filterOutPinVector)
                    : ALL_VECTORS,
                start: pIdx
            });
        }
        case 'k': {
            return getLineMoves({
                board,
                vectors: pinVector
                    ? ALL_VECTORS.filter(filterOutPinVector)
                    : ALL_VECTORS,
                start: pIdx,
                range: 1
            });
        }
        default:
            return [];
    }
};
export const getPawnMoves = (board, color, pIdx, enPassant, pinVector) => {
    const rank = Math.floor(pIdx / Math.sqrt(board.length)) + 1;
    const firstMove = (color === 'w' && rank === 2) || (color === 'b' && rank === 7);
    const forwardDir = color === 'w' ? 'up' : 'down';
    const regMoves = getLineMoves({
        board,
        vectors: pinVector && Math.abs(VECTORS[forwardDir]) !== Math.abs(pinVector)
            ? []
            : [VECTORS[forwardDir]],
        start: pIdx,
        range: firstMove ? 2 : 1,
        canCapture: false
    });
    const captureVectors = [
        VECTORS[`${forwardDir} left`],
        VECTORS[`${forwardDir} right`]
    ];
    const captureMoves = getLineMoves({
        board,
        start: pIdx,
        vectors: pinVector
            ? captureVectors.filter((v) => v === pinVector || v === -pinVector)
            : captureVectors,
        range: 1,
        onlyCapture: true
    }).filter((m) => {
        const piece = board[m];
        // check if it's the same as enpassant pIdx
        return (m === enPassant ||
            // check if there's a piece capture
            (piece && piece[0] !== color));
    });
    return regMoves.concat(captureMoves);
};
export function getChecks(oppColor, kIdx, board) {
    const checks = [];
    for (let i = 0; i < KNIGHT_JUMPS.length; i++) {
        const pIdx = kIdx + KNIGHT_JUMPS[i];
        const piece = board[pIdx];
        if (piece === `${oppColor}n`)
            checks.push(pIdx);
    }
    for (let i = 0; i < XY_VECTORS.length; i++) {
        traverseAlongVector(XY_VECTORS[i], kIdx, BOARD_LENGTH, (pIdx, breakLoop, distance) => {
            const piece = board[pIdx];
            if (piece === `${oppColor}q` ||
                piece === `${oppColor}r` ||
                (piece === `${oppColor}k` && distance === 1)) {
                checks.push(pIdx);
                breakLoop();
            }
        });
    }
    for (let i = 0; i < DIAGONAL_VECTORS.length; i++) {
        traverseAlongVector(DIAGONAL_VECTORS[i], kIdx, BOARD_LENGTH, (pIdx, breakLoop, distance) => {
            const piece = board[pIdx];
            if (piece === `${oppColor}q` ||
                piece === `${oppColor}b` ||
                (piece === `${oppColor}k` && distance === 1) ||
                (piece === `${oppColor}p` && distance === 1 && oppColor === 'w'
                    ? DIAGONAL_VECTORS[i] > 0
                    : DIAGONAL_VECTORS[i] < 0)) {
                checks.push(pIdx);
                breakLoop();
            }
        });
    }
    return checks;
}
function getSquaresControlledByPawn(board, color, pIdx) {
    const forwardDir = color === 'w' ? 'up' : 'down';
    return getLineMoves({
        board,
        start: pIdx,
        vectors: [VECTORS[`${forwardDir} left`], VECTORS[`${forwardDir} right`]],
        range: 1,
        includeOwnPieces: true
    });
}
function getSquaresControlledBy(color, board, pieceMap) {
    const allMoves = {};
    for (const [type, pieceSquares] of Object.entries(pieceMap)) {
        const pieceType = type;
        for (let i = 0; i < pieceSquares.length; i++) {
            const moves = pieceType === 'p'
                ? getSquaresControlledByPawn(board, color, pieceSquares[i])
                : getPieceMoves(pieceType, board, pieceSquares[i], undefined, true);
            moves.forEach((m) => (allMoves[m] = true));
        }
    }
    return allMoves;
}
export function getLegalKingMoves(kingIdx, oppPieceMap, castleRights, board) {
    var _a;
    // need to remove king because rooks/queens/bishops control the square behind the king as well
    const copy = [...board];
    copy[kingIdx] = null;
    const kingMoves = getPieceMoves('k', board, kingIdx);
    const allEnemyMoves = getSquaresControlledBy(OPP_COLOR[(_a = board[kingIdx]) === null || _a === void 0 ? void 0 : _a[0]], copy, oppPieceMap);
    const castleSquares = {
        k: [kingIdx + 1, kingIdx + 2],
        q: [kingIdx - 1, kingIdx - 2]
    };
    // check if king can castle
    for (const [side, canCastle] of Object.entries(castleRights)) {
        if (!canCastle)
            continue;
        if (
        // castle squares are not empty or is under control by enemy piece
        castleSquares[side].some((s) => {
            if (board[s] !== null)
                return true;
            return s in allEnemyMoves;
        }))
            continue;
        kingMoves.concat(castleSquares[side][1]);
    }
    return kingMoves.filter((s) => !(s in allEnemyMoves));
}
function getDirOfS1FromS2(s1Idx, s2Idx) {
    // check if squares lies along the same line
    // figure out direction of s2 in relation to s1 eg. s1 is to right of s2
    const s1 = convertIdxToSquare(s1Idx);
    const s2 = convertIdxToSquare(s2Idx);
    if (s1[0] === s2[0]) {
        // squares are on same file
        return Number(s1[1]) > Number(s2[1]) ? 'up' : 'down';
    }
    if (s1[1] === s2[1]) {
        return s1[0] > s2[0] ? 'right' : 'left';
    }
    // finding if
    const rankDiff = Number(s1[1]) - Number(s2[1]);
    const fileDiff = FILES.indexOf(s1[0]) - FILES.indexOf(s2[0]);
    if (Math.abs(rankDiff) !== Math.abs(fileDiff))
        return;
    let diagDir = '';
    if (rankDiff > 0)
        diagDir += 'up';
    else
        diagDir += 'down';
    if (fileDiff > 0)
        diagDir += ' right';
    else
        diagDir += ' left';
    return diagDir;
}
function getSquaresAlongDir(vector, start, cb) {
    const vectorMap = {};
    traverseAlongVector(vector, start, BOARD_LENGTH, (sIdx, breakLoop) => {
        vectorMap[sIdx] = true;
        cb && cb(sIdx, breakLoop);
    });
    return vectorMap;
}
function getSquaresBetweenTwoSquares(s1Idx, s2Idx) {
    const dir = getDirOfS1FromS2(s1Idx, s2Idx);
    if (!dir)
        return;
    return getSquaresAlongDir(VECTORS[dir], s2Idx, (sIdx, breakLoop) => {
        // dont want to include s1Idx
        if (sIdx === s1Idx - VECTORS[dir])
            breakLoop();
    });
}
function isPiecePinned(sIdx, kingIdx, oppColor, board) {
    // returns undefined because pin vector is an optional parameter
    const dirOfPin = getDirOfS1FromS2(sIdx, kingIdx);
    if (!dirOfPin)
        return undefined;
    const isDiagonal = dirOfPin.includes(' ');
    const pinPieceType = isDiagonal ? 'b' : 'r';
    // vectors represented as an offset
    const pinVector = VECTORS[dirOfPin];
    let pinned = false;
    traverseAlongVector(pinVector, sIdx, BOARD_LENGTH, (mIdx, breakLoop) => {
        if (board[mIdx] === `${oppColor}${pinPieceType}` ||
            board[mIdx] === `${oppColor}q`) {
            pinned = true;
            breakLoop();
        }
    });
    return pinned ? pinVector : undefined;
}
export function getLegalMoves(pieceType, board, color, sIdx, kingIdx, check, enPassant) {
    if (check.length === 2)
        return [];
    const oppColor = color === 'w' ? 'b' : 'w';
    const pinVector = isPiecePinned(sIdx, kingIdx, oppColor, board);
    const moves = pieceType === 'p'
        ? getPawnMoves(board, color, sIdx, enPassant, pinVector)
        : getPieceMoves(pieceType, board, sIdx, pinVector);
    if (check.length === 0)
        return moves;
    // check length is 1
    const block = getSquaresBetweenTwoSquares(kingIdx, check[0]);
    return moves.filter((s) => s in block);
}
export function getMovesForColor(board, pieceMap, color, enPassant, castleRights, check) {
    const allMoves = {};
    const oppColor = OPP_COLOR[color];
    for (const [type, pieceSquares] of Object.entries(pieceMap[color])) {
        const pieceType = type;
        for (let i = 0; i < pieceSquares.length; i++) {
            const moves = pieceType === 'k'
                ? getLegalKingMoves(pieceSquares[0], pieceMap[oppColor], castleRights, board)
                : getLegalMoves(pieceType, board, color, pieceSquares[i], pieceMap[color].k[0], check, enPassant || undefined);
            moves.forEach((m) => (allMoves[m] = true));
        }
    }
    return allMoves;
}
export const exportedForTesting = {
    isPiecePinned,
    getSquaresBetweenTwoSquares
};
//# sourceMappingURL=getMoves.js.map