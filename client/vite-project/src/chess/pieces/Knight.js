//import Attack from "./Attack"
import { stringToNumeric, numericStringToString, filterNonRays, makeObj } from "./Utils";

/* 
    Knight
    8 possible moves

    [-2, -1]
    [-2, +1]
    
    [-1, +2]
    [+1, +2]
    
    [+2, +1]
    [+2, -1]
    
    [+1, -2]
    [-1, -2]

*/

function moveTheoretical(origin) {
    
    let theoreticalMoveList = {};

    const [row,col] = stringToNumeric(origin);

    /* upper right | + - | */
    let currentRow = row;
    let currentCol = col;

    let moveList=[
        [-2, -1], // up left
        [-2, +1], // up right
        [-1, +2], // right up
        [+1, +2], // right down
        [+2, +1], // down right
        [+2, -1], // down left
        [+1, -2], // left down
        [-1, -2] // left up
    ];

    for(let m=0; m<moveList.length; m++){
        currentRow = row;
        currentCol = col;
        let directionMoves = [];
        currentRow += moveList[m][0];
        currentCol += moveList[m][1];
        if(
            currentRow < 0 || currentRow >= 8 ||
            currentCol < 0 || currentCol >= 8
        ) continue;
        directionMoves.push(numericStringToString(`${currentRow}${currentCol}`));
        theoreticalMoveList[`d${m}`] = directionMoves;
    }
    console.log(theoreticalMoveList)

    return theoreticalMoveList;/*ex: "e5", "f6", "g7", "h8" */

}


function determinePurple() {

}

function determineGold() {

}

export function getKnightMoves(origin, LUT, activePlayer) {

    const originColor = activePlayer
        
    /* get theoretical moves */
    const theoreticalMoveList = moveTheoretical(origin);
    
    /* validate theoretical moves */
    const validatedMoveList = filterNonRays(theoreticalMoveList,LUT,originColor);

    const movesObj = makeObj(validatedMoveList);

    return movesObj
    
}