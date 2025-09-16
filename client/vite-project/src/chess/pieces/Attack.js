import { stringToNumeric, numericStringToString, filterRays, filterNonRays, filterPawn } from "./Utils.js";
import { moveTheoreticalBishop } from "./Bishop.js";
import { isKingAttacking } from "./King.js";
import { moveTheoreticalKnight } from "./Knight.js";
import { moveTheoreticalQueen } from "./Queen.js";
import { moveTheoreticalRook } from "./Rook.js";


/* 
    Inputs:
        objGB: { a1: 'green', b1: 'green', c1: 'blue' }
        LUT: piece lookup table with positions and piece info
        originColor: color of the moving piece ("white" or "black")
        origin: starting position of the piece ("h4")
        
    Outputs: 
        { a1: 'green', b1: 'red', c1: 'blue', d1: 'purple', e1: 'gold' }

*/
/* 
    Chess RPG Move Validation System
    Color coding:
    • GREEN - safe move
    • BLUE - capture enemy piece
    • RED - move but piece will be in danger
    • PURPLE - capture enemy but piece will be in danger (BLUE + RED)
    • GOLD - move results in check
*/
export function simulateMove(LUT, origin, dest) {

    const next = { ...LUT };
    const moving = next[origin];
    if (!moving) return next;

    const movedPiece = {
        ...moving,
        location: dest 
    };
    delete next[origin];
    next[dest] = movedPiece;
    return next;
}

export function getKingSquare(LUT, color) {
    for (const sq in LUT) {
        const p = LUT[sq];
        if (p && p.type === "king" && p.color === color) return sq;
    }
    return null;
}

export function isSquareAttackedByColor(targetSq, LUT, attackerColor) {
    return (
        attackRook(targetSq, LUT, attackerColor)   ||
        attackBishop(targetSq, LUT, attackerColor) ||
        attackKnight(targetSq, LUT, attackerColor) ||
        attackQueen(targetSq, LUT, attackerColor)  ||
        attackKing(targetSq, LUT, attackerColor)   ||
        attackPawn(targetSq, LUT, attackerColor)
    );
}

export function addGoldChecks(objGB, LUT, originColor, origin) {
    const out = { ...objGB };
    const enemyColor = originColor === "white" ? "black" : "white";
    const enemyKingSq = getKingSquare(LUT, enemyColor);
    if (!enemyKingSq) return out; 

    // Consider any square that exists in list, Gold overrides.
    for (const dest of Object.keys(out)) {

        const next = simulateMove(LUT, origin, dest);
        const givesCheck = isSquareAttackedByColor(enemyKingSq, next, originColor);

        if (givesCheck) out[dest] = "gold";
    }
    return out;
}

function attackPawn(currentOrigin, LUT, enemyColor) {
    const CORC = stringToNumeric(currentOrigin);
    
    if (!CORC) return false;

    if (enemyColor === "black") {
        // Check upper-left diagonal for black pawn attack
        const UL_pos = numericStringToString(`${CORC[0] - 1}${CORC[1] - 1}`);
        const UL = LUT[UL_pos];
        if (UL && UL.type === "pawn" && UL.color === enemyColor) {
            return true;
        }
        
        // Check upper-right diagonal for black pawn attack
        const UR_pos = numericStringToString(`${CORC[0] - 1}${CORC[1] + 1}`);
        const UR = LUT[UR_pos];
        if (UR && UR.type === "pawn" && UR.color === enemyColor) {
            return true;
        }
    }
    
    if (enemyColor === "white") {
        // Check lower-left diagonal for white pawn attack
        const DL_pos = numericStringToString(`${CORC[0] + 1}${CORC[1] - 1}`);
        const DL = LUT[DL_pos];
        if (DL && DL.type === "pawn" && DL.color === enemyColor) {
            return true;
        }

        // Check lower-right diagonal for white pawn attack
        const DR_pos = numericStringToString(`${CORC[0] + 1}${CORC[1] + 1}`);
        const DR = LUT[DR_pos];
        if (DR && DR.type === "pawn" && DR.color === enemyColor) {
            return true;
        }
    }
    
    return false;
}

