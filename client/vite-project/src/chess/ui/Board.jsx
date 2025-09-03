import { useEffect } from 'react';

export default function Board() {
    const filePath = "../assets/";
    const files = ["a","b","c","d","e","f","g","h"];
    const ranks = [8,7,6,5,4,3,2,1];

    return(
        <>
            <div className = "chess-board-container">
                <div className="board-wrapper">
                    <div className="top-labels">
                        {files.map((file, index) => (
                            <div
                                key={`top-label-${index}`}
                                className="file">
                                    {file}
                            </div>
                        ))}
                    </div>

                    <div className="left-labels">
                        {ranks.map((rank, index) => (
                            <div
                                key={`left-label-${index}`}
                                className="rank">
                                    {rank}
                            </div>
                        ))}
                    </div>

                    <div className="board">
                        {ranks.map((rank, i) =>
                            files.map((file, j) => (
                                <div
                                    key={`${rank}-${file}`}
                                    className={`grid-square ${(i + j) % 2 === 1 ? "light" : "dark"}`}
                                    data-square={`${file}${rank}`}
                                >
                                    <span className="coord">{file}{rank}</span>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="right-labels">
                        {ranks.map((rank, index) => (
                            <div
                                key={`right-label-${index}`}
                                className="rank">
                                    {rank}
                            </div>
                        ))}
                    </div>
                    
                    <div className="bottom-labels">
                        {files.map((file, index) => (
                            <div
                                key={`bottom-label-${index}`}
                                className="file">
                                    {file}
                            </div>
                        ))}
                    </div>
                </div>    
            </div>
            
        </>
    );
}