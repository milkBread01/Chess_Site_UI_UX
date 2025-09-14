import { isSquareAttackedByColor } from './Attack.js';
import { stringToNumeric } from './Utils.js';
import { isCastlingOk } from './CastlingUtils';
import { executeCastlingMove } from './CastlingUtils';
import { isCastlingMove } from './CastlingUtils';

import { getPawnMoves } from "./Pawn";
import { getBishopMoves } from "./Bishop";
import { getRookMoves } from "./Rook";
import { getQueenMoves } from "./Queen";
import { getKnightMoves } from "./Knight";
import { getKingMoves } from "./King";

/* Determine if king is currently in check */
export function isInCheck(LUT, color) {
    const kingPosition = getKingPosition(LUT, color);
    if (!kingPosition) return false;
    
    const enemyColor = color === "white" ? "black" : "white";
    return isSquareAttackedByColor(kingPosition, LUT, enemyColor);
}

/* Get king position from LUT given color */
export function getKingPosition(LUT, color) {
    for (const square in LUT) {
        const piece = LUT[square];
        if (piece && piece.type === "king" && piece.color === color) {
            return square;
        }
    }
    return null;
}

/* Get all legal moves for ANY piece of the given color (not just king!) */
export function getAllLegalMoves(LUT, pieceColor) {
    const legalMoves = [];

    // iterate through ALL pieces of the given color
    for (const square in LUT) {
        const piece = LUT[square];
        // FIXED: Check piece.color, not piece !== pieceColor
        if (!piece || piece.color !== pieceColor) continue;

        // get all possible moves for THIS piece (any piece, not just king)
        const possibleMoves = getPossibleMoves(piece, square, LUT);

        // loop through possible moves with their colors
        for (const [destinationSquare, color] of Object.entries(possibleMoves)) {
            if (!["green", "blue", "red", "purple", "gold"].includes(color)) {
                continue;
            }

            const newBoardState = simulateMove(LUT, square, destinationSquare);

            // check if the king is in check after move is made
            if (!isInCheck(newBoardState, pieceColor)) {
                legalMoves.push({
                    from: square,
                    to: destinationSquare,
                    piece: piece,
                    originalColor: color
                });
            }
        }
    }
    return legalMoves;
}

/* make move in board to test the legality of move */
export function simulateMove(LUT, from, to) {
    const newLUT = { ...LUT };
    const piece = newLUT[from];
    // if piece !exist return
    if (!piece) return newLUT;
    
    // update LUT to register move
    newLUT[to] = {
        ...piece,
        location: to,
        moves: (piece.moves || 0) + 1
    };
    delete newLUT[from];
    
    return newLUT;
}

/* Get all possible moves for any piece, return object with colors */
export function getPossibleMoves(piece, square, LUT, moveHistory = []) {
    let moves = {};
    
    switch (piece.type) {
        case "pawn":
            moves = getPawnMoves(square, LUT, piece.color);
            break;
        case "bishop":
            moves = getBishopMoves(square, LUT, piece.color);
            break;
        case "rook":
            moves = getRookMoves(square, LUT, piece.color);
            break;
        case "queen":
            moves = getQueenMoves(square, LUT, piece.color);
            break;
        case "knight":
            moves = getKnightMoves(square, LUT, piece.color);
            break;
        case "king":
            moves = getKingMoves(square, LUT, piece.color);
            // Add castling moves if valid
            const castlingMoves = isCastlingOk(piece, LUT, moveHistory);
            moves = { ...moves, ...castlingMoves };
            break;
        default:
            return {};
    }

    return moves;
}

/* Get legal moves for specific piece with color preservation */
export function getLegalMovesForPiece(piece, square, LUT, moveHistory = []) {
    const possibleMoves = getPossibleMoves(piece, square, LUT, moveHistory);
    const legalHighlights = {};
    
    // Iterate through all possible moves with their original colors
    for (const [destinationSquare, originalColor] of Object.entries(possibleMoves)) {
        // Skip moves that aren't valid RPG colors
        if (!["green", "blue", "red", "purple", "gold"].includes(originalColor)) {
            continue;
        }
        
        const newBoardState = simulateMove(LUT, square, destinationSquare);
        
        // Only include moves that don't leave our king in check
        if (!isInCheck(newBoardState, piece.color)) {
            // Preserve the original RPG color coding
            legalHighlights[destinationSquare] = originalColor;
        }
    }
    
    return legalHighlights;
}

/* Check for checkmate - king in check AND no legal moves for ANY piece */
export function isCheckMate(LUT, color) {
    // Must be in check to be checkmate
    if (!isInCheck(LUT, color)) return false;
    
    // if ANY legal moves exist (for ANY piece), then not checkmate
    const legalMoves = getAllLegalMoves(LUT, color);
    return legalMoves.length === 0;
}

/* Check for stalemate - NOT in check AND no legal moves for ANY piece */
export function isStalemate(LUT, color) {
    // CANT be in check to be in stalemate 
    if (isInCheck(LUT, color)) return false;
    
    // if no legal moves for ANY piece and not in check, it's stalemate
    const legalMoves = getAllLegalMoves(LUT, color);
    return legalMoves.length === 0;
}

/* checks game status for check, checkmate, stalemate conditions */
export function getGameStatus(LUT, currentPlayer) {
    const inCheck = isInCheck(LUT, currentPlayer);
    const legalMoves = getAllLegalMoves(LUT, currentPlayer); // Now checks ALL pieces
    const hasLegalMoves = legalMoves.length > 0;
    
    return {
        inCheck,
        checkmate: inCheck && !hasLegalMoves,
        stalemate: !inCheck && !hasLegalMoves,
        gameOver: (inCheck && !hasLegalMoves) || (!inCheck && !hasLegalMoves),
        legalMovesCount: legalMoves.length,
        legalMoves
    };
}