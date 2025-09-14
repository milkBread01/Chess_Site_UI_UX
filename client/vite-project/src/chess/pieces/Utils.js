
/* 
    IN :  "d4"
    OUT:  4 3
*/
export function stringToNumeric(stringNotation) {
    if (stringNotation.length !== 2) {
        console.error("Invalid notation:", stringNotation);
        return null;
    }

    const file = stringNotation[0].toLowerCase();
    const rank = parseInt(stringNotation[1], 10);

    if (file < "a" || file > "h" || rank < 1 || rank > 8) {
        console.error("Out of range:", stringNotation);
        return null;
    }

    const row = 8 - rank;
    const col = file.charCodeAt(0) - "a".charCodeAt(0);

    return [row, col];
}

/* 
    IN :  4 3
    OUT:  "d4"
*/
export function numericToString([row, col]) {
    if (row < 0 || row > 7 || col < 0 || col > 7) {
        console.error("Invalid indices:", [row, col]);
        return "";
    }

    const file = String.fromCharCode("a".charCodeAt(0) + col);
    const rank = 8 - row;

    return `${file}${rank}`;
}

/* 
    IN :  "43"
    OUT:  "d4"
*/
export function numericStringToString(numericString){

    if (numericString.length < 2) {
        return null;
    }

    const row = Number(numericString[0]);
    const col = Number(numericString.slice(1)); // Use slice to handle negative numbers

    // Validate bounds
    if (row < 0 || row > 7 || col < 0 || col > 7) {
        return null;
    }

    const file = String.fromCharCode("a".charCodeAt(0) + col);
    const rank = 8 - row;

    return `${file}${rank}`;

}

/* 
    theoretical Moves are in format of:
    {
    d0: [ 'd5', 'd6', 'd7', 'd8' ],
    d1: [ 'e4', 'f4', 'g4', 'h4' ],
    d2: [ 'd3', 'd2', 'd1' ],
    d3: [ 'c4', 'b4', 'a4' ]
    }
*/
/* ensure no piece exists in the move spot */
export function filterRays(theoreticalMoveList, LUT, originColor) {

    let validatedMoveList = [];
    let enemySquares = [];
    
    for (const dirKey in theoreticalMoveList) {
        const ray = theoreticalMoveList[dirKey];
        for (const sq of ray) {
          const occ = LUT[sq];
        
          if(!occ) {
            // if empty, keep and continue scanning this direction
            validatedMoveList.push(sq);
            continue;
          }
        
          if(occ.color !== originColor) {
            // if enemy, capture square allowed, then stop scanning this direction
            validatedMoveList.push(sq);
            enemySquares.push(sq);
          }
          // friendly OR enemy both block further squares
          break;
        }
    }
    /* 
    for the validated List, make object with value as green unless VML contains matching EQ, if overlap then assign blue
        h1: "green"
        h2: "blue"
    */
    if(enemySquares){
        let objGB = makeB(validatedMoveList,enemySquares);
        /* console.log("RAYS")
        console.log(objGB) */
        return objGB
    }else{
        return objGB = {};
    }
    

    //return validatedMoveList;
}

export function filterNonRays(theoreticalMoves, LUT, originColor){
    //console.log("FILTER NON RAY BUCKETS")
    let valid = [];
    let enemySquares = [];

    for (const dirKey in theoreticalMoves) {
        const candidates = theoreticalMoves[dirKey];
        for (const sq of candidates) {
            const occ = LUT[sq]; 
            if(!occ){
                //empty
                valid.push(sq);
                continue;
            }
            if(occ.color !== originColor){
                valid.push(sq);
                enemySquares.push(sq);
            }
            break;
        }
    }

    if(enemySquares){
        /* console.log(`VALID ${valid}`)
        console.log(`ENEMIES ${enemySquares}`) */
        let objGB = makeB(valid,enemySquares);
        /* console.log(`obj`)
        console.log(objGB) */
        return objGB
    }else{
        return objGB = {};
    }
    //return valid;
}

