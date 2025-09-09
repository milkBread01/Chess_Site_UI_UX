import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

import GamePeripheralsMenu from "./GamePeripheralsMenu";
import Board from "./Board";
import CapturedPieces from "./capturedPieces";
/* Manuges total time and player time */
import BeginGameButton from "./BeginGameButton";
import MoveHistory from './MoveHistory';
import GameMenu from './GameMenu';

import { getPawnMoves } from "../pieces/Pawn";
import { getBishopMoves } from "../pieces/Bishop";
import { getRookMoves } from "../pieces/Rook";
import { getQueenMoves } from "../pieces/Queen";
import { getKnightMoves } from "../pieces/Knight";
import { getKingMoves } from "../pieces/King";


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
    /* pieces in order */
    const pieceOrder = ["rook","knight","bishop","queen","king","bishop","knight","rook"];
    const pos = {};

    files.map((file, index) => {
        pos[`${file}2`] = makePiece("white", "pawn");
        pos[`${file}7`] = makePiece("black", "pawn");
        
        pos[`${file}1`] = makePiece("white", pieceOrder[index]);
        pos[`${file}8`] = makePiece("black", pieceOrder[index]);
    })
    console.log(`=====================================================`)
    console.log(pos)
    console.log(`=====================================================`)
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

    const[player1PiecesCaptured, setPlayer1PiecesCaptured] = useState([]);
    const[player2PiecesCaptured, setPlayer2PiecesCaptured] = useState([]);
    
    const [gameOver, setGameOver] = useState(false);
    const [isCheck, setIsCheck] = useState(false)

    const [activePlayer, setActivePlayer] = useState("white");

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

    const player2Info = {
        playerName: "Player 2",
        playerColor: "black",

    };

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

        let gameStates = {
            capturedType: null,
            capturerColor: null,
            opponentInCheck: false,
            historyEntry: null,
        };

        setChessBoard(prev => {
            const next = { ...prev };

            const moving = next[from];
            if(!moving) return prev; // if no piece there, ignore

            const target = next[to] || null;
            const capturerColor = moving.color;
            const opponent = capturerColor === "white" ? "black" : "white";

            // Capture if destination occupied by opponent
            if( target && target.color !== capturerColor) {
                gameStates.capturedType = target.type;   // set captured to piece type and color
                gameStates.capturerColor = capturerColor;
            }

            next[to] = { ...moving, location: to, moves: (moving.moves ?? 0) + 1 };
            delete next[from];

            gameStates.historyEntry = {
                piece: next[to],
                from,
                to,
            };

            return next;
        });

        // update gameStates AFTER the board is updated
        if (gameStates.historyEntry) {
            setMoveHistory(h => [...h, gameStates.historyEntry]);
        }

        if (gameStates.capturedType) {
            // if piece captured append to list
            const { capturedType, capturerColor } = gameStates;
            if (capturerColor === "white") {
                setPlayer1PiecesCaptured(prev => [...prev, capturedType]);
            } else {
                setPlayer2PiecesCaptured(prev => [...prev, capturedType]);
            }
        }

        setIsCheck(gameStates.opponentInCheck ? (activePlayer === "white" ? "black" : "white") : null);

        // change turn
        endTurn("move");
    }
    function isKingInCheck(board, color) {

    }

    function findKing(board, color) {

    }

    function isPromoted(){

    }

    function showPromotionMenu(){

    }

    function endTurn(reason){
        advanceTurn()
    }

    function scanBoard(){

    }

    function cloneBoard(){

    }

    const advanceTurn = useCallback(() => {
        setActivePlayer((p) => (p === "white" ? "black" : "white"));
    }, []);

    function timerExpired(){
        endTurn("timout")
    }

    function handleSquareClick(square) {
        if (!chessBoard) return; 

        /* // if nothing selected & there is a piece, select it
        if (!selected && chessBoard[square]) {
            setSelected(square);
            return;
        }

        // if selected → move piece to target (no legality check)
        if (selected) {
            console.log(`HSC SELECTED: ${selected}`)
            makeMove(selected, square)
            setSelected(null);
        } */

        const pieceAtSquare = chessBoard[square];

        // only allow inputs from own pieces
        if(!selected){
            if (!pieceAtSquare ) return;
            if (pieceAtSquare.color !== activePlayer) return
            setSelected(square)
            return;
        }

        // toggle square if selected
        if(square === selected){
            setSelected(null);
            setHighlights({});
            return;
        }

        if(highlights[(square)]){
            makeMove(selected,square)
            setSelected(null);
            setHighlights({});
            return
        }
        setSelected(null);
        setHighlights({});
    }

    useEffect(()=>{
        if(!selected){
            setHighlights({})
            return
        }
        const piece = chessBoard[selected];
        console.log(`PIECE: ${piece.type}`)
        console.log(`FROM: ${selected}`)
        if(!piece){
            setHighlights({})
            return
        }
        const gridTargets = getGridColors(piece,selected,chessBoard);
        console.log(gridTargets)

        setHighlights(gridTargets)
        console.log(gridTargets)
    }, [selected,chessBoard])

    function getGridColors(piece,origin ,LUT) {
        
        switch (piece.type) {
            case "pawn":
                return getPawnMoves(origin, LUT, piece.color);
            case "bishop":
                return getBishopMoves(origin, LUT, piece.color);
            case "rook":
                return getRookMoves(origin, LUT, piece.color);
            case "queen":
                return getQueenMoves(origin, LUT, piece.color);
            case "knight":
                return getKnightMoves(origin, LUT, piece.color);
            case "king":
                return getKingMoves(origin, LUT, piece.color);
            default:
                return {};
        }
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
                        advanceTurn = {advanceTurn}
                    />

                </section>

                <section className = "game-container">
                    <div className = "board-container">
                        <CapturedPieces
                            playerInfo = {player1Info}
                            capturedPieces = {player1PiecesCaptured}
                        />

                        <Board 
                            pieces = {chessBoard}
                            onSquareClick = {handleSquareClick}
                            selectedSquare = {selected}
                            highlights={highlights}
                        
                        />

                        <CapturedPieces
                            playerInfo = {player2Info}
                            capturedPieces = {player2PiecesCaptured}
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