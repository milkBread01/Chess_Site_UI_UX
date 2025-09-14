import { makeRPG } from "./Attack.js"
import { stringToNumeric, numericStringToString, filterNonRays, makeObj } from "./Utils.js";
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
export function isKingAttacking(origin){

    /* get row col from string grid pos */
    let theoreticalMoveList = {};

    const [row,col] = stringToNumeric(origin);

    const moveList = [
        [-2,-2], // up left
        [-2,-1], // ULR
        [-2,0],
        [-2,+1], // ULR
        [-2,+2], // up right
        [-1,+2], // RUR
        [0,+2],
        [+1,+2], // RDR
        [+2,+2], // down right
        [+2,+1], // DLR
        [+2,0],
        [+2,-1], // DLR
        [+2,-2], // down left
        [+1,-2], // LDR
        [0,-2],
        [-1,-2]  // LUR
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
        ) continue; /* skip invalid moves */
        directionMoves.push(numericStringToString(`${currentRow}${currentCol}`));
        theoreticalMoveList[`d${m}`] = directionMoves;
    }
    //console.log(theoreticalMoveList)
    return theoreticalMoveList
}

export function moveTheoreticalKing(origin) {

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

export function getKingMoves(origin, LUT, activePlayer) {

    const originColor = activePlayer
    
    const theoreticalMoveList = moveTheoreticalKing(origin);
    
    const validatedMoveList = filterNonRays(theoreticalMoveList,LUT,originColor);

    const objGBPAu = makeRPG(validatedMoveList, LUT, originColor, origin);

    /* const movesObj = makeObj(validatedMoveList);

    return movesObj */
    //return validatedMoveList;
    return objGBPAu
    
}

