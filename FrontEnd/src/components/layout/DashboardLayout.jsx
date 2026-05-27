import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="bg-surface-container-lowest text-on-surface h-[100dvh] w-full overflow-hidden flex font-body-lg antialiased selection:bg-surface-variant selection:text-[#FFD700] relative" style={{ backgroundColor: '#0c0c0c' }}>
      {/* Geometric Animated Background */}
      <div className="bg-geo-wrapper w-full h-full absolute inset-0 overflow-hidden">
        <div className="geo-polygon geo-hex top-1/4 left-[20%] scale-[1.5] opacity-60" style={{ animationDuration: '90s', borderColor: 'rgba(255, 215, 0, 0.3)' }}></div>
        <div className="geo-polygon geo-triangle top-[60%] left-[80%] scale-[2] opacity-50" style={{ animationDirection: 'reverse', animationDuration: '110s', borderColor: 'rgba(255, 215, 0, 0.25)' }}></div>
        <div className="geo-polygon geo-hex w-[1400px] h-[1600px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 opacity-40" style={{ animationDelay: '-30s', borderColor: 'rgba(255, 215, 0, 0.2)' }}></div>
        <div className="geo-polygon geo-diamond top-[75%] left-[25%] w-[800px] h-[800px] opacity-40" style={{ animationDuration: '65s', border: '2px dashed rgba(255,215,0,0.35)' }}></div>
        <div className="geo-polygon geo-triangle top-[10%] left-[65%] w-[600px] h-[600px] opacity-60" style={{ animationDirection: 'reverse', animationDuration: '55s', animationDelay: '-15s', borderColor: 'rgba(255, 215, 0, 0.3)' }}></div>
      </div>
      
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Dynamic Content (Dashboard, Units, etc.) */}
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
