import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLanding from './main-landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { LoadingProvider } from './context/LoadingContext';
import PageLoader from './components/common/PageLoader';
import './App.css';

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <PageLoader />
        <Routes>
          <Route path="/" element={<MainLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
