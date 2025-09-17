import Hero from "./components/Hero";
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

                <section className = "about-content-wrapper">
                    <div className = "abt-card">
                        <header className = "abt-header">
                            About This Site
                        </header>

                        <hr></hr>

                        <div className = "abt-content">
                            <p>
                                This site was created to make learning and playing chess easier for everyone, especially beginners. By adding visual cues, you can explore moves easier and see potential consequences before making a decision.
                            </p>
                            <p>
                                Our goal is to provide a place where casual players and learners can sharpen their skills and understand strategy.
                            </p>
                            <p>
                                Whether you're new to the game or brushing up, this platform gives helps you improve and most importantly, have fun!
                            </p>
                        </div>

                    </div>

                </section>
            </main>
        </>
    );
}