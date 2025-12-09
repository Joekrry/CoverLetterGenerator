import { useState } from 'react';
import './CoverLetterForm.css';

const CoverLetterForm = ({ onGenerate, isGenerating }) => {
  const [formData, setFormData] = useState({
    // Required fields
    jobRequirements: '', // Job description and requirements
    humanScale: 7, // Default to 7/10 (balanced professional and conversational)
    
    // Optional fields
    optionalInfo: '', // Additional information for the AI
  });

  const [uploadedCV, setUploadedCV] = useState(null);
  const [isProcessingCV, setIsProcessingCV] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'range' ? parseInt(value, 10) : value
    }));
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedCV(file);
    setIsProcessingCV(true);

    try {
      console.log('CV uploaded:', file.name);
      // CV will be sent to backend API when form is submitted
    } catch (error) {
      console.error('Error processing CV:', error);
      alert('Failed to process CV. Please try again.');
    } finally {
      setIsProcessingCV(false);
    }
  };

  const handleRemoveCV = () => {
    setUploadedCV(null);
    document.getElementById('cvUpload').value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Include the uploaded CV file in the form data
    onGenerate({
      ...formData,
      uploadedCV: uploadedCV, // Include the file object
    });
  };

  const handleReset = () => {
    setFormData({
      jobRequirements: '',
      humanScale: 7,
      optionalInfo: '',
    });
    setUploadedCV(null);
    document.getElementById('cvUpload').value = '';
  };

  return (
    <section className="form-section" id="generate">
      <div className="form-container">
        <div className="form-header">
          <h2>Generate Your Cover Letter</h2>
          <p>Fill in the details below to create a personalized cover letter</p>
        </div>

        <form className="cover-letter-form" onSubmit={handleSubmit}>
          {/* CV Upload Section */}
          <div className="form-section-group cv-upload-section">
            <h3 className="section-title">Upload Your CV (Optional)</h3>
            <p className="section-description">Upload your CV to help personalize your cover letter</p>
            
            <div className="cv-upload-container">
              <input
                type="file"
                id="cvUpload"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
                style={{ display: 'none' }}
                disabled={isProcessingCV}
              />
              
              {!uploadedCV ? (
                <label htmlFor="cvUpload" className="cv-upload-label">
                  <i className="fas fa-cloud-arrow-up" style={{ fontSize: '48px' }}></i>
                  <span className="upload-text">
                    {isProcessingCV ? 'Processing CV...' : 'Click to upload your CV'}
                  </span>
                  <span className="upload-hint">Supports PDF, DOC, DOCX</span>
                </label>
              ) : (
                <div className="cv-uploaded">
                  <i className="fas fa-file-alt" style={{ fontSize: '24px' }}></i>
                  <span className="cv-filename">{uploadedCV.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveCV}
                    className="cv-remove-btn"
                    aria-label="Remove CV"
                  >
                    <i className="fas fa-times" style={{ fontSize: '20px' }}></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Job Requirements Section */}
          <div className="form-section-group">
            <h3 className="section-title">Job Requirements</h3>
            <p className="section-description">
              Paste the job description and requirements here
            </p>
            <div className="form-group">
              <label htmlFor="jobRequirements">Job Description & Requirements *</label>
              <textarea
                id="jobRequirements"
                name="jobRequirements"
                value={formData.jobRequirements}
                onChange={handleChange}
                placeholder="Paste the complete job description, requirements, and any relevant details here..."
                rows="8"
                required
              />
            </div>
          </div>

          {/* Optional Information Section */}
          <div className="form-section-group">
            <h3 className="section-title">Additional Information (Optional)</h3>
            <p className="section-description">
              Add any extra context that might help personalize your cover letter
            </p>
            <div className="form-group">
              <label htmlFor="optionalInfo">Additional Information</label>
              <textarea
                id="optionalInfo"
                name="optionalInfo"
                value={formData.optionalInfo}
                onChange={handleChange}
                placeholder="E.g., specific achievements, why you're interested in this role, relevant projects, etc."
                rows="4"
              />
            </div>
          </div>

          {/* Writing Style Section */}
          <div className="form-section-group writing-style-section">
            <h3 className="section-title">Writing Style</h3>
            <p className="section-description">
              Adjust the tone to match your preferred writing style
            </p>
            
            <div className="style-slider-container">
              <div className="style-slider-labels">
                <span className="style-label">
                  <i className="fas fa-robot"></i>
                  AI-Assisted & Formal
                </span>
                <span className="style-label">
                  <i className="fas fa-hand-sparkles"></i>
                  Natural & Conversational
                </span>
              </div>
              
              <div className="style-slider-wrapper">
                <div className="style-slider-track">
                  <div 
                    className="style-slider-fill-left"
                    style={{ width: `${((formData.humanScale - 1) / 9) * 100}%` }}
                  ></div>
                  <div 
                    className="style-slider-fill-right"
                    style={{ width: `${((10 - formData.humanScale) / 9) * 100}%`, left: `${((formData.humanScale - 1) / 9) * 100}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  id="humanScale"
                  name="humanScale"
                  min="1"
                  max="10"
                  step="1"
                  value={formData.humanScale}
                  onChange={handleChange}
                  className="style-slider"
                />
                <div 
                  className="style-slider-value"
                  style={{ left: `${((formData.humanScale - 1) / 9) * 100}%` }}
                >
                  {formData.humanScale}/10
                </div>
              </div>
              
              <div className="style-description">
                {formData.humanScale >= 8 ? (
                  <span className="style-hint">
                    <i className="fas fa-hand-sparkles"></i>
                    Very natural, conversational, human-sounding tone
                  </span>
                ) : formData.humanScale >= 4 ? (
                  <span className="style-hint">
                    <i className="fas fa-balance-scale"></i>
                    Balanced professional and conversational
                  </span>
                ) : (
                  <span className="style-hint">
                    <i className="fas fa-robot"></i>
                    More polished, professional, AI-assisted tone
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleReset}
              disabled={isGenerating}
            >
              Reset Form
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CoverLetterForm;
