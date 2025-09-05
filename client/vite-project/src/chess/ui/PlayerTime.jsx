import { useState, useEffect, useRef } from "react";

export default function PlayerTime({ playerInfo, playerTimeRunning, activePlayer, id}) {
    const [playerTime, setPlayerTime] = useState(120);
    const [prevPlayer, setPrevPlayer] = useState("1");
    const interval = useRef(null);
    if(prevPlayer != activePlayer){
        setPrevPlayer((p) => p === "1" ? "2":"1");
        setPlayerTime(120);
    }

    useEffect(() => {
        if(playerTimeRunning){
            interval.current = setInterval(() => {
                setPlayerTime((prev)=> prev-1)
            },1000)
        }else {
            clearInterval(interval.current);
            interval.current=null;
        }
        return () => {
            clearInterval(interval.current);
            interval.current = null;
        }
        
    })

    let formattedTime = "";
    let minutes = Math.floor(playerTime / 60);
    let seconds = playerTime % 60;
    formattedTime = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

    if(activePlayer === id){
        return(
            <>
                <div className = {`pl2-row`}>
                    <div className = "pl2-username">
                        {playerInfo.playerName} : {playerInfo.playerColor}
                    </div>

                    <div className = "pl2-time">
                        {formattedTime}
                    </div>
                </div>
            </>
        )
    }else{
        return(
            <>
                <div className = {`pl2-row`}>
                    <div className = "pl2-username">
                        {playerInfo.playerName} : {playerInfo.playerColor}
                    </div>

                    <div className = "pl2-time">
                        02:00
                    </div>
                </div>
            </>
        )
    }
}

    /* 
    
    if id == 1 AND player == 1 AND playerTimeRunning == true display changing clock
    if id == 1 AND player == 2 AND playerTimeRunning == true display max time static "02:00"

    if id == 2 AND player == 2 AND playerTimeRunning == true display changing clock
    if id == 2 AND player == 1 AND playerTimeRunning == true display max time static "02:00"

    if playerTimeRunning == false stop any clock

    if (id != player )
    */