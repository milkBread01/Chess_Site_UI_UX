import { isSquareAttackedByColor } from './Attack.js';

export function isCastlingOk(movingPiece, LUT){
    const castlingHighlights = {};

    const enemyColor = movingPiece.color === "white" ? "black" : "white";
    //console.log("Castling Check")
    if(movingPiece.type !== "king") return castlingHighlights;
    //console.log("Castling Check")
    if (movingPiece.moves > 0) return castlingHighlights;

    if (isSquareAttackedByColor(movingPiece.location, LUT, enemyColor)) {
        return castlingHighlights;
    }

    //console.log('KING color',movingPiece.color)
    if(movingPiece.color === "white"){
        // King Side
        const kingSideRook = LUT["h1"];
        if(kingSideRook.type === "rook" && kingSideRook.moves === 0) {
            // make sure THe intermediate sppots are empty
            if(!LUT["f1"] && !LUT["g1"]){
                // make sure that the king will not be under attack when moved
                if (!isSquareAttackedByColor("f1", LUT, enemyColor) && 
                    !isSquareAttackedByColor("g1", LUT, enemyColor)) {
                    castlingHighlights["g1"] = "green";
                }
            }
        }
        const queensideRook = LUT["a1"];
        if (queensideRook && queensideRook.type === "rook" && queensideRook.moves === 0) {
            if (!LUT["b1"] && !LUT["c1"] && !LUT["d1"]) {
                if (!isSquareAttackedByColor("c1", LUT, enemyColor) && 
                    !isSquareAttackedByColor("d1", LUT, enemyColor)) {
                    castlingHighlights["c1"] = "green";
                }
            }
        }
        // if black
    }else {
        const kingsideRook = LUT["h8"];
        if (kingsideRook && 
            kingsideRook.type === "rook" && 
            kingsideRook.color === "black" && 
            kingsideRook.moves === 0) {
            
            // Check if squares between king and rook are empty
            if (!LUT["f8"] && !LUT["g8"]) {
                if (!isSquareAttackedByColor("f8", LUT, enemyColor) && 
                    !isSquareAttackedByColor("g8", LUT, enemyColor)) {
                    castlingHighlights["g8"] = "green";
                }
            }
        }

        const queensideRook = LUT["a8"];
        if (queensideRook && 
            queensideRook.type === "rook" && 
            queensideRook.color === "black" && 
            queensideRook.moves === 0) {
            
            // Check if squares between king and rook are empty
            if (!LUT["b8"] && !LUT["c8"] && !LUT["d8"]) {

                if (!isSquareAttackedByColor("c8", LUT, enemyColor) && 
                    !isSquareAttackedByColor("d8", LUT, enemyColor)) {
                    castlingHighlights["c8"] = "green";
                }
            }
        }

    }
    return castlingHighlights;
}

export function executeCastlingMove(from, to, LUT) {
    const newLUT = { ...LUT };
    const king = newLUT[from];
    
    if (!king || king.type !== "king") return LUT;
    
    const kingColor = king.color;
    let rookFrom, rookTo;
    
    if (kingColor === "white") {
        if (to === "g1") {
            // White kingside castling
            rookFrom = "h1";
            rookTo = "f1";
        } else if (to === "c1") {
            // White queenside castling
            rookFrom = "a1";
            rookTo = "d1";
        }
    // king is black
    } else {
        if (to === "g8") {
            // Black kingside castling
            rookFrom = "h8";
            rookTo = "f8";
        } else if (to === "c8") {
            // Black queenside castling
            rookFrom = "a8";
            rookTo = "d8";
        }
    }
    
    if (!rookFrom || !rookTo || !newLUT[rookFrom]) return LUT;
    
    // Move the king
    newLUT[to] = {
        ...king,
        location: to,
        moves: (king.moves ?? 0) + 1
    };
    delete newLUT[from];
    
    // Move the rook
    const rook = newLUT[rookFrom];
    newLUT[rookTo] = {
        ...rook,
        location: rookTo,
        moves: (rook.moves ?? 0) + 1
    };
    delete newLUT[rookFrom];
    
    return newLUT;
}

export function isCastlingMove(from, to, piece) {
    if (piece.type !== "king") return false;
    
    const validCastlingMoves = {
        "e1": ["g1", "c1"], // White king castling destinations
        "e8": ["g8", "c8"]  // Black king castling destinations
    };
    
    return validCastlingMoves[from]?.includes(to) || false;
}