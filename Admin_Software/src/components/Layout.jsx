import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { TopHeader, SubHeader } from './Header';

const Layout = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarVisible, setIsDesktopSidebarVisible] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-slate-950 text-gray-800 dark:text-slate-100 font-sans relative transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDesktopSidebarVisible ? 'lg:relative lg:translate-x-0' : 'lg:absolute lg:-translate-x-full'} transition-transform duration-300 ease-in-out flex-shrink-0 h-full`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f7fb] dark:bg-slate-950 w-full transition-colors">
        <header className="z-10">
          <TopHeader 
            onMenuClick={() => setIsSidebarOpen(prev => !prev)} 
            onToggleDesktopSidebar={() => setIsDesktopSidebarVisible(prev => !prev)} 
          />
          <SubHeader />
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          <Outlet />
        </main>
        
        <footer className="bg-[#0a192f] dark:bg-[#071324] text-white dark:text-slate-400 text-[11px] py-1.5 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-2 tracking-wide font-medium border-t dark:border-slate-850 transition-colors">
          <div className="flex gap-4 md:gap-16 w-full md:w-auto justify-between md:justify-start">
            <span className="truncate">Company : {localStorage.getItem('companyName') || 'MY COMPANY'}</span>
            <span>User : {localStorage.getItem('userName') || 'ADMIN'}</span>
          </div>
          <div className="hidden md:flex gap-16">
            <span>Version : 1.0.0.0</span>
            <span>Database : ALLCORE_DB</span>
            <span>Financial Year : 2024-2025</span>
          </div>
          <div className="w-full md:w-auto text-center md:text-right">
            <span>24-05-2024 <span className="mx-2">|</span> 11:30 AM</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
