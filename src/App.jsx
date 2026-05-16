import { lazy, Suspense } from 'react';
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
import { AuthProvider } from './hooks/useAuth';

// Heavy / route-only pages — load on demand
const ContentGenerator = lazy(() => import('./pages/ContentGenerator').then(m => ({ default: m.ContentGenerator })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer').then(m => ({ default: m.CoursePlayer })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminEmailTemplates = lazy(() => import('./pages/AdminEmailTemplates').then(m => ({ default: m.AdminEmailTemplates })));
const AdminHub = lazy(() => import('./pages/AdminHub').then(m => ({ default: m.AdminHub })));
const AdminQuizBuilder = lazy(() => import('./pages/AdminQuizBuilder').then(m => ({ default: m.AdminQuizBuilder })));
const AdminContentOrder = lazy(() => import('./pages/AdminContentOrder').then(m => ({ default: m.AdminContentOrder })));
const AdminReviews = lazy(() => import('./pages/AdminReviews').then(m => ({ default: m.AdminReviews })));
const AdminReferrals = lazy(() => import('./pages/AdminReferrals').then(m => ({ default: m.AdminReferrals })));
const AdminAbandonedCarts = lazy(() => import('./pages/AdminAbandonedCarts').then(m => ({ default: m.AdminAbandonedCarts })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess').then(m => ({ default: m.PaymentSuccess })));
const PaymentError = lazy(() => import('./pages/PaymentError').then(m => ({ default: m.PaymentError })));
const Certificate = lazy(() => import('./pages/Certificate').then(m => ({ default: m.Certificate })));

const RouteFallback = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a0a0a0',
    fontSize: '0.95rem',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid rgba(0, 255, 157, 0.2)',
        borderTop: '3px solid #00ff9d',
        borderRadius: '50%',
        margin: '0 auto 1rem',
        animation: 'route-spin 1s linear infinite',
      }} />
      <span>Yükleniyor…</span>
    </div>
    <style>{`@keyframes route-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

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
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
