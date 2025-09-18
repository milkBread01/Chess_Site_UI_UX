import { useEffect } from 'react';
import TopBoardLabels from './TopBoardLabels';
import BottomBoardLabels from './BottomBoardLabels';

export default function Board({
        pieces, // LUT 
        onSquareClick, // grid click handle event  
        selectedSquare, // Selected grid position
        highlights  // piece Highlights

    }) {

    const files = ["a","b","c","d","e","f","g","h"];
    const ranks = [8,7,6,5,4,3,2,1];

    return(
        <>
            <div className = "chess-board-container">
                <div className="board-wrapper">
                    <TopBoardLabels />

                    <div className="board">
                        {ranks.map((rank, i) =>
                            files.map((file, j) => {
                                /* 
                                create 'current squaare' from nested loop
                                look for piece in current square usign LUT
                                create default color (alternating)
                                search highlights for current piece 
                                assign color to grid spot based on highlight or default to default color
                                is selected?
                                craete html
                                 */
                                const currentSquare = `${file}${rank}`;
                                const currentPiece = pieces?.[currentSquare];
                                const defaultColor = (i+j) % 2 === 1 ? "light" : "dark";

                                const highlightColor = highlights[currentSquare];
                                const colorClass = highlightColor ? `color-${highlightColor}` : defaultColor;

                                const isSelected = selectedSquare === currentSquare ? "is-selected" : "";

                                return(
                                    <div
                                        key = {currentSquare}
                                        className = {`grid-square ${colorClass} ${isSelected}`}
                                        data-square = {currentSquare}
                                        onClick = {() => onSquareClick?.(currentSquare)}
                                    >
                                        
                                        {currentPiece && (
                                            <img
                                                src = {currentPiece.img}
                                                alt = {currentPiece.type}
                                            />
                                        )}
                                        <span className = "coord">
                                            {currentSquare}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    
                    <BottomBoardLabels />
                </div>    
            </div>
            
        </>
    );
}