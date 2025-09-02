import Hero from "./components/hero";
import heroImage from "../assets/hero1.jpg";

const heroTitle = "About This Site";
const heroSubtitle = "We help new chess players grasp the fundamentals with clear, UI-guided lessons and visual aids.";

export default function About() {

    return (
        <>
            <main className = "about-main">
                <Hero
                    hroImage = {heroImage}
                    title = {heroTitle}
                    subtitle = {heroSubtitle}
                />

                <section>

                </section>
            </main>
        </>
    );
}