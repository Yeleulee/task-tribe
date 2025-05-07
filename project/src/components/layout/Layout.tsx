import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AiChat from './AiChat';
import { useAuth } from '../../context/AuthContext';
import useProfile from '../../hooks/useProfile';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [outletError, setOutletError] = useState<string | null>(null);

  useEffect(() => {
    console.log("%c Layout - Component mounted:", "background: #333; color: #4cc9f0; padding: 2px;", {
      path: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [location.pathname]);

  useEffect(() => {
    console.log("%c Layout - Auth state changed:", "background: #333; color: #4361ee; padding: 2px;", {
      userId: currentUser?.uid,
      hasProfile: !!profile,
      profileLoading,
      timestamp: new Date().toISOString()
    });
  }, [currentUser, profile, profileLoading]);

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

  // If user isn't authenticated yet, show loading
  if (!currentUser) {
    console.log("%c Layout - No current user, showing loading spinner", "background: #333; color: #f72585; padding: 2px;");
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e5fb26]"></div>
      </div>
    );
  }

  console.log("%c Layout - Rendering with user:", "background: #333; color: #06d6a0; padding: 2px;", {
    userId: currentUser.uid,
    path: location.pathname
  });

  // Safe outlet renderer
  const renderOutlet = () => {
    try {
      console.log("%c Layout - About to render Outlet component", "background: #333; color: #06d6a0; padding: 2px;");
      return <Outlet />;
    } catch (error) {
      console.error("%c Layout - Error rendering Outlet:", "background: #333; color: #ff6b6b; padding: 2px;", error);
      setOutletError((error as Error).message || "Failed to render dashboard content");
      return (
        <div className="p-4 bg-red-900/30 border border-red-500 rounded-md">
          <h3 className="text-red-500 font-bold mb-2">Error Rendering Dashboard</h3>
          <p className="text-white">{(error as Error).message || "An unknown error occurred"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-background text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={getTitle()} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {outletError ? (
            <div className="p-4 bg-red-900/30 border border-red-500 rounded-md">
              <h3 className="text-red-500 font-bold mb-2">Error Rendering Dashboard</h3>
              <p className="text-white">{outletError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reload Page
              </button>
            </div>
          ) : renderOutlet()}
        </main>
      </div>
      
      <AiChat />
    </div>
  );
};

export default Layout;