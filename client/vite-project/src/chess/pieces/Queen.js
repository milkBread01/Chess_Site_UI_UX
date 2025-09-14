import { makeRPG } from "./Attack.js"
import { stringToNumeric, numericStringToString, filterRays, makeObj } from "./Utils.js";

export function moveTheoreticalQueen(origin) {
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
    //console.log(theoreticalMoveList)
    return theoreticalMoveList;
    /* 
{
    d0: [ 'c5', 'b6', 'a7' ],
    d1: [ 'd5', 'd6', 'd7', 'd8' ],
    d2: [ 'e5', 'f6', 'g7', 'h8' ],
    d3: [ 'e4', 'f4', 'g4', 'h4' ],
    d4: [ 'e3', 'f2', 'g1' ],
    d5: [ 'd3', 'd2', 'd1' ],
    d6: [ 'c3', 'b2', 'a1' ],
    d7: [ 'c4', 'b4', 'a4' ]
} 
*/

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
    const theoreticalMoveList = moveTheoreticalQueen(origin);
    
    /* validate theoretical moves
        returns type:
        { a1: 'green', b1: 'green', c1: 'blue' }
    */
    const validatedMoveList = filterRays(theoreticalMoveList, LUT, originColor);

    const objGBPAu = makeRPG(validatedMoveList, LUT, originColor, origin);

    /* const movesObj = makeObj(validatedMoveList);

    return movesObj */
    //return validatedMoveList;
    return objGBPAu
    
    
}