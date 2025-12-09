import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import CoverLettersModal from './components/CoverLettersModal';
import Hero from './components/Hero';
import Features from './components/Features';
import CoverLetterForm from './components/CoverLetterForm';
import Preview from './components/Preview';
import Footer from './components/Footer';
import { useCoverLetter } from './hooks/useCoverLetter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { 
    coverLetter, 
    streamingContent, 
    createCoverLetter,
    setCoverLetterFromData,
    isGenerating, 
    error,
    generatePDF,
    downloadPDF,
    isGeneratingPDF,
    pdfError,
    pdfStatus,
  } = useCoverLetter();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCoverLettersModal, setShowCoverLettersModal] = useState(false);

  const handleGenerate = (formData) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    createCoverLetter(formData);
    setShowPreview(true);
    // Scroll to preview after a short delay to ensure it's rendered
    setTimeout(() => {
      const previewSection = document.querySelector('.preview-section');
      if (previewSection) {
        previewSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLoginClick = () => setShowAuthModal(true);
  const handleCloseAuthModal = () => setShowAuthModal(false);
  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const handleShowCoverLetters = () => setShowCoverLettersModal(true);
  const handleCloseCoverLettersModal = () => setShowCoverLettersModal(false);
  
  const handleViewLetter = (letterData) => {
    // Set the cover letter in the preview
    setCoverLetterFromData(letterData);
    setShowPreview(true);
    // Scroll to preview
    setTimeout(() => {
      const previewSection = document.querySelector('.preview-section');
      if (previewSection) {
        previewSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="app">
      <Header onLoginClick={handleLoginClick} onMenuClick={handleMenuClick} />
      <main>
        <Hero />
        <Features />
        <CoverLetterForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        {showPreview && (
          <Preview 
            coverLetter={coverLetter} 
            streamingContent={streamingContent}
            isGenerating={isGenerating}
            error={error}
          />
        )}
      </main>
      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuthModal} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar}
        onShowCoverLetters={handleShowCoverLetters}
      />
      <CoverLettersModal
        isOpen={showCoverLettersModal}
        onClose={handleCloseCoverLettersModal}
        onViewLetter={handleViewLetter}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
