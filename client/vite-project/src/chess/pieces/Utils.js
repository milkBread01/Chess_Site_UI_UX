
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

    const row = Number(numericString[0])
    const col = Number(numericString[1])

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

    let colorMap = makeB(validatedMoveList, enemySquares); 

    return validatedMoveList;
}

function makeB(validatedMoveList, enemySquares){
    let colorMap = {}

    for ( const square of validatedMoveList ){
        colorMap[square] = enemySquares.includes(square) ? "blue" : "green"
    }
    return colorMap
}

export function filterNonRays(theoreticalMoves, LUT, originColor){
    console.log("FILTER NON RAY BUCKETS")
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

    let colorMap = makeB(validatedMoveList, enemySquares);

    return valid;
}

export function filterPawn(LUT, originColor, origin){
    /* 
        search for pawn pos on LUT to determin if allowed to move 2 spaces
            row 6 for white 
            row 1 for black
        search for obstructions in vertical direction and for other pieces diagonal 
            [-1, -1] && [-1, 1]
        from origin to determine if enemy piece is present, ignore friendly
    */

    let valid = [];
    const originRC = stringToNumeric(origin)
    console.log(`Grid Pos: ${origin} \n row: ${originRC[0]} \n col: ${originRC[1]}`)

    if (originColor==="white" && originRC[0] === 6){
        console.log(`COLOR IS WHITE AND BASE ROW`)
        let verticalUp1 = numericStringToString(`${originRC[0]-1}${originRC[1]}`);
        let verticalUp2 = numericStringToString(`${originRC[0]-2}${originRC[1]}`);

        if (!LUT[verticalUp1]){
            valid.push(verticalUp1)
        }

        if (!LUT[verticalUp2]){
            valid.push(verticalUp2)
        }

        let diagonalL = numericStringToString(`${originRC[0]-1}${originRC[1]-1}`);
        let diagonalR = numericStringToString(`${originRC[0]-1}${originRC[1]+1}`); 

        if (LUT[diagonalL]){
            if(LUT[diagonalL].color !== originColor){
                valid.push(diagonalL)
            }
        }

        if (LUT[diagonalR]){
            if(LUT[diagonalR].color !== originColor){
                valid.push(diagonalR)
            }
        }

        return valid
    }

    if ( originColor==="white"){
        let verticalUp1 = numericStringToString(`${originRC[0]-1}${originRC[1]}`)

        if(!LUT[verticalUp1]){
            valid.push(verticalUp1)
        }

        let diagonalL = numericStringToString(`${originRC[0]-1}${originRC[1]-1}`);
        let diagonalR = numericStringToString(`${originRC[0]-1}${originRC[1]+1}`); 

        if(LUT[diagonalL]){
            if(LUT[diagonalL].color !== originColor){
                valid.push(diagonalL)
            }
        }

        if(LUT[diagonalR]){
            if(LUT[diagonalR].color !== originColor){
                valid.push(diagonalR)
            }
        }

        return valid
    }

    if (originColor==="black" && originRC[0] === 1){
        console.log(`COLOR IS BLACK AND BASE ROW`)
        let verticalDown1 = numericStringToString(`${originRC[0]+1}${originRC[1]}`);
        let verticalDown2 = numericStringToString(`${originRC[0]+2}${originRC[1]}`);

        if(!LUT[verticalDown1]){
            valid.push(verticalDown1)
        }

        if(!LUT[verticalDown2]){
            valid.push(verticalDown2)
        }

        let diagonalL = numericStringToString(`${originRC[0]+1}${originRC[1]-1}`);
        let diagonalR = numericStringToString(`${originRC[0]+1}${originRC[1]+1}`); 

        if(LUT[diagonalL]){
            if(LUT[diagonalL].color !== originColor){
                valid.push(diagonalL)
            }
        }

        if(LUT[diagonalR]){
            if(LUT[diagonalR].color !== originColor){
                valid.push(diagonalR)
            }
        }

        return valid
    }

    if(originColor==="black"){
        let verticalDown1 = numericStringToString(`${originRC[0]+1}${originRC[1]}`)

        if(!LUT[verticalDown1]){
            valid.push(verticalDown1)
        }

        let diagonalL = numericStringToString(`${originRC[0]+1}${originRC[1]-1}`);
        let diagonalR = numericStringToString(`${originRC[0]+1}${originRC[1]+1}`); 

        if(LUT[diagonalL]){
            if(LUT[diagonalL].color !== originColor){
                valid.push(diagonalL)
            }
        }

        if(LUT[diagonalR]){
            if(LUT[diagonalR].color !== originColor){
                valid.push(diagonalR)
            }
        }

        return valid
    }
}

export function makeObj(moveList, color = "green") {
    const out = {};
    for (const sq of moveList) out[sq] = color;
    return out;
}
