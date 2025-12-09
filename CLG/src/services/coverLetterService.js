const API_BASE_URL = 'https://coverbe.onrender.com/api/v1';

/**
 * Generate cover letter with SSE streaming
 * @param {FormData} formData - FormData with job_requirements, human_scale, cv (optional), optional_info (optional)
 * @param {string} accessToken - Bearer token for authentication
 * @param {function} onChunk - Callback function called with each chunk of content
 * @returns {Promise<{coverLetterId: string, content: string}>}
 */
export const generateCoverLetter = async (formData, accessToken, onChunk) => {
  const response = await fetch(`${API_BASE_URL}/cover-letters/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'text/event-stream',
      // Don't set Content-Type - browser will set it with boundary for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    // Handle non-SSE errors (400, 401, etc.)
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  // Check if response is SSE stream
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('text/event-stream')) {
    throw new Error('Expected SSE stream but got: ' + contentType);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  let coverLetterId = null;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE messages (ending with \n\n)
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      let currentEvent = null;
      let currentData = '';

      for (const line of lines) {
        if (line === '') {
          // Empty line indicates end of message
          if (currentEvent === 'complete' && currentData) {
            try {
              const data = JSON.parse(currentData);
              coverLetterId = data.cover_letter_id;
            } catch (e) {
              console.error('Error parsing complete event:', e);
            }
          } else if (currentEvent === 'error' && currentData) {
            try {
              const data = JSON.parse(currentData);
              throw new Error(data.error || 'Generation failed');
            } catch (e) {
              if (e instanceof Error && e.message !== 'Generation failed') {
                throw e;
              }
              throw new Error('Generation failed');
            }
          } else if (currentData && !currentEvent) {
            // Content chunk (no event type = default message event)
            try {
              const text = JSON.parse(currentData);
              fullContent += text;
              // Call callback for UI updates
              if (onChunk) {
                onChunk(text, fullContent);
              }
            } catch (e) {
              // If parsing fails, try treating as plain text
              fullContent += currentData;
              if (onChunk) {
                onChunk(currentData, fullContent);
              }
            }
          }

          // Reset for next message
          currentEvent = null;
          currentData = '';
        } else if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          currentData = line.slice(6);
        }
        // Ignore other SSE fields (id, retry, etc.)
      }
    }
  } catch (error) {
    reader.cancel();
    throw error;
  } finally {
    reader.releaseLock();
  }

  // If we exit loop without complete event, something went wrong
  if (!coverLetterId && fullContent === '') {
    throw new Error('Stream ended unexpectedly');
  }

  return {
    coverLetterId,
    content: fullContent,
  };
};

/**
 * Get list of cover letters for authenticated user
 * @param {string} accessToken - Bearer token for authentication
 * @param {number} limit - Number of results per page (default: 20, max: 100)
 * @param {number} skip - Number of results to skip (default: 0)
 * @returns {Promise<{cover_letters: Array, count: number}>}
 */
export const getCoverLetters = async (accessToken, limit = 20, skip = 0) => {
  const response = await fetch(`${API_BASE_URL}/cover-letters?limit=${limit}&skip=${skip}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch cover letters' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return await response.json();
};

/**
 * Get cover letter by ID (includes full content)
 * @param {string} coverLetterId - UUID of the cover letter
 * @param {string} accessToken - Bearer token for authentication
 * @returns {Promise<{cover_letter: Object}>}
 */
export const getCoverLetterById = async (coverLetterId, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/cover-letters/${coverLetterId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Cover letter not found' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return await response.json();
};

/**
 * Queue PDF generation for a cover letter
 * @param {string} coverLetterId - UUID of the cover letter
 * @param {string} accessToken - Bearer token for authentication
 * @returns {Promise<{message: string, cover_letter_id: string}>}
 */
export const queuePDFGeneration = async (coverLetterId, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/cover-letters/${coverLetterId}/pdf`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to queue PDF generation' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return await response.json();
};

/**
 * Check PDF generation status
 * @param {string} coverLetterId - UUID of the cover letter
 * @param {string} accessToken - Bearer token for authentication
 * @returns {Promise<{status: string, cover_letter_id: string, pdf_url?: string, download_url?: string}>}
 */
export const getPDFStatus = async (coverLetterId, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/cover-letters/${coverLetterId}/pdf/status`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get PDF status' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return await response.json();
};

/**
 * Poll for PDF status until ready
 * @param {string} coverLetterId - UUID of the cover letter
 * @param {string} accessToken - Bearer token for authentication
 * @param {function} onStatusUpdate - Optional callback for status updates
 * @param {number} maxAttempts - Maximum number of polling attempts (default: 30)
 * @param {number} intervalMs - Interval between polls in milliseconds (default: 2000)
 * @returns {Promise<{pdfUrl: string, downloadUrl: string}>}
 */
export const waitForPDF = async (coverLetterId, accessToken, onStatusUpdate, maxAttempts = 30, intervalMs = 2000) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const data = await getPDFStatus(coverLetterId, accessToken);

    // Call status update callback if provided
    if (onStatusUpdate) {
      onStatusUpdate(data.status);
    }

    if (data.status === 'completed') {
      return {
        pdfUrl: data.pdf_url,
        downloadUrl: data.download_url,
      };
    } else if (data.status === 'failed') {
      throw new Error('PDF generation failed');
    }

    // Still processing or pending - wait before next attempt
    if (attempt < maxAttempts - 1) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  throw new Error('PDF generation timeout - took too long');
};

/**
 * Download PDF (triggers browser download)
 * @param {string} coverLetterId - UUID of the cover letter
 * @param {string} accessToken - Bearer token for authentication
 */
export const downloadPDF = async (coverLetterId, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/cover-letters/${coverLetterId}/pdf/download`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    redirect: 'follow', // Follow redirects automatically
  });

  if (!response.ok) {
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.error || 'PDF not ready yet');
    }
    throw new Error(`Failed to download PDF: ${response.status}`);
  }

  // The API returns a 302 redirect to Cloudinary
  // With redirect: 'follow', fetch will automatically follow the redirect
  // We can either open the final URL or download it
  const finalUrl = response.url;
  
  // Open in new tab (Cloudinary URL)
  window.open(finalUrl, '_blank');
};
