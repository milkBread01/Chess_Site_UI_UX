import { useState } from "react";
import Hero from "../../general/components/Hero";
import heroImage from "../../assets/hero3.jpg";
import StartGamePop from "./StartGamePop";
const heroTitle = "Play Chess";
const heroSubtitle = "Jump into a game! Play local PvP or challenge our AI.";

export default function PlayDash() {
    const [ showStartGameForm, setShowStartGameForm ] = useState(false);
    const [ formData, setFormData] = useState(null);
    
    function handleStart() {
        setShowStartGameForm((p) => !p)
    }
    return (
        <>
            <main className = "play-dash-main">
                <Hero
                    hroImage = {heroImage}
                    title = {heroTitle}
                    subtitle = {heroSubtitle}
                />

                <section className = "play-dash-menu">
                    <div className = "header-container">
                        <h2 className = "header2-type3">
                            Play Chess
                        </h2>
                    </div>

                    <div className = "play-dash-button-container">
                        <button 
                            className = "button-type-2"
                            onClick = { handleStart}
                        >
                            Player vs Player (local)
                        </button>

                        <button className = "button-type-2">
                            Player vs AI 
                        </button>
                    </div>
                </section>
                <StartGamePop
                    showForm={showStartGameForm} 
                />
                
            </main>
        </>
    );
}