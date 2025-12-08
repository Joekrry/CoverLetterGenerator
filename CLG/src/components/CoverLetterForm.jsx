import { useState } from 'react';
import './CoverLetterForm.css';

const CoverLetterForm = ({ onGenerate, isGenerating }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    address: '',
    
    // Job Details
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    
    // Additional Context
    skills: '',
    experience: '',
    jobDescription: '',
  });

  const [uploadedCV, setUploadedCV] = useState(null);
  const [isProcessingCV, setIsProcessingCV] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedCV(file);
    setIsProcessingCV(true);

    try {
      console.log('CV uploaded:', file.name);
      alert('CV parsing will be implemented by the backend API. The form will be auto-filled with extracted information.');
    } catch (error) {
      console.error('Error processing CV:', error);
      alert('Failed to process CV. Please fill in the form manually.');
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
    onGenerate(formData);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      jobTitle: '',
      companyName: '',
      hiringManager: '',
      skills: '',
      experience: '',
      jobDescription: '',
    });
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
            <h3 className="section-title">Quick Start - Upload Your CV</h3>
            <p className="section-description">Upload your CV to automatically fill in your details</p>
            
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

          {/* Personal Information Section */}
          <div className="form-section-group">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.name@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+44 123 456 7890"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>
          <div className="form-section-group">
            <h3 className="section-title">Job Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="jobTitle">Job Title *</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company123"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="hiringManager">Hiring Manager Name (if known)</label>
                <input
                  type="text"
                  id="hiringManager"
                  name="hiringManager"
                  value={formData.hiringManager}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                />
              </div>
            </div>
          </div>

          <div className="form-section-group">
            <h3 className="section-title">Additional Context</h3>
            
            <div className="form-group">
              <label htmlFor="skills">Key Skills *</label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="List your relevant skills (e.g., JavaScript, React, Node.js, Problem Solving)"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Relevant Experience</label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Briefly describe your relevant work experience and achievements"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobDescription">Job Description *</label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Paste the job description here to help tailor your cover letter"
                rows="5"
              />
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
