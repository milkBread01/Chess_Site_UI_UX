import GamePeripheralsMenu from "./GamePeripheralsMenu";
import Board from "./Board";
import CapturedPieces from "./capturedPieces";

export default function GamePage() {
    const player1Info = {
        playerName: "Player 1",
        playerColor: "white",
        isActive: true
    };
    const player1Time = "02:00";

    const piecesCapturedByPlayer1 = ["Pawn", "Rook"];

    const player2Info = {
        playerName: "Player 2",
        playerColor: "black",
        isActive: false
    };
    const player2Time = "00:00";

    const piecesCapturedByPlayer2 = ["Bishop", "Queen", "Pawn"];

    return(
        <>
            <main className = "game-main">
                <section className = "game-peripherals-container">
                    <GamePeripheralsMenu 
                        
                            player1Info = {player1Info}
                            player1Time = {player1Time}
                            player2Info = {player2Info}
                            player2Time = {player2Time}
                    />
                </section>

                <section className = "game-container">
                    <div className = "board-container">
                        <CapturedPieces
                            playerInfo = {player1Info}
                            capturedPieces = {piecesCapturedByPlayer1}
                        />

                        <Board />

                        <CapturedPieces
                            playerInfo = {player2Info}
                            capturedPieces = {piecesCapturedByPlayer2}
                        />
                    </div>

                    <div className = "move-container">
                        <div className = "move-header-container">
                            <h2 className = "">

                            </h2>
                        </div>

                        <div className = "">
                            
                        </div>
                    </div>
                    
                </section>
            </main>
        </>
    );
}