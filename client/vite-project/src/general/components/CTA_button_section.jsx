import { useNavigate } from "react-router-dom";

export default function CTA() {
    const navigate = useNavigate();    
    return (
        <>
            <section className = "cta-section">
                <div className = "header2-type3">
                    <h2 className = "cta-header">
                        Start Playing Chess
                    </h2>
                </div>
                <div className = "cta-button-container">
                    <button className = "button-type2" onClick={() => navigate("/play")}>
                        Play Game
                    </button>
                </div>
            </section>
        </>
    );

}