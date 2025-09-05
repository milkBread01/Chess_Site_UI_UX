export default function BottomBoardLabels() {
    const files = ["a","b","c","d","e","f","g","h"];
    const ranks = [8,7,6,5,4,3,2,1];
    return(
        <>
            <div className = "right-labels">
                {ranks.map((rank, index) => (
                    <div
                        key = {`right-label-${index}`}
                        className = "rank">
                            {rank}
                    </div>
                ))}
            </div>
            
            <div className = "bottom-labels">
                {files.map((file, index) => (
                    <div
                        key = {`bottom-label-${index}`}
                        className="file">
                            {file}
                    </div>
                ))}
            </div>
        </>
    )
}