import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateCoverLetter, queuePDFGeneration, waitForPDF, downloadPDF, getPDFStatus } from '../services/coverLetterService';
import { authService } from '../services/authService';

// Hook to manage cover letter state and generation
export const useCoverLetter = () => {
  const [coverLetter, setCoverLetter] = useState(null);
  const [streamingContent, setStreamingContent] = useState('');

  // Mutation for generating cover letter with SSE streaming
  const generateMutation = useMutation({
    mutationFn: async (formData) => {
      const accessToken = authService.getAccessToken();
      
      if (!accessToken) {
        throw new Error('Please log in to generate cover letters');
      }

      // Create FormData for multipart/form-data request
      const requestFormData = new FormData();
      requestFormData.append('job_requirements', formData.jobRequirements);
      requestFormData.append('human_scale', formData.humanScale.toString());
      
      if (formData.optionalInfo) {
        requestFormData.append('optional_info', formData.optionalInfo);
      }
      
      if (formData.uploadedCV) {
        requestFormData.append('cv', formData.uploadedCV);
      }

      // Reset streaming content
      setStreamingContent('');

      // Generate with streaming callback
      const result = await generateCoverLetter(
        requestFormData,
        accessToken,
        (chunk, fullContent) => {
          // Update streaming content in real-time
          setStreamingContent(fullContent);
        }
      );

      return result;
    },
    onSuccess: (data) => {
      setCoverLetter({
        coverLetterId: data.coverLetterId,
        content: data.content,
      });
      setStreamingContent(data.content);
    },
    onError: (error) => {
      console.error('Cover letter generation error:', error);
      setStreamingContent('');
    },
  });

  const createCoverLetter = useCallback((formData) => {
    generateMutation.mutate(formData);
  }, [generateMutation]);

  const resetCoverLetter = useCallback(() => {
    setCoverLetter(null);
    setStreamingContent('');
    generateMutation.reset();
  }, [generateMutation]);

  // Function to set cover letter from external source (e.g., viewing past letter)
  const setCoverLetterFromData = useCallback((letterData) => {
    setCoverLetter({
      coverLetterId: letterData.id,
      content: letterData.generated_content || '',
    });
    setStreamingContent(letterData.generated_content || '');
  }, []);

  // PDF generation mutation
  const [pdfStatus, setPdfStatus] = useState(null);

  const pdfGenerationMutation = useMutation({
    mutationFn: async ({ coverLetterId, onStatusUpdate }) => {
      const accessToken = authService.getAccessToken();
      
      if (!accessToken) {
        throw new Error('Please log in to generate PDFs');
      }

      // Queue PDF generation
      await queuePDFGeneration(coverLetterId, accessToken);
      setPdfStatus('queued');
      
      if (onStatusUpdate) {
        onStatusUpdate('queued');
      }
      
      // Poll for status until ready
      const result = await waitForPDF(
        coverLetterId,
        accessToken,
        (status) => {
          setPdfStatus(status);
          if (onStatusUpdate) {
            onStatusUpdate(status);
          }
        }
      );
      
      return result;
    },
    onError: (error) => {
      console.error('PDF generation error:', error);
      setPdfStatus(null);
    },
  });

  // Download PDF function
  const downloadPDFFile = useCallback(async (coverLetterId) => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      throw new Error('Please log in to download PDFs');
    }
    await downloadPDF(coverLetterId, accessToken);
    setPdfStatus(null);
  }, []);

  return {
    coverLetter,
    streamingContent,
    createCoverLetter,
    resetCoverLetter,
    setCoverLetterFromData,
    isGenerating: generateMutation.isPending,
    error: generateMutation.error,
    // PDF functions
    generatePDF: pdfGenerationMutation.mutateAsync,
    downloadPDF: downloadPDFFile,
    isGeneratingPDF: pdfGenerationMutation.isPending,
    pdfError: pdfGenerationMutation.error,
    pdfStatus,
  };
};
