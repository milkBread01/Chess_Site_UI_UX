
export default function Footer() {
    return (
        <footer className = "footer">
            <div className = "footer-container">

                <div className = "footer-image-section">
                    <img src="/logo.jpg" alt="Chess Board" className = "footer-image"/>
                </div>

                <div className = "footer-links-section">
                    <h3 className = "footer-header">Site Links</h3>
                    <ul className = "footer-links">
                        <li className = "footer-link-item">
                            <a href = "/" className = "footer-link">Home</a>
                        </li>
                        
                        <li className = "footer-link-item">
                            <a href = "/about" className = "footer-link">About</a>
                        </li>

                        <li className = "footer-link-item">
                            <a href="/learn" className = "footer-link">Learn More</a>
                        </li>

                        <li className = "footer-link-item">
                            <a href="/play" className = "footer-link">Play Chess</a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}