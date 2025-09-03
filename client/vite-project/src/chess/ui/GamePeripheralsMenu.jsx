import PlayerTime from "./PlayerTime";

export default function GamePeripheralsMenu({player1Info, player1Time, player2Info, player2Time}) {

    return(
        <>
            <div className = "peripherals-wrapper">
                <div className = "peripherals-layer-1">    
                    <div className = "game-total-time-container">
                        <h2 className = "game-total-time-text">
                            00:00
                        </h2>
                    </div>
                </div>

                <div className = "peripherals-layer-2">

                    <div className = "pl2-section">
                        <PlayerTime
                            playerInfo = {player1Info}
                            time = {player1Time}
                        />
                    </div>

                    <div className = "pl2-section">
                        <div className = "game-menu-wrapper">
                            <h2 className = "game-menu-label">
                                Menu
                            </h2> 
                        </div>
                    </div>

                    <div className = "pl2-section">
                        <PlayerTime
                            playerInfo = {player2Info}
                            time = {player2Time}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}