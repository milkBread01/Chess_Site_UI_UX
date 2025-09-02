import Hero from "./components/hero";
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

            <section className ="">
                <div>

                </div>
                <div>

                </div>
            </section>

            <section className ="">
                <div>

                </div>
                <div>
                    
                </div>
            </section>

            <section className ="">
                <div>

                </div>
                <div>
                    
                </div>
            </section>

            <section className ="">
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