import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './CoverLettersModal.css';
import { getCoverLetters, downloadPDF, getCoverLetterById } from '../services/coverLetterService';
import { authService } from '../services/authService';

const CoverLettersModal = ({ isOpen, onClose, onViewLetter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [limit] = useState(20);
  const [skip, setSkip] = useState(0);

  // Fetch cover letters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['coverLetters', skip, limit],
    queryFn: async () => {
      const accessToken = authService.getAccessToken();
      if (!accessToken) throw new Error('Not authenticated');
      return await getCoverLetters(accessToken, limit, skip);
    },
    enabled: isOpen,
    staleTime: 30000,
  });

  const handleDownloadPDF = async (coverLetterId, e) => {
    e.stopPropagation();
    try {
      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        alert('Please log in to download PDFs');
        return;
      }
      await downloadPDF(coverLetterId, accessToken);
    } catch (err) {
      console.error('PDF download error:', err);
      alert(err.message || 'Failed to download PDF. Please try again.');
    }
  };

  const handleViewLetter = async (coverLetterId) => {
    try {
      const accessToken = authService.getAccessToken();
      const response = await getCoverLetterById(coverLetterId, accessToken);
      if (onViewLetter) {
        onViewLetter(response.cover_letter);
      }
      onClose();
    } catch (err) {
      console.error('Error fetching cover letter:', err);
      alert('Failed to load cover letter. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPreviewText = (jobRequirements) => {
    if (!jobRequirements) return 'No job requirements';
    const preview = jobRequirements.substring(0, 100);
    return preview.length < jobRequirements.length ? `${preview}...` : preview;
  };

  // Filter cover letters by search term
  const filteredLetters = data?.cover_letters?.filter(letter =>
    letter.job_requirements?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalCount = data?.count || 0;
  const hasMore = skip + limit < totalCount;

  if (!isOpen) return null;

  return (
    <div className="cover-letters-modal-overlay" onClick={onClose}>
      <div className="cover-letters-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>My Cover Letters</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-content">
          {/* Search Bar */}
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search cover letters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="modal-loading">
              <div className="modal-loader"></div>
              <p>Loading cover letters...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="modal-error">
              <p>Failed to load cover letters</p>
              <button onClick={() => refetch()} className="retry-btn">
                Retry
              </button>
            </div>
          )}

          {/* Cover Letters List */}
          {!isLoading && !error && (
            <>
              {filteredLetters.length > 0 ? (
                <>
                  <div className="letters-grid">
                    {filteredLetters.map((letter) => (
                      <div key={letter.id} className="letter-card">
                        <div className="letter-card-header">
                          <span className="letter-date">{formatDate(letter.created_at)}</span>
                          {letter.pdf_status === 'completed' && (
                            <span className="pdf-badge">
                              <i className="fas fa-check-circle"></i> PDF Ready
                            </span>
                          )}
                          {letter.pdf_status === 'pending' && (
                            <span className="pdf-badge pending">
                              <i className="fas fa-clock"></i> PDF Pending
                            </span>
                          )}
                          {letter.pdf_status === 'processing' && (
                            <span className="pdf-badge processing">
                              <i className="fas fa-spinner fa-spin"></i> Processing
                            </span>
                          )}
                        </div>
                        <div className="letter-preview">
                          <p>{getPreviewText(letter.job_requirements)}</p>
                        </div>
                        <div className="letter-card-actions">
                          <button
                            className="card-action-btn primary"
                            onClick={() => handleViewLetter(letter.id)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                          <button
                            className="card-action-btn"
                            onClick={(e) => handleDownloadPDF(letter.id, e)}
                            disabled={letter.pdf_status !== 'completed'}
                            title={letter.pdf_status === 'completed' ? 'Download PDF' : 'PDF not ready'}
                          >
                            <i className="fas fa-download"></i> PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalCount > limit && (
                    <div className="pagination">
                      <button
                        className="pagination-btn"
                        onClick={() => setSkip(Math.max(0, skip - limit))}
                        disabled={skip === 0}
                      >
                        <i className="fas fa-chevron-left"></i> Previous
                      </button>
                      <span className="pagination-info">
                        Showing {skip + 1}-{Math.min(skip + limit, totalCount)} of {totalCount}
                      </span>
                      <button
                        className="pagination-btn"
                        onClick={() => setSkip(skip + limit)}
                        disabled={!hasMore}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="modal-empty">
                  <i className="fas fa-inbox"></i>
                  <h3>No cover letters found</h3>
                  <p>{searchTerm ? 'Try a different search term' : 'Generate your first cover letter to see it here'}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLettersModal;

