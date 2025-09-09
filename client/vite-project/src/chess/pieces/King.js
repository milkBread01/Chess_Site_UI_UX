//import Attack from "./Attack"
import { stringToNumeric, numericStringToString, filterNonRays, makeObj } from "./Utils";
/* 
    KING
    move 1 space all directions
    8 possible directions
        |   .   | +-col |
        | +-row |   .   |
        | + row | + col |
        | + row | - col |
        | - row | - col |
        | - row | + col |

*/
function moveTheoretical(origin) {

    /* get row col from string grid pos */
    let theoreticalMoveList = {};

    const [row,col] = stringToNumeric(origin);

    /* Search Up/down && L/R */
    const moveList = [
        [-1,-1],  // up left
        [-1,0],  // up
        [-1,+1],  // up right
        [0,+1],  // right
        [+1,+1],  // down right
        [+1,0],  // down
        [+1,-1],  // down left
        [0,-1]   // left
    ];

    for (let m = 0; m < moveList.length; m++) {
        let currentRow = row;
        let currentCol = col;
        let directionMoves = [];
        currentRow += moveList[m][0];
        currentCol += moveList[m][1];
        if (
            currentRow < 0 || currentRow >= 8 ||
            currentCol < 0 || currentCol >= 8
        ) continue;
        directionMoves.push(numericStringToString(`${currentRow}${currentCol}`));
        theoreticalMoveList[`d${m}`] = directionMoves;
    }
    console.log(theoreticalMoveList)
    return theoreticalMoveList


}

function determinePurple() {

}

function determineGold() {

}

export function getKingMoves(origin, LUT, activePlayer) {

    const originColor = activePlayer
    
    const theoreticalMoveList = moveTheoretical(origin);
    
    const validatedMoveList = filterNonRays(theoreticalMoveList,LUT,originColor);

    const movesObj = makeObj(validatedMoveList);
    
    return movesObj
    
}

