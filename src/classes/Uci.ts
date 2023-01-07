// import Game from "./Game";

import Game from './Game';

//     function inputUCI() {
//         console.log("id name " + "croChess");
//         console.log("id author alex");
//         //options go here
//         console.log("uciok");
//     }

//     function inputIsReady() {
//         console.log("readyok");
//     }

//     function inputUCINewGame(game:Game) {
//         //add code here
//         GameState.loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
//     }

//     function algebraToMove( moveNotation) {
//         const from = moveNotation.charAt(0) - 'a' + (16 * (Character.getNumericValue(moveNotation.charAt(1)) - 1));
//         const to = moveNotation.charAt(2) - 'a' + (16 * (Character.getNumericValue(moveNotation.charAt(3)) - 1));

//         const move = (from << 7) | to;
//         // handle castling
//         if (Piece.extractPieceType(GameState.board[from]) == Piece.KING) {
//             Color color = Color.extractColor(GameState.board[from]);
//             if (from - to == 2) {
//                 move = color == Color.W ? (Castle.W_Q.value << 14) | move : (Castle.B_q.value << 14) | move;
//             } else if (
//                     from - to == -2
//             ) move = color == Color.W ? (Castle.W_K.value << 14) | move : (Castle.B_k.value << 14) | move;
//         }

//         if (moveNotation.length() == 5) {
//             Map<Character, Piece> pieceMap = new HashMap<>();
//             pieceMap.put('q',
//                     Piece.QUEEN);
//             pieceMap.put('r',
//                     Piece.ROOK);
//             pieceMap.put('n',
//                     Piece.KNIGHT);
//             pieceMap.put('b',
//                     Piece.BISHOP);

//             move = (pieceMap.get(moveNotation.charAt(4)).id << 18) | move;
//         }

//         return move;
//     }

// function inputPosition(input: string) {
//   let game;
//   input = input.substring(9).concat(' ');
//   if (input.includes('startpos ')) {
//     input = input.substring(9);
//     game = new Game('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
//   } else if (input.includes('fen')) {
//     input = input.substring(4);
//     game = new Game(input);
//   }

//   if (input.includes('moves')) {
//     input = input.substring(input.indexOf('moves') + 6);
//     // make each of the moves
//     const moves = input.split(' ');
//     for (const moveNotation of moves) {
//       const move = algebraToMove(moveNotation);
//       Game.makeMove(move);
//     }
//   }
// }

//     function  moveToAlgebra( move) {
//         Square from = Square.lookup.get((move >> 7) & 127);
//         Square to = Square.lookup.get(move & 127);
//          promote = move >> 18;

//          algebra = from.toString()
//                              .toLowerCase() + to.toString()
//                                                 .toLowerCase();
//         if (promote != 0) {
//             Map<Integer, Character> abbrMap = new HashMap<>();
//             abbrMap.put(5, 'q');
//             abbrMap.put(4, 'r');
//             abbrMap.put(2, 'n');
//             abbrMap.put(3, 'b');

//             algebra += abbrMap.get(promote);
//         }

//         return algebra;
//     }

//     function inputGo() {
//         //search for best move
//          bestMove = MoveEval.getBestMove(5);
//          algebra = moveToAlgebra(bestMove);
//         console.log("bestmove " + algebra);
//     }

//     function print() {
//         GameState.printBoard();
//     }
