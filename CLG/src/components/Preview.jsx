import './Preview.css';

const Preview = ({ coverLetter, isGenerating }) => {
  const formatDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-GB', options);
  };

  const handleSavePDF = () => {
    //Call API to generate PDF
    console.log('Save as PDF - Backend integration needed');
    alert('PDF export will be implemented by the backend API');
  };

  const handleSaveDOCX = () => {
    //Call API to generate DOCX
    console.log('Save as DOCX - Backend integration needed');
    alert('DOCX export will be implemented by the backend API');
  };

  if (!coverLetter && !isGenerating) {
    return (
      <section className="preview-section">
        <div className="preview-container">
          <div className="preview-empty">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="30" width="80" height="60" rx="4" fill="#f0f4ff" stroke="#1a73e8" strokeWidth="2"/>
              <line x1="30" y1="45" x2="70" y2="45" stroke="#1a73e8" strokeWidth="2"/>
              <line x1="30" y1="55" x2="90" y2="55" stroke="#cbd5e1" strokeWidth="1.5"/>
              <line x1="30" y1="62" x2="90" y2="62" stroke="#cbd5e1" strokeWidth="1.5"/>
              <line x1="30" y1="69" x2="75" y2="69" stroke="#cbd5e1" strokeWidth="1.5"/>
            </svg>
            <h3>Your cover letter will appear here</h3>
            <p>Fill out the form and click &quot;Generate Cover Letter&quot; to see your personalized cover letter</p>
          </div>
        </div>
      </section>
    );
  }

  if (isGenerating) {
    return (
      <section className="preview-section">
        <div className="preview-container">
          <div className="preview-loading">
            <div className="loader"></div>
            <h3>Generating your cover letter...</h3>
            <p>This will only take a moment</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="preview-section">
      <div className="preview-container">
        <div className="preview-header">
          <h2>Preview</h2>
          <div className="preview-actions">
            <button className="action-btn" onClick={handleSaveDOCX}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Save as DOCX
            </button>
            <button className="action-btn" onClick={handleSavePDF}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              Save as PDF
            </button>
          </div>
        </div>
        
        <div className="preview-content">
          <div className="letter-header">
            {coverLetter.personalInfo && (
              <div className="sender-info">
                <p className="name">{coverLetter.personalInfo.fullName}</p>
                {coverLetter.personalInfo.address && <p>{coverLetter.personalInfo.address}</p>}
                {coverLetter.personalInfo.email && <p>{coverLetter.personalInfo.email}</p>}
                {coverLetter.personalInfo.phone && <p>{coverLetter.personalInfo.phone}</p>}
              </div>
            )}
            
            <p className="date">{formatDate()}</p>
            
            {coverLetter.jobDetails && (
              <div className="recipient-info">
                {coverLetter.jobDetails.hiringManager && (
                  <p className="recipient-name">{coverLetter.jobDetails.hiringManager}</p>
                )}
                <p className="company-name">{coverLetter.jobDetails.companyName}</p>
              </div>
            )}
          </div>

          <div className="letter-body">
            {coverLetter.content && (
              <div className="letter-text" dangerouslySetInnerHTML={{ __html: coverLetter.content.replace(/\n/g, '<br/>') }} />
            )}
          </div>

          <div className="letter-footer">
            <p>Sincerely,</p>
            <p className="signature">{coverLetter.personalInfo?.fullName}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
