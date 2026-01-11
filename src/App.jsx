import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { ProblemAgitation } from './components/ProblemAgitation';
import { Solution } from './components/Solution';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

import { Navbar } from './components/Navbar';
import { MouseSpotlight } from './components/MouseSpotlight';
import { EditorOverlay } from './components/EditorOverlay';
import { TimelineProgress } from './components/TimelineProgress';
import { CameraBlur } from './components/CameraBlur';
import { InteractiveGrid } from './components/InteractiveGrid';
import { MagneticCursor } from './components/MagneticCursor';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { ContentGenerator } from './pages/ContentGenerator';
import { Products } from './pages/Products';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CoursePlayer } from './pages/CoursePlayer';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { AdminEmailTemplates } from './pages/AdminEmailTemplates';
import { AdminHub } from './pages/AdminHub';
import { AdminQuizBuilder } from './pages/AdminQuizBuilder';
import { AdminContentOrder } from './pages/AdminContentOrder';
import { AdminReviews } from './pages/AdminReviews';
import { AdminReferrals } from './pages/AdminReferrals';
import { AdminAbandonedCarts } from './pages/AdminAbandonedCarts';
import { Profile } from './pages/Profile';
import { Checkout } from './pages/Checkout';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentError } from './pages/PaymentError';
import { Certificate } from './pages/Certificate';
import { AuthProvider } from './hooks/useAuth';

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
        <div id="products" className="fade-in-section editor-panel">
          <Pricing />
        </div>
        <div className="fade-in-section editor-panel">
          <FAQ />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/giris" element={<Login />} />
          <Route path="/kayit" element={<Register />} />
          <Route path="/sifremi-unuttum" element={<ForgotPassword />} />
          <Route path="/sifre-sifirla" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/kurs/:courseId" element={<CoursePlayer />} />
          <Route path="/kurs/:courseId/ders/:lessonId" element={<CoursePlayer />} />
          <Route path="/kurs/:courseId/quiz/:quizId" element={<CoursePlayer />} />
          <Route path="/icerik-uretimi" element={<ContentGenerator />} />
          <Route path="/urunler" element={<Products />} />
          <Route path="/0110" element={<AdminHub />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/email-templates" element={<AdminEmailTemplates />} />
          <Route path="/admin/quizzes" element={<AdminQuizBuilder />} />
          <Route path="/admin/quizzes/:quizId" element={<AdminQuizBuilder />} />
          <Route path="/admin/content-order" element={<AdminContentOrder />} />
          <Route path="/admin/content-order/:courseId" element={<AdminContentOrder />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/referrals" element={<AdminReferrals />} />
          <Route path="/admin/abandoned-carts" element={<AdminAbandonedCarts />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/satin-al" element={<Checkout />} />
          <Route path="/odeme-basarili" element={<PaymentSuccess />} />
          <Route path="/odeme-hatasi" element={<PaymentError />} />
          <Route path="/sertifika/:code" element={<Certificate />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
