import { useState, useEffect, useRef } from "react";


export default function PlayerTime({
    playerInfo,
    playerTimeRunning,
    activePlayer,
    id,
    advanceTurn,
    playerTimePerTurn
}) {
    const PT = playerTimePerTurn || 300;
    const [playerTime, setPlayerTime] = useState(PT);
    const intervalRef = useRef(null);
    const isRunning = playerTimeRunning && activePlayer === id;

    // Reset timer to default when turn changes
    useEffect(() => {
        // Reset this player's time when it becomes their turn
        if (activePlayer === id) {
            setPlayerTime(PT);
        }
    }, [activePlayer, id]);

    // start/stop the ticking interval based on isRunning
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
        setPlayerTime((prev) => {
            if (prev <= 1) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setTimeout(() => {
                advanceTurn();
                }, 0);
                return 0;
            }
            return prev - 1;
        });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, advanceTurn]);

    const minutes = String(Math.floor(playerTime / 60)).padStart(2, "0");
    const seconds = String(playerTime % 60).padStart(2, "0");

    return (
        <div className="pl2-row">
            <div className="pl2-username">
                {playerInfo.playerName} : {playerInfo.playerColor}
            </div>
            <div className="pl2-time">
                {minutes}:{seconds}
            </div>
        </div>
    );
}