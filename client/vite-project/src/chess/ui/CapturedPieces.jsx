export default function CapturedPieces({playerInfo, capturedPieces}) {
    const colorFolder = playerInfo.playerColor === "white" ? "black-pieces" : "white-pieces";
    
    return(
        <>
            <div className = "pieces-captured">                
                <div className = "name-container">
                    <h3 className = "header3-type-1">
                        Pieces Captured By {playerInfo.playerName}: 
                    </h3>
                </div>
                
                <div className = "piece-image-container">
                    
                    {capturedPieces.map((piece, index) => (
                        <div
                            key = {`${playerInfo.playerColor}-${index}`}
                            className = "piece-image-wrapper"
                        >
                            <img src = {`/chess/${colorFolder}/${piece}.png`} alt={piece} loading = "lazy" />

                        </div>
                    ))}

                </div>
            </div>
        </>
    );
}