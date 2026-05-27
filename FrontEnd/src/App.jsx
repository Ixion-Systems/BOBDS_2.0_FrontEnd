import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import UnitsPage from './pages/UnitsPage';
import RegisterUnitPage from './pages/RegisterUnitPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import PageLoader from './components/common/PageLoader';
import QuickLoader from './components/common/QuickLoader';
import OrbitalLoader from './components/common/OrbitalLoader';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <PageLoader />
          <QuickLoader />
          <OrbitalLoader />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            
            {/* Rutas Privadas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="units">
                  <Route index element={<UnitsPage />} />
                  <Route path="register" element={<RegisterUnitPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
