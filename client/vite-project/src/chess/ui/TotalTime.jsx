import { useState, useEffect, useRef } from "react";


export default function TotalTime({gameTimeRunning}) {

    const [cumulativeTime, setCumulativeTime] = useState(0);

    const intervalRef = useRef(null);

    useEffect(() => {


        if ( gameTimeRunning ){
            intervalRef.current = setInterval(() => {
                setCumulativeTime((prev) => prev+1)
            },1000)
        }else{
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };

    }, [gameTimeRunning])

    let formattedTime = "";
    let minutes = Math.floor(cumulativeTime / 60);
    let seconds = cumulativeTime % 60;

    formattedTime = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;


    return (
        <h2 className = "game-total-time-text">
            {cumulativeTime ? formattedTime : "00:00"}
        </h2>
    )
}