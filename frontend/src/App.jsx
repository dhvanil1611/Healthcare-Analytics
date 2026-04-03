import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AwarenessPage from './pages/AwarenessPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AssessmentPage from './pages/AssessmentPage';
import PredictionResultPage from './pages/PredictionResultPage';
import HealthAnalyticsPage from './pages/HealthAnalyticsPage';
import NearbyHospitalsPage from './pages/NearbyHospitalsPage';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #fafafa 0%, #f8f9fa 100%)'}}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/awareness" element={<AwarenessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/prediction-result" element={<PredictionResultPage />} />
          <Route path="/analytics" element={<HealthAnalyticsPage />} />
          <Route path="/nearby-hospitals" element={<NearbyHospitalsPage />} />
        </Routes>
        <ChatbotWidget />
      </div>
    </Router>
  );
}

export default App;
