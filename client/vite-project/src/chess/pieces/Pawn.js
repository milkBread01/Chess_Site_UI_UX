//import Attack from "./Attack"
import { stringToNumeric, numericStringToString, filterPawn, makeObj } from "./Utils";

/* 
    1) Determine Color
    2) Determin board location (if at starting row, allowed two spaces vertical else allowed 1)
        a) if white move only in - ROW
        b) if black move only in + ROW
    3) Determine if there are diagonal pieces from the actual origin, if yes then can move piece

*/
function moveTheoretical(origin, originColor) {
    let theoreticalMoveList = {};

    const [row,col] = stringToNumeric(origin);

    /* upper right | + - | */
    let currentRow = row;
    let currentCol = col;

    const moveList = originColor === "white" ? [
        [-1, 0],  // up 1
        [-2, 0],  // up 2
        [-1, -1], // up left
        [-1, +1]  // up right
    ] : [
        [+1, 0],  // down 1
        [+2, 0],  // down 2
        [+1, -1], // down left
        [+1, +1]  // down right
    ];
    for (let m = 0; m < moveList.length; m++) {
        currentRow = row;
        currentCol = col;
        currentRow += moveList[m][0];
        currentCol += moveList[m][1];
        let directionMoves = [];
        if (
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

export function getPawnMoves(origin, LUT, activePlayer) {
    const originColor = activePlayer
    
    /* validate theoretical moves */
    const validatedMoveList = filterPawn(LUT,originColor, origin);

    const movesObj = makeObj(validatedMoveList);

    return movesObj
    
}