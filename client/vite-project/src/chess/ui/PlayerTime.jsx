export default function PlayerTime({ playerInfo, time}) {
    return(
        <>
            <div className = {`pl2-row ${playerInfo.isActive ? "active-player" : ""}`}>
                <div className = "pl2-username">
                    {playerInfo.playerName} : {playerInfo.playerColor}
                </div>

                <div className = "pl2-time">
                    {time}
                </div>
            </div>
        </>
    );
}