function attackKnight(currentOrigin, LUT, enemyColor) {
    const theoMoves = moveTheoreticalKnight(currentOrigin);

    for (const [direction, moves] of Object.entries(theoMoves)) {
        for (const move of moves) {
            if (LUT[move]) {
                // Knight moves don't have blocking - check directly for enemy knight
                if (LUT[move].type === "knight" && LUT[move].color === enemyColor) {
                    return true;
                }
            }
        }
    }

    return false;
}

function attackBishop(currentOrigin, LUT, enemyColor) {
    const theoMoves = moveTheoreticalBishop(currentOrigin);

    for (const [direction, moves] of Object.entries(theoMoves)) {
        for (const move of moves) {
            if (LUT[move]) {
                // if find any piece, check if it's an enemy bishop
                if (LUT[move].type === "bishop" && LUT[move].color === enemyColor) {
                    return true;
                }
                // Stop scanning this direction after hitting any piece
                break;
            }
        }
    }

    return false;
}

function attackRook(currentOrigin, LUT, enemyColor) {
    const theoMoves = moveTheoreticalRook(currentOrigin);
    for (const [direction, moves] of Object.entries(theoMoves)) {
        for (const move of moves) {
            if (LUT[move]) {
                // if find any piece, check if it's an enemy rook
                if (LUT[move].type === "rook" && LUT[move].color === enemyColor) {
                    return true;
                }
                // Stop scanning this direction after hitting any piece
                break;
            }
        }
    }
    return false;
}

function attackQueen(currentOrigin, LUT, enemyColor) {
    const theoMoves = moveTheoreticalQueen(currentOrigin);

    for (const [direction, moves] of Object.entries(theoMoves)) {
        for (const move of moves) {
            if (LUT[move]) {
                // if find any piece, check if it's an enemy queen
                if (LUT[move].type === "queen" && LUT[move].color === enemyColor) {
                    return true;
                }
                // Stop scanning this direction after hitting any piece
                break;
            }
        }
    }

    return false;
}

function attackKing(currentOrigin, LUT, enemyColor) {
    const theoMoves = isKingAttacking(currentOrigin);

    for (const [direction, moves] of Object.entries(theoMoves)) {
        for (const move of moves) {
            if (LUT[move]) {
                // King moves are only one square, so check directly
                if (LUT[move].type === "king" && LUT[move].color === enemyColor) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function makeRPG(objGB, LUT, originColor, origin) {
    let objectGBRPG = { ...objGB };
    const enemyColor = originColor === 'white' ? 'black' : 'white';
    
    // Loop through valid moves and check for attacks
    for (const [currentOrigin, color] of Object.entries(objectGBRPG)) {

        if (color !== 'green' && color !== 'blue') continue;
        
        //console.log('Square', currentOrigin);
        //console.log('color', color);
        
        let isUnderAttack = false;
        
        // Check all types of attacks
        if (attackRook(currentOrigin, LUT, enemyColor)) {
            isUnderAttack = true;
        }
        
        if (attackBishop(currentOrigin, LUT, enemyColor)) {
            isUnderAttack = true;
        }
        
        if (attackKnight(currentOrigin, LUT, enemyColor)) {
            isUnderAttack = true;
        }
        
        if (attackQueen(currentOrigin, LUT, enemyColor)) {
            isUnderAttack = true;
        }
        
        if (attackKing(currentOrigin, LUT, enemyColor)) {
            isUnderAttack = true;
        }
        
        if (attackPawn(currentOrigin, LUT, enemyColor)) {
            isUnderAttack = true;
        }
        
        // Update color based on attack status
        if (isUnderAttack) {
            if (color === "green") {
                objectGBRPG[currentOrigin] = "red";
            } else if (color === "blue") {
                objectGBRPG[currentOrigin] = "purple";
            }
        }
    }

    // check check status to add gold color
    const withGold = addGoldChecks(objectGBRPG, LUT, originColor, origin);

    return withGold; 
}
