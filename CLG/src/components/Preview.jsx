import { useState, useRef } from 'react';
import './Preview.css';
import { generatePDFFromElement } from '../services/pdfService';
import { generateDOCXFromContent } from '../services/docxService';

const Preview = ({ 
  coverLetter, 
  streamingContent, 
  isGenerating, 
  error,
}) => {
  const previewContentRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingDOCX, setIsGeneratingDOCX] = useState(false);

  const handleSavePDF = async () => {
    const displayContent = streamingContent || coverLetter?.content || '';
    
    if (!displayContent) {
      alert('Please generate a cover letter first');
      return;
    }

    if (!previewContentRef.current) {
      alert('Preview content not found. Please try again.');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `cover-letter-${timestamp}.pdf`;
      
      // Generate PDF from the preview content element
      await generatePDFFromElement(previewContentRef.current, filename, {
        format: 'a4',
        orientation: 'portrait',
        margin: 20,
      });
      
      setIsGeneratingPDF(false);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert(err.message || 'Failed to generate PDF. Please try again.');
      setIsGeneratingPDF(false);
    }
  };

  const handleSaveDOCX = async () => {
    const displayContent = streamingContent || coverLetter?.content || '';
    
    if (!displayContent) {
      alert('Please generate a cover letter first');
      return;
    }

    try {
      setIsGeneratingDOCX(true);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `cover-letter-${timestamp}.docx`;
      
      // Generate DOCX from the content
      await generateDOCXFromContent(displayContent, filename, {
        includeDate: false,
        includeSignature: true,
      });
      
      setIsGeneratingDOCX(false);
    } catch (err) {
      console.error('DOCX generation error:', err);
      alert(err.message || 'Failed to generate DOCX. Please try again.');
      setIsGeneratingDOCX(false);
    }
  };

  // Show error state
  if (error) {
    return (
      <section className="preview-section">
        <div className="preview-container">
          <div className="preview-error">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Error Generating Cover Letter</h3>
            <p>{error.message || 'An error occurred while generating your cover letter. Please try again.'}</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!coverLetter && !isGenerating && !streamingContent) {
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

  // Use streaming content if available, otherwise use coverLetter content
  const displayContent = streamingContent || coverLetter?.content || '';

  return (
    <section className="preview-section">
      <div className="preview-container">
        <div className="preview-header">
          <h2>Preview</h2>
          <div className="preview-actions">
            <button 
              className="action-btn" 
              onClick={handleSaveDOCX}
              disabled={isGeneratingDOCX || !displayContent}
            >
              {isGeneratingDOCX ? (
                <>
                  <div className="mini-loader"></div>
                  Generating DOCX...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Save as DOCX
                </>
              )}
            </button>
            <button 
              className="action-btn" 
              onClick={handleSavePDF}
              disabled={isGeneratingPDF || !displayContent}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="mini-loader"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  Save as PDF
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="preview-content" ref={previewContentRef}>
          <div className="letter-body">
            {displayContent ? (
              <div className="letter-text">
                {displayContent.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < displayContent.split('\n').length - 1 && <br />}
                  </span>
                ))}
                {isGenerating && <span className="streaming-cursor">|</span>}
              </div>
            ) : (
              <div className="preview-loading">
                <div className="loader"></div>
                <h3>Generating your cover letter...</h3>
                <p>This will only take a moment</p>
              </div>
            )}
          </div>

          {displayContent && (
            <div className="letter-footer">
              <p>Sincerely,</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Preview;
