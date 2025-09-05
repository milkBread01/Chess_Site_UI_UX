import { useState, useEffect  } from 'react';
import { useNavigate } from "react-router-dom";

import GamePeripheralsMenu from "./GamePeripheralsMenu";
import Board from "./Board";
import CapturedPieces from "./capturedPieces";
/* Manuges total time and player time */
import BeginGameButton from "./BeginGameButton";
import MoveHistory from './MoveHistory';
import GameMenu from './GameMenu';



let uid = 0;
/* \public\chess\assets\white-bishop.png */
const basePath = "/chess/assets/";

function makePiece(color, type) {
    uid +=1;
    return{
        id:`${color[0]}${type[0]}-${uid}`,
        type,
        color,
        img: `${basePath}${color}-${type}.png`
    }

}

function handleInitPos() {
    const files = ["a","b","c","d","e","f","g","h"];
    const pieceOrder = ["rook","knight","bishop","queen","king","bishop","knight","rook"];
    const pos = {};

    files.map((file, index) => {
        pos[`${file}2`] = makePiece("white", "pawn");
        pos[`${file}7`] = makePiece("black", "pawn");
        
        pos[`${file}1`] = makePiece("white", pieceOrder[index]);
        pos[`${file}8`] = makePiece("black", pieceOrder[index]);
    })
    console.log(pos)
    return pos;

}


export default function GamePage() {

    const navigate = useNavigate();

    const [showStart, setShowStart] = useState(true);
    const [showMenu, setShowMenu] = useState(true);
    const [menuChoice, setMenuChoice] = useState(null);

    const [chessBoard, setChessBoard] = useState(null); /* LUT for pieces */
    const [selected, setSelected] = useState(null); /* contains grid pos of selected grid */
    const [highlights, setHighlights] = useState({}); /* contains highlights */
    const [moveHistory, setMoveHistory] = useState([]); /* contains move history */

    const[player1Pieces, setPlayer1Pieces] = useState([]);
    const[player2Pieces, setPlayer2Pieces] = useState([]);
    
    const [gameOver, setGameOver] = useState(false);

    const [activePlayer, setActivePlayer] = useState("1");/* 1 or 2 */

    const [playerTimeRunning, setPlayerTimeRunning] = useState(false);
    const [gameTimeRunning, setGameTimeRunning] = useState(false);

    function handleToggleGameTime() {
        setGameTimeRunning((prev)=> !prev);
        setShowMenu((prev) => !prev);
        setPlayerTimeRunning((prev) => !prev)
    }

    function handleMenuPress(choice) {
        setMenuChoice(choice);
        console.log(choice)

        if(choice === "resume"){
            console.log(showMenu)
            /* setShowMenu((prev) => !prev); */
            handleToggleGameTime()
        }else if(choice === "restart"){

        }else if(choice === "assist"){

        }else{ /* quit */
            navigate("/play");

        }
        console.log(showMenu)
    }
    
    const player1Info = {
        playerName: "Player 1",
        playerColor: "white",

    };

    const piecesCapturedByPlayer1 = ["Pawn", "Rook"];

    const player2Info = {
        playerName: "Player 2",
        playerColor: "black",

    };

    const piecesCapturedByPlayer2 = ["Bishop", "Queen", "Pawn"];

    function handleBeginGame() {
        if (chessBoard === null){
            uid = 0;
            
            /* start board */
            setChessBoard(handleInitPos());
            setShowStart(false);

            /* begin time */
            setGameTimeRunning(true);
            setPlayerTimeRunning((prev)=>!prev)

        }
    }

    function makeMove(from, to) {
        setChessBoard((prev) => {
            const next = {...prev};
            const piece  = next[from];
            
            const entry = { piece, from, to };
            setMoveHistory((his) => [
                ...his, entry
            ]);

            console.log(
                `${piece.type[0].toUpperCase() + piece.type.slice(1)} (${piece.id}) FROM ${from} TO ${to}`
            );

            next[to] = next[from];
            delete next[from];
            return next;
        })
        endTurn("move")
    }

    function endTurn(reason){
        advanceTurn()
    }
    function advanceTurn(){
        setActivePlayer((p) => p === "1" ? "2":"1")
        
    }

    function timerExpired(){
        endTurn("timout")
    }

    function handleSquareClick(square) {
        if (!chessBoard) return; 

        // if nothing selected & there is a piece, select it
        if (!selected && chessBoard[square]) {
            console.log(selected)
            setSelected(square);
            return;
        }

        // if selected → move piece to target (no legality check)
        if (selected) {
            console.log(selected)
            makeMove(selected, square)
            setSelected(null);
        }
    }

    useEffect(()=>{
        if(!selected){
            setHighlights({})
            return
        }
        const piece = chessBoard[selected];
        if(!piece){
            setHighlights({})
            return
        }
        const gridTargets = getGridColors(piece,selected,chessBoard);

        setHighlights(gridTargets)
        console.log(gridTargets)
    }, [selected,chessBoard])

    function getGridColors() {
        let list = {
            e4: "green",
            d4: "red",
            f4: "gold",
            e5: "blue"
        };

        return list
    }
    

    return(
        <>
            <main className = "game-main">
                <section className = "game-peripherals-container">
                    <GamePeripheralsMenu 
                        
                            player1Info = {player1Info}
                            player2Info = {player2Info}
                            gameTimeRunning = {gameTimeRunning}
                            onToggleMenu = {handleToggleGameTime}
                            activePlayer={activePlayer}
                            playerTimeRunning={playerTimeRunning}

                    />
                </section>

                <section className = "game-container">
                    <div className = "board-container">
                        <CapturedPieces
                            playerInfo = {player1Info}
                            capturedPieces = {piecesCapturedByPlayer1}
                        />

                        <Board 
                            pieces = {chessBoard}
                            onSquareClick = {handleSquareClick}
                            selectedSquare = {selected}
                            highlights={highlights}
                        
                        />

                        <CapturedPieces
                            playerInfo = {player2Info}
                            capturedPieces = {piecesCapturedByPlayer2}
                        />
                    </div>

                    <MoveHistory 
                        history={moveHistory} 
                    />
                    
                </section>

                <BeginGameButton 
                    open = {showStart}
                    onStart = {handleBeginGame}
                />

                <GameMenu 
                    showMenu={showMenu}
                    onMenuPress={handleMenuPress}
                />
            </main>
        </>
    );
}