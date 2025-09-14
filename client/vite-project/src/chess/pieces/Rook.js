import { makeRPG } from "./Attack.js"
import { stringToNumeric, numericStringToString, filterRays, makeObj } from "./Utils.js";

/* 
    Rook
    move any number of spaces vertically or horizontally
    4 possible directions
        |   .   | +-col |
        | +-row |   .   |

*/

export function moveTheoreticalRook(origin) {
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

    //console.log(theoreticalMoves)
    return theoreticalMoves
}

export function getRookMoves(origin, LUT, activePlayer) {
    const originColor = activePlayer
            
    /* get theoretical moves */
    const theoreticalMoveList = moveTheoreticalRook(origin);
    
    /* validate theoretical moves */
    const validatedMoveList = filterRays(theoreticalMoveList,LUT,originColor);

    const objGBPAu = makeRPG(validatedMoveList, LUT, originColor, origin);

    /* const movesObj = makeObj(validatedMoveList);

    return movesObj */
    //return validatedMoveList;
    return objGBPAu
    
}