import { useState } from "react";

export default function StartGamePop({showForm}) {
    if(!showForm) return null

    const [formData, setFormData] = useState({
        guestName: "",
        minutes: "",
        seconds: "",
        loggedInColor: "",
    });

    function handleInputChange(e) {
        const { key, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [key]: value
        }))
    }

    return(
        <>
            <div className = "sg-overlay" role="dialog">
                <section className = "start-game-container">
                    <form className = "sg-form">
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
                                        name="color"
                                        value="white"
                                        required
                                    />
                                    White
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="color"
                                        value="black" 
                                    />
                                    Black
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="color"
                                        value="random"
                                    />
                                    Random
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
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