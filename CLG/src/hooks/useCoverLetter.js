import { useState, useCallback } from 'react';

// Base infastructure for hook to manage cover letter state
export const useCoverLetter = () => {
  const [coverLetter, setCoverLetter] = useState(null);

  const createCoverLetter = useCallback((formData) => {
    // Backend will handle the actual generation

    setCoverLetter({
      personalInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      },
      jobDetails: {
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        hiringManager: formData.hiringManager,
      },
      content: null, // Backend will populate this API
    });
  }, []);

  const resetCoverLetter = useCallback(() => {
    setCoverLetter(null);
  }, []);

  return {
    coverLetter,
    createCoverLetter,
    resetCoverLetter,
  };
};
