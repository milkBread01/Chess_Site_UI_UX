import PlayerTime from "./PlayerTime";
import { useState, useEffect } from "react";
import TotalTime from './TotalTime';

export default function GamePeripheralsMenu({
    player1Info, 
    player2Info, 
    gameTimeRunning,/* boolean is clock on */  
    onToggleMenu, 
    activePlayer, /* active player white or black*/
    playerTimeRunning,
    advanceTurn,
    playerTime
}) {

    const perTurn = playerTime || 300; // default to 120 seconds if not provided
    return(
        <>
            <div className = "peripherals-wrapper">
                <div className = "peripherals-layer-1">    
                    <div className = "game-total-time-container">
                        <TotalTime
                            gameTimeRunning={gameTimeRunning}
                        />
                    </div>
                </div>

                <div className = "peripherals-layer-2">

                    <div className = "pl2-section">
                        <PlayerTime
                            playerInfo = {player1Info}
                            playerTimeRunning={playerTimeRunning}
                            activePlayer = {activePlayer}
                            id = "white"
                            advanceTurn={advanceTurn}
                            playerTimePerTurn = {perTurn}
                        />
                    </div>

                    <div className = "pl2-section">
                        <div className = "game-menu-wrapper"
                            onClick = {onToggleMenu}
                        >
                            <h2 
                                className = "game-menu-label">
                                Menu
                            </h2> 
                        </div>
                    </div>

                    <div className = "pl2-section">
                        <PlayerTime
                            playerInfo = {player2Info}
                            playerTimeRunning={playerTimeRunning}
                            activePlayer = {activePlayer}
                            id = "black"
                            advanceTurn={advanceTurn}
                            playerTimePerTurn = {perTurn}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}