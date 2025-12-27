import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { ProblemAgitation } from './components/ProblemAgitation';
import { Solution } from './components/Solution';
import { SocialProof } from './components/SocialProof';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

import { Navbar } from './components/Navbar';
import { Instructor } from './components/Instructor';
import { Contact } from './components/Contact';
import { MouseSpotlight } from './components/MouseSpotlight';
import { EditorOverlay } from './components/EditorOverlay';
import { TimelineProgress } from './components/TimelineProgress';
import { CameraBlur } from './components/CameraBlur';
import { InteractiveGrid } from './components/InteractiveGrid';
import { MagneticCursor } from './components/MagneticCursor';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { ContentGenerator } from './pages/ContentGenerator';

function HomePage() {
  useScrollAnimation();

  return (
    <div className="app">
      <InteractiveGrid />
      <MagneticCursor />
      <MouseSpotlight />
      <EditorOverlay />
      <TimelineProgress />
      <CameraBlur />
      <Navbar />
      <div className="fade-in-section">
        <Hero />
      </div>
      <div className="container">
        <div className="fade-in-section editor-panel">
          <ProblemAgitation />
        </div>
        <div className="fade-in-section editor-panel">
          <Solution />
        </div>
        <div className="fade-in-section editor-panel">
          <SocialProof />
        </div>
        <div className="fade-in-section editor-panel">
          <Instructor />
        </div>
        <div id="products" className="fade-in-section editor-panel">
          <Pricing />
        </div>
        <div className="fade-in-section editor-panel">
          <FAQ />
        </div>
        <div className="fade-in-section editor-panel">
          <Contact />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/icerik-uretimi" element={<ContentGenerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
