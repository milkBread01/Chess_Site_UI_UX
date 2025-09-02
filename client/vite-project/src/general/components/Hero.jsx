export default function Hero({ hroImage, title, subtitle }) {
  return (
    <section
        className="hero"
        style={{ backgroundImage: `url(${hroImage})` }}
    >
        <div className="hero-overlay">
            <h1 className="hero-title">{title}</h1>
            <h3 className="hero-subtitle">{subtitle}</h3>
        </div>
    </section>
  );
}