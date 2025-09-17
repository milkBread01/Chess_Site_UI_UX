import Hero from "./components/Hero";
import heroImage from "../assets/hero2.jpg";
import CTA from "./components/CTA_button_section";
const heroTitle = "Learn Chess";
const heroSubtitle = "History, pieces, rules, strategy, and tactics—explained simply.";

export default function Learn() {

    return (
        <>
        <main className = "learn-main">
            <Hero
                hroImage = {heroImage}
                title = {heroTitle}
                subtitle = {heroSubtitle}
            />

            <section className ="learn-history">
                <div className="history-header">
                    <h2>Brief History</h2>
                    <p className="section-intro">
                    The history of chess can be traced back nearly 1,500 years to its earliest known predecessor, called <em>chaturanga</em>, in India; its prehistory is the subject of speculation. From India it spread to Persia, where it was modified in terms of shapes and rules and developed into shatranj. Following the Arab invasion and conquest of Persia, chess was taken up by the Muslim world and subsequently spread to Europe via Spain (Al Andalus) and Italy (Emirate of Sicily). The game evolved roughly into its current form by about 1500 CE.
                    <br></br>- Wikipedia
                    </p>
                </div>

                <div className="history-body">

                </div>
            </section>

            <section className ="learn-pieces">
                 <header className="section-header">
                    <h2>The Pieces & How They Move</h2>
                </header>

                <div className="learn-piece-container">
                    <div className = "learn-piece">
                        <h3>Pawn</h3>
                        <p>
                            Moves forward one square; from its starting square it may move two. Captures
                            one square diagonally forward. Eligible for <strong>en passant</strong> and
                            <strong> promotion</strong>.
                        </p>
                    </div>

                    <div className = "learn-piece">
                        <h3>Knight</h3>
                        <p>
                            Moves in an L-shape (2 + 1) and can <strong>jump over</strong> pieces. Controls
                            the square it lands on.
                        </p>
                    </div>

                    <div className = "learn-piece">
                        <h3>Bishop</h3>
                        <p>
                            Slides diagonally any number of squares. Each bishop stays on its starting
                            color (light or dark).
                        </p>
                        
                    </div>

                    <div className = "learn-piece">
                        <h3>Rook</h3>
                        <p>
                            Slides horizontally or vertically any number of squares. Works with the king
                            for <strong>castling</strong>.
                        </p>
                    </div>

                    <div className = "learn-piece">
                        <h3>Queen</h3>
                        <p>
                            Combines rook and bishop movement—slides any distance in any straight line.
                            The most powerful piece.
                        </p>
                    </div>

                    <div className = "learn-piece">
                        <h3>King</h3>
                        <p>
                            Moves one square in any direction. You may not move into check. Can perform
                            <strong> castling</strong> if conditions are met.
                        </p>
                    </div>

                </div>
            </section>

            <section className = "learn-color-sys">
                <header className="section-header">
                    <h2>Move Colors (Learning Assist)</h2>
                </header>
                <p>Our UI highlights legal moves and their consequences using colors:</p>

                <div className = "color-sys-info">
                    <h3>GREEN — Safe move</h3>
                    <p><strong>Meaning:</strong> Legal square that is not controlled by the opponent after the move.</p>
                    <p><strong>Why it helps:</strong> Make progress without immediate tactical risk.</p>

                    <h3>BLUE — Capture</h3>
                    <p><strong>Meaning:</strong> You can capture an enemy piece on this square and your piece is not immediately threatened afterward.</p>
                    <p><strong>Why it helps:</strong> Highlights a free capture.</p>

                    <h3>RED — Risky move</h3>
                    <p><strong>Meaning:</strong> Legal but the destination is covered by the opponent; moving here leaves your piece hanging.</p>
                    <p><strong>Why it helps:</strong> Warns you before losing a piece.</p>

                    <h3>PURPLE — Risky capture</h3>
                    <p><strong>Meaning:</strong> You can capture, but the landing square is controlled by the opponent (this is <strong>BLUE</strong> + <strong>RED</strong>).</p>
                    <p><strong>Why it helps:</strong> Shows possible but 'dangerous' tactics.</p>

                    <h3>GOLD — Check</h3>
                    <p><strong>Meaning:</strong> This move gives check to the enemy king.</p>
                    <p><strong>Why it helps:</strong> Lets you know when you will put your opponent in check</p>

                    <h4>Notes</h4>
                    <p><strong>King safety:</strong> The UI never shows moves that leave your own king in check.</p>
                    <p><strong>Pins:</strong> Illegal moves are filtered; legal moves are colored as above.</p>

                </div>
            </section>

            <CTA />
        </main>
        </>
    );
}