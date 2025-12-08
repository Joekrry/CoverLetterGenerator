import './Hero.css';
import heroImage from '../assets/CVtemplate.png';

const Hero = () => {
  const scrollToGenerator = () => {
    const generatorSection = document.getElementById('generate');
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Free Professional Cover Letters to make life easier
          </h1>
          <p className="hero-description">
            Simplify your job application process, you don't need the extra work
          </p>
          <div className="hero-cta">
            <button className="cta-button primary" onClick={scrollToGenerator}>
              Get Started
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-placeholder">
            <img src={heroImage} alt="Cover Letter Template" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
