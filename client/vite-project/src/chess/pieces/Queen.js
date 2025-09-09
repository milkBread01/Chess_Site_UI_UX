//import Attack from "./Attack"
import { stringToNumeric, numericStringToString, filterRays, makeObj } from "./Utils";

function moveTheoretical(origin) {
    let theoreticalMoveList = {};
    let numericTML = [];

    const [row,col] = stringToNumeric(origin);

    /* Search Up/down && L/R */
    let currentRow = row;
    let currentCol = col;
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
        currentRow = row;
        currentCol = col;
        let directionMoves = [];
        while (true) {
            currentRow += moveList[m][0];
            currentCol += moveList[m][1];
            if (
                currentRow < 0 || currentRow >= 8 ||
                currentCol < 0 || currentCol >= 8
            ) break;
            directionMoves.push(numericStringToString(`${currentRow}${currentCol}`));
        }
        theoreticalMoveList[`d${m}`] = directionMoves;
    }
    console.log(theoreticalMoveList)
    return theoreticalMoveList;/*ex: "e5", "f6", "g7", "h8" */

}


function determinePurple() {

}

function determineGold() {

}

/* function makeObj(validList){
    const obj = squares.reduce((acc, key) => {
        acc[key] = "green";
        return acc;
    }, {});

    return obj;
} */

export function getQueenMoves(origin, LUT, activePlayer) {

    const originColor = activePlayer
                
    /* get theoretical moves */
    const theoreticalMoveList = moveTheoretical(origin);
    
    /* validate theoretical moves */
    const validatedMoveList = filterRays(theoreticalMoveList, LUT, originColor);

    const movesObj = makeObj(validatedMoveList);

    return movesObj
    
    
}