import { useState } from 'react';
import Header from './components/Header';
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

  const handleGenerate = (formData) => {
    // Backend integration point: Call your API here to generate the cover letter
    // Example: await fetch('/api/generate-cover-letter', { method: 'POST', body: JSON.stringify(formData) })
    
    createCoverLetter(formData);
    setShowPreview(true);
    
    // Scroll to preview section
    setTimeout(() => {
      const previewSection = document.querySelector('.preview-section');
      if (previewSection) {
        previewSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Features />
        <CoverLetterForm onGenerate={handleGenerate} isGenerating={false} />
        {showPreview && (
          <Preview coverLetter={coverLetter} isGenerating={false} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
