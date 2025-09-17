/* Store the game information and pass to GamePage */

import { useNavigate } from "react-router-dom";
import { createContext, useState } from "react";

export default function StartGamePop({showForm}) {
    if(!showForm) return null;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        guestName: "",
        minutes: "",
        seconds: "",
        loggedInColor: "",
    });

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault();
        const min = Number(formData.minutes);
        const sec = Number(formData.seconds);

        const gameInfo = {
            guestName: formData.guestName,
            timePerTurn: min * 60 + sec,
            loggedInColor: formData.loggedInColor
        };
        // Navigate to the game page with form data
        navigate('/game', { state: { gameInfo } });

    }

    return(
        <>
            <div className = "sg-overlay" role="dialog">
                <section className = "start-game-container">
                    <form className = "sg-form" onSubmit={handleSubmit}>
                        <h2>Start New Game</h2>
                        <div className="form-group">

                            <label>Guest Player Name</label>
                            <input
                                type="text"
                                id="guestName"
                                name="guestName"
                                placeholder="Enter guest name"
                                value = {formData.guestName}
                                onChange = {handleInputChange}
                                required
                            />
                        </div>

                        {/* Time Allowed per Turn */}
                        <div className="form-group">
                            <label>Time Allowed per Turn</label>
                            <div className="time-inputs">
                                <input
                                    type="number"
                                    name="minutes"
                                    min="0"
                                    placeholder="Min"
                                    value = {formData.minutes}
                                    onChange = {handleInputChange}
                                    required
                                />
                                <span>:</span>
                                <input
                                    type="number"
                                    name="seconds"
                                    min="0"
                                    max="59"
                                    placeholder="Sec"
                                    value = {formData.seconds}
                                    onChange = {handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Player Color */}
                        <div className="form-group">
                            <label>What color will Player 1 be?</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="loggedInColor"
                                        value="white"                                        
                                        required
                                        checked={formData.loggedInColor === "white"}
                                        onChange={handleInputChange}
                                    />
                                    White
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="loggedInColor"
                                        value="black"
                                        checked={formData.loggedInColor === "black"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    Black
                                </label>

                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="sg-submit">
                                Start Game
                            </button>
                        </div>
                    </form>
                </section>
            </div>

        </>
    );

}