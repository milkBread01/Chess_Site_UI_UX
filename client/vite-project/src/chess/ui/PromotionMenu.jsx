
export default function PromotionMenu({ showPromotionMenu, activeColor, onPieceSelect}) {
    if ( !showPromotionMenu ) return null
    const cardNames = ["rook", "knight", "bishop", "queen"];
    const cardImagePath = activeColor === "white" ? "/chess/white-pieces/" : "/chess/black-pieces/";

    return(
        <>
            <div className = "promotion-overlay" role="dialog" aria-modal="true">
                <section className = "promotion-menu-container">
                    {cardNames.map((piece,i) =>{
                        let fullPath = `${cardImagePath}${piece}.png`;
                        return(
                            <div 
                            className = "pm-card"
                            key = {`pm-${piece}-${i}`}
                            onClick = {() => onPieceSelect(piece)}
                            >
                                <div className = "pm-img-container">
                                    <img src = {fullPath} alt = {piece}/>
                                </div>
                                <div className = "pm-header">
                                    {piece}
                                </div>
                            </div>
                        )
                    })}
                </section>
            </div>
        </>
    )
}