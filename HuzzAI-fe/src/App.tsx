import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/userauth';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import ForgotPage from './features/auth/pages/ForgotPage';
import ForgotMessagePage from './features/auth/pages/ForgotMessagePage';
import ResetPage from './features/auth/pages/ResetPage';
import { SelectMoodPage } from './pages/SelectMoodPage';
import ResponsePage from './pages/ResponsePage';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { LoadingScreen } from './features/loading/pages/LoadingScreen';
import { RizzUploadPage } from './features/rizz-analysis/pages/RizzUploadPage';
import { RizzResultsPage } from './features/rizz-analysis/pages/RizzResultsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPage />} />
            <Route path="/forgot-password/message" element={<ForgotMessagePage />} />
            <Route path="/reset-password/:token" element={<ResetPage />} />
            <Route path="/select-mood" element={<SelectMoodPage />} />
            <Route path="/response" element={
              <ProtectedRoute>
                <ResponsePage />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/*" element={
              <ProtectedRoute>
                <OnboardingFlow />
              </ProtectedRoute>
            } />
            <Route path="/loading" element={
              <ProtectedRoute>
                <LoadingScreen />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/rizz-analysis/upload" element={
              <ProtectedRoute>
                <RizzUploadPage />
              </ProtectedRoute>
            } />
            <Route path="/rizz-analysis/loading" element={
              <ProtectedRoute>
                <LoadingScreen />
              </ProtectedRoute>
            } />
            <Route path="/rizz-analysis/results" element={
              <ProtectedRoute>
                <RizzResultsPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
