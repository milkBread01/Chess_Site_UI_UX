import CTA from "./components/CTA_button_section";

export default function Home() {
    const cardNames = ["pawn", "rook", "knight", "bishop", "queen", "king"];
    const cardDescriptions = [
            "Moves forward one square, or two on first move. Captures diagonally forward.",
            "Moves horizontally and vertically any number of squares. Cannot jump over pieces.",
            "Moves in an L-shape: two squares in one direction, then one square perpendicular.",
            "Moves diagonally any number of squares. Cannot jump over pieces.",
            "Most powerful piece. Combines rook and bishop moves - any direction, any distance.",
            "Most important piece. Moves one square in any direction. Must be protected at all costs."
        ];
    const cardImagePath = "/chess/black-pieces/";
    
    return (
        <>
            <main className="home-main">
                <section className = "home-hero-container">
                    <div className = "video-container">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload = "auto"
                            className = "video-background"
                            >
                            <source src = "/videos/home-hero.mp4" type = "video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        <div className = "video-overlay-content">
                            <h1 className = "header1">
                                Chess
                            </h1>

                            <div className = "home-button-container">
                                <a className="button-type-1" href="/play">Play Chess</a>
                                <a className="button-type-1" href="/learn">Learn More</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className = "home-learn-container">
                    <div className = "header-container">
                        <h2 className = "header2">
                            Learn the Pieces
                        </h2>
                    </div>

                    <div className = "cards-container">
                        {cardNames.map((val, i) => {
                            const fullImgPath = `${cardImagePath}${val}.png`; 
                            return (
                                <div className = "card-wrapper" key={val}>
                                    <div className = "card-image-container">
                                        <img src = {fullImgPath} alt={val} />
                                        <div>{cardDescriptions[i]}</div>
                                    </div>
                                    <div className = "card-header-container">{val}</div>
                                </div>
                            );
                        })}
                    </div>
                    <button className = "button-type-1">
                        Learn More
                    </button>
                </section>

                <section className = "home-about">

                    <div className = "header-section">
                        <div className = "header-container">
                            <h2 className = "header2-type2">
                                About this Site
                            </h2>
                        </div>
                    </div>

                    <div className = "content-section content-section-light">
                        <div className = "section-container">
                            <div className = "image-container">
                                <img src = "#" alt="Chess Learning" className = "section-image" />
                            </div>

                            <div className = "description-container">
                                <div className = "description-content">
                                    <h2 className = "description-title">
                                        Learn Chess Fundamentals
                                    </h2>
                                    
                                    <p className = "description-text">
                                        Master the basics of chess with our comprehensive learning system. From understanding how each piece moves to developing strategic thinking, our interactive lessons guide you through every step of your chess journey.
                                    </p>

                                    <p className = "description-text">
                                        Whether you're a complete beginner or looking to refresh your knowledge, our structured approach makes learning chess both engaging and effective.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className = "content-section content-section-medium">
                        <div className = "section-container reverse">
                            <div className = "image-container">
                                <img src = "#" alt = "Chess Strategy" className = "section-image" />
                            </div>

                            <div className = "description-container">
                                <div className = "description-content">
                                    <h2 className = "description-title">
                                        Advanced Strategy & Tactics
                                    </h2>
                                    
                                    <p className = "description-text">
                                        Elevate your game with advanced chess strategies and tactical patterns. Learn opening principles, middle game planning, and endgame techniques that separate novice players from experienced competitors.
                                    </p>

                                    <p className = "description-text">
                                        Practice with real game scenarios and develop the analytical skills needed to think several moves ahead and outmaneuver your opponents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </section>

                <CTA />
            </main>
        </>
    );
}