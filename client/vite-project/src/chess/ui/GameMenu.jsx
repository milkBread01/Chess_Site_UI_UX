export default function GameMenu({showMenu, onMenuPress}) {
    if (showMenu) return null;
    return(
        <>
            <div className = "game-menu">
                <div className = "menu-wrapper">
                    <div className = "menu-header">
                        <h2>
                            Game Menu
                        </h2>
                    </div>

                    <div className = "menu-btn-container">
                        <button className = "menu-btn green2"
                            onClick = {() => onMenuPress("resume")}
                        >
                            Resume
                        </button>
                        <button className = "menu-btn orange"
                            onClick = {() =>onMenuPress("restart")}
                        >
                            Restart
                        </button>
                        <button className = "menu-btn yellow"
                            onClick = {() =>onMenuPress("assist")}
                        >
                            Toggle Assist
                        </button>
                        <button className = "menu-btn red"
                            onClick = {() =>onMenuPress("quit")}
                        >
                            Quit
                        </button>
                    </div>
                </div>
                
            </div>
        </>
    );
}