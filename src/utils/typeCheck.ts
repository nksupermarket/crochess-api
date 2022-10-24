import Piece from 'src/classes/Piece';
import {
  EnumerateFromOne,
  Files,
  SquareIdx,
  Square,
  Rank,
  PieceType,
  PieceAbr,
  Colors
} from '../types/types';
import { ABR_TO_PIECE_MAP, COLORS, FILES } from './constants';

export function isSquareIdx<B extends number>(
  boardSize: B,
  value: number[]
): value is SquareIdx<B> {
  return (
    value[0] >= 0 &&
    value[0] < boardSize &&
    value[1] >= 0 &&
    value[1] < boardSize
  );
}

export function isFiles(char: string): char is Files {
  return !!FILES.find((v) => v === char);
}

export function isSquare<N extends number>(
  boardSize: N,
  value: string
): value is Square<Files, EnumerateFromOne<N>> {
  if (value.length > 2) return false;
  if (!isFiles(value[0])) return false;
  if (FILES.indexOf(value[0]) >= boardSize) return false;
  if (+value[1] > boardSize) return false;
  return true;
}

export function isRank<Size extends number>(
  size: Size,
  value: any[]
): value is Rank<Size> {
  if (value.length !== size) return false;
  return value.every((v) => {
    return v instanceof Piece || v === null;
  });
}

export function isPieceAbr(char: string): char is PieceAbr {
  return ABR_TO_PIECE_MAP[char.toLowerCase() as PieceAbr] !== undefined;
}

export function isColor(char: string): char is Colors {
  return COLORS.includes(char as Colors);
}

function isCastleRightsStr(str: string) {
  const castleRights = ['K', 'k', 'Q', 'q'];

  const strMap: { [key: string]: true } = {};
  for (let i = 0; i < str.length; i++) {
    if (castleRights.indexOf(str[i]) === -1) return;
    if (strMap[str[i]]) return false;
  }

  return true;
}

export function isFenStr(str: string) {
  const split = str.split(' ');
  const [
    boardStr,
    activeColor,
    castleRightsStr,
    enPassant,
    halfmoves,
    fullmoves
  ] = split;

  const splitIntoRanks = boardStr.split('/');
  const size = splitIntoRanks.length;

  if (
    splitIntoRanks.some((r) => {
      // find a rank whose length is not equal to size
      let rankSize = 0;
      for (let i = 0; i < r.length; i++) {
        if (Number(r[i])) rankSize += Number(r[i]);
        else if (isPieceAbr(r[i])) rankSize++;
        else return true;
      }

      return rankSize !== size;
    })
  ) {
    return false;
  }

  if (!isColor(activeColor)) return false;
  if (!isCastleRightsStr(castleRightsStr)) return false;
  if (!isSquare(size, enPassant) && enPassant !== '-') return false;
  if (!Number(halfmoves)) return false;
  if (!Number(fullmoves)) return false;

  return true;
}
