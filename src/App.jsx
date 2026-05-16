import { useEffect, useState } from 'react';
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
import { AdminPanel } from './admin/AdminPanel';
import { useScrollAnimation } from './hooks/useScrollAnimation';

function PublicSite() {
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
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const isAdmin = route.startsWith('#admin') || route.startsWith('#/admin');

  if (isAdmin) {
    return <AdminPanel onClose={() => { window.location.hash = ''; }} />;
  }

  return <PublicSite />;
}

export default App;
