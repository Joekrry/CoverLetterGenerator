import './Features.css';

const Features = () => {
  // Sample CV data - you can replace with actual CV images/content
  const cvs = [
    'CV 1', 'CV 2', 'CV 3', 'CV 4', 'CV 5', 'CV 6', 
    'CV 7', 'CV 8', 'CV 9', 'CV 10', 'CV 11', 'CV 12'
  ];

  return (
    <section className="features-section" id="features">
      <div className="scroll-container">
        {/* First row - scrolls left to right */}
        <div className="scroll-row scroll-left">
          <div className="scroll-content">
            {[...cvs, ...cvs, ...cvs].map((cv, index) => (
              <div key={`row1-${index}`} className="cv-card">
                {cv}
              </div>
            ))}
          </div>
        </div>

        {/* Second row - scrolls right to left */}
        <div className="scroll-row scroll-right">
          <div className="scroll-content">
            {[...cvs, ...cvs, ...cvs].map((cv, index) => (
              <div key={`row2-${index}`} className="cv-card">
                {cv}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
