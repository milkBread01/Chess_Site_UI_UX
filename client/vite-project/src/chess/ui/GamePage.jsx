import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../general/UserContext"

import GamePeripheralsMenu from "./GamePeripheralsMenu";
import Board from "./Board";
import CapturedPieces from "./CapturedPieces";
/* Manages total time and player time */
import BeginGameButton from "./BeginGameButton";
import MoveHistory from './MoveHistory';
import GameMenu from './GameMenu';


import { executeCastlingMove } from '../pieces/CastlingUtils';
import { isCastlingMove } from '../pieces/CastlingUtils';

import { isInCheck } from '../pieces/CheckCheck';
import { getGameStatus } from '../pieces/CheckCheck';
import { getLegalMovesForPiece } from '../pieces/CheckCheck';

import { stringToNumeric } from '../pieces/Utils';
import PromotionMenu from './PromotionMenu';

const API_BASE = import.meta.env.VITE_API_URL || "";

let uid = 0;
const basePath = "/chess/assets/";

function makePiece(color, type, file, rank) {
    uid +=1;
    return{
        id:`${color[0]}${type[0]}-${uid}`,
        type,
        color,
        img: `${basePath}${color}-${type}.png`,
        moves:0,
        location: `${file}${rank}`
    }

}

function handleInitPos() {
    const files = ["a","b","c","d","e","f","g","h"];
    /* pieces in order */
    const pieceOrder = ["rook","knight","bishop","queen","king","bishop","knight","rook"];
    const pos = {};

    files.map((file, index) => {
        pos[`${file}2`] = makePiece("white", "pawn", file, "2");
        pos[`${file}7`] = makePiece("black", "pawn", file, "7");
        
        pos[`${file}1`] = makePiece("white", pieceOrder[index], file, "1");
        pos[`${file}8`] = makePiece("black", pieceOrder[index], file, "8");
    })
    console.log(`=====================================================`)
    console.log(pos)
    console.log(`=====================================================`)
    return pos;

}


