export default function TopBoardLabels() {
    const files = ["a","b","c","d","e","f","g","h"];
    const ranks = [8,7,6,5,4,3,2,1];
    return(
        <>
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
        </>
    )
}