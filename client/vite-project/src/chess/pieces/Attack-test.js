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
function simulateMove(LUT, origin, dest) {
  // shallow-clone board; move piece from origin -> dest (capture if present)
    const next = { ...LUT };
    const moving = next[origin];
    if (!moving) return next; // defensive

    const movedPiece = { ...moving, location: dest };
    delete next[origin];
    next[dest] = movedPiece;
    return next;
}

function getKingSquare(LUT, color) {
    for (const sq in LUT) {
        const p = LUT[sq];
        if (p && p.type === "king" && p.color === color) return sq;
    }
    return null;
}

function isSquareAttackedByColor(targetSq, LUT, attackerColor) {
    return (
        attackRook(targetSq, LUT, attackerColor)   ||
        attackBishop(targetSq, LUT, attackerColor) ||
        attackKnight(targetSq, LUT, attackerColor) ||
        attackQueen(targetSq, LUT, attackerColor)  ||
        attackKing(targetSq, LUT, attackerColor)   ||
        attackPawn(targetSq, LUT, attackerColor)
    );
}
function addGoldChecks(objGB, LUT, originColor, origin) {
    const out = { ...objGB };
    const enemyColor = originColor === "white" ? "black" : "white";
    const enemyKingSq = getKingSquare(LUT, enemyColor);
    if (!enemyKingSq) return out; // no king found (shouldn't happen in normal play)

    // Consider any square that exists in objGB (green/blue/red/purple). Gold overrides them.
    for (const dest of Object.keys(out)) {
        // Only simulate *legal candidates*—you can restrict this to just green/blue if you prefer.
        // if (out[dest] !== "green" && out[dest] !== "blue") continue;

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
                // If we hit any piece, check if it's an enemy bishop
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
                // If we hit any piece, check if it's an enemy rook
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
                // If we hit any piece, check if it's an enemy queen
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

function makeRPG(objGB, LUT, originColor, origin) {
    let objectGBRPG = { ...objGB };
    const enemyColor = originColor === 'white' ? 'black' : 'white';
    
    // Loop through valid moves and check for attacks
    for (const [currentOrigin, color] of Object.entries(objectGBRPG)) {
        // Only process green and blue squares
        if (color !== 'green' && color !== 'blue') continue;
        
        console.log('Square', currentOrigin);
        console.log('color', color);
        
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

    return objectGBRPG; 
}

function main(){

    const objGB = {
        "b5": "blue",   // blue
        "d5": "blue",   // purple
        "e4": "blue",   // purple
        "b1": "green",  // red
        "a4": "green"   // green
    }

    const LUT = {
        "a2": {
            "id": "wp-1",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "a2"
        },
        "a1": {
            "id": "wr-3",
            "type": "rook",
            "color": "white",
            "img": "/chess/assets/white-rook.png",
            "moves": 0,
            "location": "a1"
        },
        "b7": {
            "id": "bp-6",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "b7"
        },
        "b8": {
            "id": "bk-8",
            "type": "knight",
            "color": "black",
            "img": "/chess/assets/black-knight.png",
            "moves": 0,
            "location": "b8"
        },
        "c2": {
            "id": "wp-9",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "c2"
        },
        "c7": {
            "id": "bp-10",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "c7"
        },
        "c8": {
            "id": "bb-12",
            "type": "bishop",
            "color": "black",
            "img": "/chess/assets/black-bishop.png",
            "moves": 0,
            "location": "c8"
        },
        "d2": {
            "id": "wp-13",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "d2"
        },
        "d1": {
            "id": "wq-15",
            "type": "queen",
            "color": "white",
            "img": "/chess/assets/white-queen.png",
            "moves": 0,
            "location": "d1"
        },
        "e2": {
            "id": "wp-17",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "e2"
        },
        "e7": {
            "id": "bp-18",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "e7"
        },
        "e1": {
            "id": "wk-19",
            "type": "king",
            "color": "white",
            "img": "/chess/assets/white-king.png",
            "moves": 0,
            "location": "e1"
        },
        "e8": {
            "id": "bk-20",
            "type": "king",
            "color": "black",
            "img": "/chess/assets/black-king.png",
            "moves": 0,
            "location": "e8"
        },
        "f2": {
            "id": "wp-21",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "f2"
        },
        "f7": {
            "id": "bp-22",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "f7"
        },
        "f1": {
            "id": "wb-23",
            "type": "bishop",
            "color": "white",
            "img": "/chess/assets/white-bishop.png",
            "moves": 0,
            "location": "f1"
        },
        "f8": {
            "id": "bb-24",
            "type": "bishop",
            "color": "black",
            "img": "/chess/assets/black-bishop.png",
            "moves": 0,
            "location": "f8"
        },
        "g2": {
            "id": "wp-25",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "g2"
        },
        "g7": {
            "id": "bp-26",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "g7"
        },
        "g1": {
            "id": "wk-27",
            "type": "knight",
            "color": "white",
            "img": "/chess/assets/white-knight.png",
            "moves": 0,
            "location": "g1"
        },
        "h7": {
            "id": "bp-30",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "h7"
        },
        "h8": {
            "id": "br-32",
            "type": "rook",
            "color": "black",
            "img": "/chess/assets/black-rook.png",
            "moves": 0,
            "location": "h8"
        },
        "c3": {
            "id": "wk-7",
            "type": "knight",
            "color": "white",
            "img": "/chess/assets/white-knight.png",
            "moves": 1,
            "location": "c3"
        },
        "e4": {
            "id": "bk-28",
            "type": "knight",
            "color": "black",
            "img": "/chess/assets/black-knight.png",
            "moves": 2,
            "location": "e4"
        },
        "d5": {
            "id": "bp-14",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 1,
            "location": "d5"
        },
        "a3": {
            "id": "wb-11",
            "type": "bishop",
            "color": "white",
            "img": "/chess/assets/white-bishop.png",
            "moves": 1,
            "location": "a3"
        },
        "e5": {
            "id": "bq-16",
            "type": "queen",
            "color": "black",
            "img": "/chess/assets/black-queen.png",
            "moves": 2,
            "location": "e5"
        },
        "h4": {
            "id": "wr-31",
            "type": "rook",
            "color": "white",
            "img": "/chess/assets/white-rook.png",
            "moves": 1,
            "location": "h4"
        },
        "h6": {
            "id": "wp-29",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 3,
            "location": "h6"
        },
        "b5": {
            "id": "br-4",
            "type": "rook",
            "color": "black",
            "img": "/chess/assets/black-rook.png",
            "moves": 3,
            "location": "b5"
        }
    }

    const origin = "c3"
    const originColor = "white"
    const objectGBRPG = makeRPG(objGB, LUT, originColor, origin)
    const withGold = addGoldChecks(objectGBRPG, LUT, originColor, origin);

    console.log(withGold)
}

main()