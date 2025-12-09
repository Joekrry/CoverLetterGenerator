import { useState } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import Hero from './components/Hero';
import Features from './components/Features';
import CoverLetterForm from './components/CoverLetterForm';
import Preview from './components/Preview';
import Footer from './components/Footer';
import { useCoverLetter } from './hooks/useCoverLetter';
import './App.css';


function App() {
  const { coverLetter, createCoverLetter } = useCoverLetter();
  const [showPreview, setShowPreview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGenerate = (formData) => {
    createCoverLetter(formData);
    setShowPreview(true);
    setTimeout(() => {
      const previewSection = document.querySelector('.preview-section');
      if (previewSection) {
        previewSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLoginClick = () => setShowAuthModal(true);
  const handleCloseAuthModal = () => setShowAuthModal(false);

  return (
    <div className="app">
      <Header onLoginClick={handleLoginClick} />
      <main>
        <Hero />
        <Features />
        <CoverLetterForm onGenerate={handleGenerate} isGenerating={false} />
        {showPreview && (
          <Preview coverLetter={coverLetter} isGenerating={false} />
        )}
      </main>
      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuthModal} />
    </div>
  );
}

export default App;
