export default function MoveHistory({history }) {
    return(
        <div className = "move-container">
            <div className = "move-header-container">
                <h2>
                    Move History
                </h2>
            </div>

            <div className = "move-history">
                {history.length === 0 ? (<p> No Moves Yet</p>) :

                (history.map((move, index) => (
                    <h4 key = {index}>
                        {`${move.piece.type[0].toUpperCase() + move.piece.type.slice(1)} (${move.piece.id}) FROM ${move.from} TO ${move.to}`}

                    </h4>
                ))
                )}
            </div>
        </div>
    );
}