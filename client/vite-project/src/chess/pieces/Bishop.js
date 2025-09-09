//import Attack from "./Attack"
import { stringToNumeric, numericStringToString, filterRays, makeObj } from "./Utils";
/* 
    a1: {
        "id": "wr-3",
        "type": "rook",
        "color": "white",
        "img": "/chess/assets/white-rook.png"
    },
    b1: {
        "id": "wk-7",
        "type": "knight",
        "color": "white",
        "img": "/chess/assets/white-knight.png"
    }
*/

/* 

givin origin, search for theoretical spaces first, return list of potential move spots

given list of theoretical move spots, search LUT to determine if theoretical move is valid

for each validated move spot, loop through list treating each value as origin; attack origin from all possible places then compare to LUT to determine if enemy piece is able to kill the origin piece

 */

/* 
    BISHOP
    move diagonal from origin in 4 directions
        | + row | + col |
        | + row | - col |
        | - row | - col |
        | - row | + col |

    max limits
        upper
        row < 0 || col > 8

        lower
        row > 8 || col < 0
*/

function moveTheoretical(origin) {
    let theoreticalMoveList = {};

    const [row,col] = stringToNumeric(origin);

    /* upper right | + - | */
    let currentRow = row;
    let currentCol = col;
    const movesList = [
        [-1, -1], /* upper left */
        [-1, +1], /* upper right */
        [+1, +1], /* lower right */
        [+1, -1]  /* lower left */
    ]
    
    for(let m=0; m<movesList.length; m++){
        currentRow = row;
        currentCol = col;
        let directionMoves = [];
        while(true){
            currentRow += movesList[m][0];
            currentCol += movesList[m][1];
            if(
                currentRow < 0 || currentRow >= 8 ||
                currentCol < 0 || currentCol >= 8
            ) break;
            directionMoves.push(numericStringToString(`${currentRow}${currentCol}`));
        }
        theoreticalMoveList[`d${m}`] = directionMoves;
    }
    console.log(theoreticalMoveList)
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

export function getBishopMoves(origin, LUT, activePlayer){

    const originColor = activePlayer /* STRING: "white" */
    /* origin | STRING : "h4" */
    /* LUT | OBJ |  */

    /* get theoretical moves */
    const theoreticalMoveList = moveTheoretical(origin);
    
    /* validate theoretical moves */
    const validatedMoveList = filterRays(theoreticalMoveList,LUT,originColor);

    const movesObj = makeObj(validatedMoveList);

    return movesObj
}