export default function GamePage() {

    const navigate = useNavigate();
    const { state } = useLocation();
    const { guestName, timePerTurn, loggedInColor } = state?.gameInfo || 
    {guestName: "Guest", timePerTurn: 300, loggedInColor: "white"};
    const guestColor = loggedInColor === "white" ? "black" : "white";

    const [showStart, setShowStart] = useState(true);
    const [showMenu, setShowMenu] = useState(true);

    const [gameStartTime, setGameStartTime] = useState(null);
    
    const [pendingPromotion, setPendingPromotion] = useState(null);
    let showPromotionMenu = !!pendingPromotion;

    const [menuChoice, setMenuChoice] = useState(null);
    const { user } = useContext(UserContext);
    const player1Name = user?.username;

    const [chessBoard, setChessBoard] = useState(null); /* LUT for pieces */
    const [selected, setSelected] = useState(null); /* contains grid pos of selected piece */
    const [highlights, setHighlights] = useState({}); /* contains highlights */
    const [moveHistory, setMoveHistory] = useState([]); /* contains move history */

    const[player1PiecesCaptured, setPlayer1PiecesCaptured] = useState([]);
    const[player2PiecesCaptured, setPlayer2PiecesCaptured] = useState([]);
    
    const [gameStatus, setGameStatus] = useState({
        inCheck: false,
        checkmate: false,
        stalemate: false,
        gameOver: false
    });

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
        //console.log(choice)

        if(choice === "resume"){
            console.log(showMenu)
            /* setShowMenu((prev) => !prev); */
            handleToggleGameTime()
        }else if(choice === "restart"){

        }else if(choice === "assist"){

        }else{ /* quit */
            navigate("/play");

        }
        //console.log(showMenu)
    }

    function handlePromotion(pieceType){
        if(!pendingPromotion) {
            console.log("No pending promotion found");
            return;
        }

        const {square, color} = pendingPromotion;

        setChessBoard((prev) =>{
            const currentState = {...prev};
            if (!currentState[square]) return prev

            const imgPath = `/chess/${color}-pieces/${pieceType}.png`;
            currentState[square] = {
                ...currentState[square],
                type: pieceType,
                img: imgPath
            }
            return currentState
        })

        setPendingPromotion(null)

        // check if promotion puts enemy in check
        setTimeout(() => {
            setChessBoard((prev) => {
                const opponent = color === "white" ? "black" : "white";
                const opponentInCheck = isInCheck(prev, opponent);
                //setIsCheck(opponentInCheck ? opponent : null);
                return prev; // Don't modify board, just check status
            });

            // End turn after promotion is complete
            endTurn("promotion");
        }, 0);

    }
    
    const player1Info = {
        playerName: player1Name || "Player 1",
        playerColor: loggedInColor,

    };

    const player2Info = {
        playerName: guestName,
        playerColor: guestColor,

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

            setGameStartTime(Date.now());
        }
    }

    function makeMove(from, to) {
        /* 
            From: "h2"
            To:   "h4"
        */

        // Check if move legal
        const piece = chessBoard[from];
        if (!piece) return;
        
        const legalMoves = getLegalMovesForPiece(piece, from, chessBoard, moveHistory);
        if (!legalMoves[to]) {
            console.log("Illegal move: would leave king in check");
            return;
        }

        let gameStates = {
            capturedType: null,
            capturerColor: null,
            opponentInCheck: false,
            historyEntry: null,
            promotion: null,
            castling: false
        };
        console.log(chessBoard)

        setChessBoard(prev => {
            
              
            const LUT = { ...prev };
            
            const movingPiece = LUT[from]; // get from piece info
            if(!movingPiece) return prev; // if no piece there, ignore

            // Check if this is a castling move
            if (isCastlingMove(from, to, movingPiece)) {
                gameStates.castling = true;
                const newLUT = executeCastlingMove(from, to, LUT);
                
                gameStates.historyEntry = {
                    piece: newLUT[to],
                    from,
                    to,
                    castling: true,
                    castlingType: (to === "g1" || to === "g8") ? "kingside" : "queenside"
                };
                
                return newLUT;
            }

            const target = LUT[to] || null
            const capturerColor = movingPiece.color
            const opponent = capturerColor === "white" ? "black" : "white";

            // Capture if destination occupied by opponent
            if( target && target.color !== capturerColor) {
                gameStates.capturedType = target.type;   // set captured to piece type and color
                gameStates.capturerColor = capturerColor;
            }

            LUT[to] = {
                ...movingPiece,
                location: to,
                moves: (movingPiece.moves ?? 0) + 1
            };

            //console.log("LUT")
            //console.log(LUT[to])
            //console.log("TO")
            //console.log(to)
            delete LUT[from];
            console.log("updated")
            console.log(LUT)

            // Check Promotion
            console.log("???????????? IS IT PROMOTION ???????????? ")
            if (isPromotion(movingPiece, to)){
                console.log("PROMOTION TRUE")
                gameStates.promotion = {
                    square: to,
                    color: movingPiece.color
                }
                console.log("Setting promotion state:", gameStates.promotion);
            }

            if (!gameStates.promotion) {
                gameStates.opponentInCheck = isInCheck(LUT, opponent);
            }

            gameStates.historyEntry = {
                piece: LUT[to],
                from,
                to,
            };
            //console.log(gameStates.historyEntry)

            return LUT;
        })

        // update gameStates AFTER the board is updated
        if(gameStates.historyEntry) {
            setMoveHistory(h => [...h, gameStates.historyEntry]);
            console.log(moveHistory)
        }

        if(gameStates.capturedType) {
            // if piece captured append to list
            const { capturedType, capturerColor } = gameStates;
            if (capturerColor === "white") {
                setPlayer1PiecesCaptured(prev => [...prev, capturedType]);
            } else {
                setPlayer2PiecesCaptured(prev => [...prev, capturedType]);
            }
        }
        //console.log(chessBoard)

        if(gameStates.promotion) {
            //console.log("============================== SETTING PROMOTION ==============================")
            //console.log('GameStates Promotion: ',gameStates.promotion)
            setPendingPromotion(gameStates.promotion)
            //console.log('PMS: ',showPromotionMenu)
            return;
        }

        // change turn
        endTurn(gameStates.castling ? "castling" : "move");
    }

    function isPromotion(piece, to){
        if ( piece.type !=="pawn") return false;

        const RC = stringToNumeric(to);
        if (piece.color === "white" && RC[0] ===0){
            return true;
        }
        if (piece.color === "black" && RC[0] ===7){
            return true;
        }
        return false;
    }

    function endTurn(reason){
        advanceTurn()
    }

    function advanceTurn(){
        setActivePlayer((p) => (p === "white" ? "black" : "white"));
    };

    function handleSquareClick(square) {
        if (!chessBoard) return; 

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

    // check game status
    useEffect(() => {
        if( !chessBoard) return
        const status = getGameStatus(chessBoard, activePlayer);
        setGameStatus(status);

        //setIsCheck(status.inCheck)

        if (status.checkmate) {
            alert(`Checkmate! ${activePlayer} loses.`)
            saveGame2DB("checkmate", winner)
            
        } else if (status.stalemate) {
            alert("Stalemate! Game is a draw.")
            saveGame2DB("stalemate")

        } else if (status.inCheck) {
            alert(`${activePlayer} is in check!`);

        }

    }, [chessBoard, activePlayer])

    // piece selected
    useEffect(()=>{
        if(!selected){
            setHighlights({})
            return
        }
        const piece = chessBoard[selected];
        //console.log("++++++++++++++++++++++++++++ piece ++++++++++++++++++++++++++++")
        //console.log(piece)
        //console.log(`PIECE: ${piece.type}`)
        //console.log(`FROM: ${selected}`)
        if(!piece){
            setHighlights({})
            return
        }
        let gridTargets = getGridColors(piece,selected,chessBoard);
        //console.log(gridTargets)

        setHighlights(gridTargets)
        //console.log(gridTargets)
    }, [selected,chessBoard])

    function getGridColors(piece,origin ,LUT) {
        return getLegalMovesForPiece(piece, origin, LUT);
    }
    
    async function saveGame2DB(gameResult, winner = null ) {
        if(!user?.accountId){
            console.log("No User logged in");
            return;
        }

        try {
            const currentTime = Date.now();
            const gameEndTime = gameStartTime ? (currentTime - gameStartTime) / 1000 : 0;

            const isPlayerWhite = loggedInColor === "white";

            let playerResult, userTime, opponentTime;

            if(gameResult === "stalemate"){
                playerResult = "stalemate";
            }else{
                const playerWon = (isPlayerWhite && winner === "white") || (!isPlayerWhite && winner === "black");
                playerResult = playerWon ? "win" : "loss";
            }

            const numMoves = Math.ceil(moveHistory.length / 2);

            const historyData = {
                account_owner_id: user.accountId,
                white_player_name: isPlayerWhite ? player1Name : guestName,
                black_player_name: isPlayerWhite ? guestName : player1Name,
                game_result: gameResult === "stalemate" ? "stalemate" : 
                           winner === "white" ? "white_win" : "black_win",
                moves: JSON.stringify({
                    initial_board: handleInitPos(),
                    move_history: numMoves,
                    final_board: chessBoard
                })
            }

            const historyResponse = await fetch(`${API_BASE}api/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(historyData)
            });

            if (!historyResponse.ok) {
                console.error('Failed to save game history');
                return;
            }

            // Update user records
            const recordData = {
                account_id: user.accountId,
                matchResults: playerResult,
                matchTime: gameEndTime,
                numMoves: numMoves
            };

            const recordResponse = await fetch(`${API_BASE}api/records`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(recordData)
            });

            if (!recordResponse.ok) {
                console.error('Failed to update user records');
                return;
            }

            console.log('Game saved successfully to database');


        }catch(error) {
            console.error('Error saving game: ',error)
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
                        advanceTurn = {endTurn}
                        playerTime = {timePerTurn}
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

                <PromotionMenu
                    showPromotionMenu={showPromotionMenu}
                    activeColor ={pendingPromotion?.color ?? activePlayer}
                    onPieceSelect={handlePromotion}
                />
                
            </main>
        </>
    );
}