function makeB(validatedMoveList, enemySquares){
    let colorMap = {}
    //console.log("MAKE OBJ GB")

    for ( const square of validatedMoveList ){
        
        colorMap[square] = enemySquares.includes(square) ? "blue" : "green";
    }
    //console.log(colorMap)
    return colorMap
}
function safeCreatePosition(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) {
        return null;
    }

    const file = String.fromCharCode("a".charCodeAt(0) + col);
    const rank = 8 - row;

    return `${file}${rank}`;
}
export function filterPawn(LUT, originColor, origin) {
    let valid = [];
    let enemySquares = [];
    const originRC = stringToNumeric(origin);
    
    if (!originRC) {
        console.error("Invalid origin:", origin);
        return makeB(valid, enemySquares);
    }

    console.log(`Grid Pos: ${origin} \n row: ${originRC[0]} \n col: ${originRC[1]}`);

    // Helper function to safely create position strings
    const safeCreatePosition = (row, col) => {
        if (row < 0 || row > 7 || col < 0 || col > 7) {
            return null;
        }
        return numericStringToString(`${row}${col}`);
    };

    if (originColor === "white") {
        const newRow = originRC[0] - 1;
        
        // Forward movement
        if (newRow >= 0) {
            const verticalUp1 = safeCreatePosition(newRow, originRC[1]);
            if (verticalUp1 && !LUT[verticalUp1]) {
                valid.push(verticalUp1);
                
                // Two-square move from starting position
                if (originRC[0] === 6) {
                    const verticalUp2 = safeCreatePosition(newRow - 1, originRC[1]);
                    if (verticalUp2 && !LUT[verticalUp2]) {
                        valid.push(verticalUp2);
                    }
                }
            }
        }

        // Diagonal captures
        if (newRow >= 0) {
            // Left diagonal
            if (originRC[1] > 0) {
                const diagonalL = safeCreatePosition(newRow, originRC[1] - 1);
                if (diagonalL && LUT[diagonalL] && LUT[diagonalL].color !== originColor) {
                    valid.push(diagonalL);
                    enemySquares.push(diagonalL);
                }
            }

            // Right diagonal
            if (originRC[1] < 7) {
                const diagonalR = safeCreatePosition(newRow, originRC[1] + 1);
                if (diagonalR && LUT[diagonalR] && LUT[diagonalR].color !== originColor) {
                    valid.push(diagonalR);
                    enemySquares.push(diagonalR);
                }
            }
        }
    }

    if (originColor === "black") {
        const newRow = originRC[0] + 1;
        
        // Forward movement
        if (newRow <= 7) {
            const verticalDown1 = safeCreatePosition(newRow, originRC[1]);
            if (verticalDown1 && !LUT[verticalDown1]) {
                valid.push(verticalDown1);
                
                // Two-square move from starting position
                if (originRC[0] === 1) {
                    const verticalDown2 = safeCreatePosition(newRow + 1, originRC[1]);
                    if (verticalDown2 && !LUT[verticalDown2]) {
                        valid.push(verticalDown2);
                    }
                }
            }
        }

        // Diagonal captures
        if (newRow <= 7) {
            // Left diagonal
            if (originRC[1] > 0) {
                const diagonalL = safeCreatePosition(newRow, originRC[1] - 1);
                if (diagonalL && LUT[diagonalL] && LUT[diagonalL].color !== originColor) {
                    valid.push(diagonalL);
                    enemySquares.push(diagonalL);
                }
            }

            // Right diagonal
            if (originRC[1] < 7) {
                const diagonalR = safeCreatePosition(newRow, originRC[1] + 1);
                if (diagonalR && LUT[diagonalR] && LUT[diagonalR].color !== originColor) {
                    valid.push(diagonalR);
                    enemySquares.push(diagonalR);
                }
            }
        }
    }

    return makeB(valid, enemySquares);
}

export function makeObj(moveList, color = "green") {
    const out = {};
    for (const sq of moveList) out[sq] = color;
    return out;
}