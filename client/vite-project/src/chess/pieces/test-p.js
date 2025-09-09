
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

        if(!LUT[verticalUp1]){
            valid.push(verticalUp1)
        }

        if(!LUT[verticalUp2]){
            valid.push(verticalUp2)
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

    if(originColor==="white"){
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

function main(){
    const originColor = "black"
    const origin = "d7"
/*     const theoMoves = getTheoreticalMoves() */
    const LUT = {
        "a2": {
            "id": "wp-1",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png"
        },
        "a7": {
            "id": "bp-2",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png"
        },
        "a1": {
            "id": "wr-3",
            "type": "rook",
            "color": "white",
            "img": "/chess/assets/white-rook.png"
        },
        "a8": {
            "id": "br-4",
            "type": "rook",
            "color": "black",
            "img": "/chess/assets/black-rook.png"
        },
        "b2": {
            "id": "wp-5",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png"
        },
        "b7": {
            "id": "bp-6",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png"
        },
        "b1": {
            "id": "wk-7",
            "type": "knight",
            "color": "white",
            "img": "/chess/assets/white-knight.png"
        },
        "b8": {
            "id": "bk-8",
            "type": "knight",
            "color": "black",
            "img": "/chess/assets/black-knight.png"
        },
        "c2": {
            "id": "wp-9",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png"
        },
        "c7": {
            "id": "bp-10",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png"
        },
        "c1": {
            "id": "wb-11",
            "type": "bishop",
            "color": "white",
            "img": "/chess/assets/white-bishop.png"
        },
        "c8": {
            "id": "bb-12",
            "type": "bishop",
            "color": "black",
            "img": "/chess/assets/black-bishop.png"
        },
        "d2": {
            "id": "wp-13",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png"
        },
        "d7": {
            "id": "bp-14",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png"
        },
        "d1": {
            "id": "wq-15",
            "type": "queen",
            "color": "white",
            "img": "/chess/assets/white-queen.png"
        },
        "d8": {
            "id": "bq-16",
            "type": "queen",
            "color": "black",
            "img": "/chess/assets/black-queen.png"
        },
        "e2": {
            "id": "wp-17",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png"
        },
        "e7": {
            "id": "bp-18",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png"
        },
        "e1": {
            "id": "wk-19",
            "type": "king",
            "color": "white",
            "img": "/chess/assets/white-king.png"
        },
        "e8": {
            "id": "bk-20",
            "type": "king",
            "color": "black",
            "img": "/chess/assets/black-king.png"
        },
        "f2": {
            "id": "wp-21",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png"
        },
        "f7": {
            "id": "bp-22",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png"
        },
        "f1": {
            "id": "wb-23",
            "type": "bishop",
            "color": "white",
            "img": "/chess/assets/white-bishop.png"
        },
        "f8": {
            "id": "bb-24",
            "type": "bishop",
            "color": "black",
            "img": "/chess/assets/black-bishop.png"
        },
        "g2": {
            "id": "wp-25",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png"
        },
        "g7": {
            "id": "bp-26",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png"
        },
        "g1": {
            "id": "wk-27",
            "type": "knight",
            "color": "white",
            "img": "/chess/assets/white-knight.png"
        },
        "g8": {
            "id": "bk-28",
            "type": "knight",
            "color": "black",
            "img": "/chess/assets/black-knight.png"
        },
        "h2": {
            "id": "wp-29",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png"
        },
        "h7": {
            "id": "bp-30",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png"
        },
        "h1": {
            "id": "wr-31",
            "type": "rook",
            "color": "white",
            "img": "/chess/assets/white-rook.png"
        },
        "h8": {
            "id": "br-32",
            "type": "rook",
            "color": "black",
            "img": "/chess/assets/black-rook.png"
        }
    }
    const valid = filterPawn(LUT, originColor, origin)
    console.log("VALID MOVES \n")
    console.log(valid)
}

main()

