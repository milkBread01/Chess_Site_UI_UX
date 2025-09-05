export default function BeginGameButton({open, onStart}) {
    if(!open) return null;

    return(
        <>
        <div className = "begin-container" role = "dialog">
            <div className = "begin-wrapper">
                <h2>
                    Ready to Play?
                </h2>
                <p>Click to Begin Game</p>
                <button
                    className = "begin-game"
                    onClick = {onStart}
                >
                    Begin Game!
                </button>

            </div>
        </div>

        </>
    );
}