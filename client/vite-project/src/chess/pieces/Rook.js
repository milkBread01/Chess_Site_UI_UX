//import Attack from "./Attack"
import { stringToNumeric, numericStringToString, filterRays, makeObj } from "./Utils";

/* 
    Rook
    move any number of spaces vertically or horizontally
    4 possible directions
        |   .   | +-col |
        | +-row |   .   |

*/

function moveTheoretical(origin) {
    let theoreticalMoves = {};
    const [row,col] = stringToNumeric(origin);

    /* Search Up/down && L/R */
    const moveList = [
        [-1, 0],  // up
        [0, +1],  // right
        [+1, 0],  // down
        [0, -1]   // left
    ];
    for (let m = 0; m < moveList.length; m++) {
        let currentRow = row;
        let currentCol = col;
        let directionMoves = [];

        while (true) {
            currentRow += moveList[m][0];
            currentCol += moveList[m][1];

            if (
                currentRow < 0 || currentRow >= 8 ||
                currentCol < 0 || currentCol >= 8
            ) break;

            //numericTML.push(`${currentRow}${currentCol}`);
            directionMoves.push(numericStringToString(`${currentRow}${currentCol}`));
        }
        theoreticalMoves[`d${m}`] = directionMoves;
    }

    console.log(theoreticalMoves)
    return theoreticalMoves
}


function determinePurple() {

}

function determineGold() {

}

export function getRookMoves(origin, LUT, activePlayer) {
    const originColor = activePlayer
            
    /* get theoretical moves */
    const theoreticalMoveList = moveTheoretical(origin);
    
    /* validate theoretical moves */
    const validatedMoveList = filterRays(theoreticalMoveList,LUT,originColor);

    const movesObj = makeObj(validatedMoveList);

    return movesObj
    
}