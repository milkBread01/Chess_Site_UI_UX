 function stringToNumeric(stringNotation) {
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
function numericStringToString(numericString){

    const row = Number(numericString[0])
    const col = Number(numericString[1])

    const file = String.fromCharCode("a".charCodeAt(0) + col);
    const rank = 8 - row;

    return `${file}${rank}`;

}
function getTheoreticalMoves(){
    let theoreticalMoves = {};
    console.log("get theo moves")
    let origin = "d4"
    
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
// buckets: { d0: ['c5','b6',...], d1: [...], ... } nearest->farthest
// LUT: { "a2": {color: "white", ...}, ... }
// originColor: "white" | "black"

function filterRayBuckets(theoreticalMoves, LUT, originColor) {
    const valid = [];
    
    for (const dirKey in theoreticalMoves) {
        const ray = theoreticalMoves[dirKey];
        for (const sq of ray) {
          const occ = LUT[sq];
        
            if (!occ) {
                // empty → keep and continue scanning this direction
                valid.push(sq);
                continue;
            }
        
            if (occ.color !== originColor) {
                // enemy → capture square allowed, then stop scanning this direction
                valid.push(sq);
            }
            // friendly OR enemy both block further squares
            break;
        }
    }
    
    return valid;
}

function main(){
    console.log("MAIN\n")
    const buckets = getTheoreticalMoves();
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
};
    const originColor = "white"
    const validatedMoves = filterRayBuckets(buckets, LUT, originColor)
    console.log("Validated Moves\n")
    console.log(validatedMoves)
}

main()
