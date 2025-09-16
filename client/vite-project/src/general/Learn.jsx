import Hero from "./components/Hero";
import heroImage from "../assets/hero2.jpg";
import CTA from "./components/CTA_button_section";
const heroTitle = "Learn Chess";
const heroSubtitle = "History, pieces, rules, strategy, and tactics—explained simply.";

export default function Learn() {

    return (
        <>
        <main className = "learn-main">
            <Hero
                hroImage = {heroImage}
                title = {heroTitle}
                subtitle = {heroSubtitle}
            />

            <section className ="learn-history">
                <div className="history-header">
                    <h2></h2>
                </div>

                <div className="history-body">

                </div>
            </section>

            <section className ="learn-pieces">
                <div className="">

                </div>
                <div className="">
                    
                </div>
            </section>

            <section className ="learn-specail-cases">
                <div>

                </div>
                <div>
                    
                </div>
            </section>

            <section className ="learn-strategy">
                <div>

                </div>
                <div>
                    
                </div>
            </section>

            <CTA />
        </main>
        </>
    );
}