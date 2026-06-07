import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import UnitsPage from './pages/UnitsPage';
import RegisterUnitPage from './pages/RegisterUnitPage';
import LinkUnitPage from './pages/LinkUnitPage';
import WriteOrderPage from './pages/WriteOrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import PageLoader from './components/common/PageLoader';
import QuickLoader from './components/common/QuickLoader';
import OrbitalLoader from './components/common/OrbitalLoader';


function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <LoadingProvider>
          <BrowserRouter>
            <PageLoader />
            <QuickLoader />
            <OrbitalLoader />
            <Routes>
              {/* Rutas Públicas */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify" element={<VerifyPage />} />
              </Route>
              
              {/* Rutas Privadas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="units">
                    <Route index element={<UnitsPage />} />
                    <Route path="register" element={<RegisterUnitPage />} />
                    <Route path="link" element={<LinkUnitPage />} />
                  </Route>
                  <Route path="write-order" element={<WriteOrderPage />} />
                  <Route path="order-history" element={<OrderHistoryPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </LoadingProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
