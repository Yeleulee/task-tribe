import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AiChat from './AiChat';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Convert route to title (e.g., /dashboard/tasks -> Tasks)
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    
    // Extract the last part of the path (e.g., /dashboard/tasks -> tasks)
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length >= 2) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    }
    
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-background text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={getTitle()} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      
      <AiChat />
    </div>
  );
};

export default Layout;