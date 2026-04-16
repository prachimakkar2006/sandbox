import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import RecruiterPortal from './pages/recruiter/RecruiterPortal';
import NotFound from './pages/NotFound';
import SelectDomain from './pages/SelectDomain';
import SelectSubdomain from './pages/SelectSubdomain';
import { GOOGLE_CLIENT_ID } from './config/env';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary">Loading eraAI...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <AnimatePresence mode="wait">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/recruiters" element={<Navigate to="/recruiter" replace />} />
      <Route path="/recruiter/*" element={<RecruiterPortal />} />
      <Route path="/select-domain" element={<ProtectedRoute><SelectDomain /></ProtectedRoute>} />
      <Route path="/select-subdomain/:domain" element={<ProtectedRoute><SelectSubdomain /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/assessment/:round" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AnimatePresence>
);

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
