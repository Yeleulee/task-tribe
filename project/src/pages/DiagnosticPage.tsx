import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import { Card, ArrowRight, RefreshCw } from 'lucide-react';

const DiagnosticPage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [testStep, setTestStep] = useState<string>('idle');
  const [logs, setLogs] = useState<Array<{type: string; message: string; timestamp: string}>>([]);
  const navigate = useNavigate();

  const addLog = (type: 'info' | 'error' | 'success', message: string) => {
    setLogs(prev => [...prev, {
      type,
      message,
      timestamp: new Date().toISOString().split('T')[1].substring(0, 8)
    }]);
  };

  // Log initial state
  useEffect(() => {
    addLog('info', 'Diagnostic page loaded');
    addLog('info', `Auth state: ${authLoading ? 'loading' : (currentUser ? 'authenticated' : 'not authenticated')}`);
    if (currentUser) {
      addLog('success', `User authenticated with ID: ${currentUser.uid}`);
    }
  }, []);

  // Log changes to auth state
  useEffect(() => {
    if (!authLoading) {
      addLog('info', `Auth loading completed, user ${currentUser ? 'present' : 'not present'}`);
    }
  }, [authLoading, currentUser]);

  // Log profile state
  useEffect(() => {
    if (!profileLoading) {
      addLog('info', `Profile loading completed, profile ${profile ? 'exists' : 'does not exist'}`);
      if (profile) {
        addLog('success', `Profile found with display name: ${profile.displayName || '[not set]'}`);
      }
    }
  }, [profileLoading, profile]);

  // Test dashboard navigation
  const testDashboardNavigation = () => {
    setTestStep('testing');
    addLog('info', 'Testing dashboard navigation...');
    
    // Small delay to ensure logs are visible
    setTimeout(() => {
      addLog('info', 'Attempting to navigate to dashboard...');
      
      try {
        // Record pre-navigation state
        addLog('info', `Pre-navigation: User ${currentUser ? 'authenticated' : 'not authenticated'}`);
        navigate('/dashboard');
        setTestStep('completed');
        addLog('success', 'Navigation initiated successfully');
      } catch (error) {
        setTestStep('error');
        addLog('error', `Navigation failed: ${(error as Error).message}`);
      }
    }, 1000);
  };

  // Check dashboard components
  const checkComponents = () => {
    setTestStep('checking');
    addLog('info', 'Checking dashboard components...');
    
    // Import dashboard components dynamically to check if they load
    import('../components/dashboard/ProgressSummary')
      .then(() => addLog('success', 'ProgressSummary component loaded successfully'))
      .catch(err => addLog('error', `Failed to load ProgressSummary: ${err.message}`));

    import('../components/dashboard/TasksOverview')
      .then(() => addLog('success', 'TasksOverview component loaded successfully'))
      .catch(err => addLog('error', `Failed to load TasksOverview: ${err.message}`));
      
    import('../components/dashboard/StreakDisplay')
      .then(() => addLog('success', 'StreakDisplay component loaded successfully'))
      .catch(err => addLog('error', `Failed to load StreakDisplay: ${err.message}`));
      
    import('../components/dashboard/LeaderboardPreview')
      .then(() => addLog('success', 'LeaderboardPreview component loaded successfully'))
      .catch(err => addLog('error', `Failed to load LeaderboardPreview: ${err.message}`));
      
    import('../components/dashboard/AchievementList')
      .then(() => {
        addLog('success', 'AchievementList component loaded successfully');
        setTestStep('components-ok');
      })
      .catch(err => {
        addLog('error', `Failed to load AchievementList: ${err.message}`);
        setTestStep('components-error');
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Diagnostic Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Authentication:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                authLoading ? "bg-yellow-500/20 text-yellow-300" : 
                currentUser ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
              }`}>
                {authLoading ? "Loading..." : currentUser ? "Authenticated" : "Not Authenticated"}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>User Profile:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                profileLoading ? "bg-yellow-500/20 text-yellow-300" : 
                profile ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
              }`}>
                {profileLoading ? "Loading..." : profile ? "Loaded" : "Not Found"}
              </span>
            </div>
            
            {currentUser && (
              <div className="mt-4 p-3 bg-gray-700 rounded-md">
                <p className="text-sm mb-1 text-gray-400">User ID:</p>
                <p className="text-sm font-mono">{currentUser.uid}</p>
                <p className="text-sm mb-1 mt-2 text-gray-400">Email:</p>
                <p className="text-sm">{currentUser.email}</p>
              </div>
            )}
            
            {profile && (
              <div className="mt-2 p-3 bg-gray-700 rounded-md">
                <p className="text-sm mb-1 text-gray-400">Display Name:</p>
                <p className="text-sm">{profile.displayName || 'Not set'}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 space-y-3">
            <button 
              onClick={testDashboardNavigation}
              disabled={testStep === 'testing' || !currentUser}
              className={`w-full py-2 rounded flex items-center justify-center space-x-2 ${
                currentUser ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              <span>Test Dashboard Navigation</span>
              {testStep === 'testing' ? <RefreshCw className="animate-spin h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
            
            <button 
              onClick={checkComponents}
              disabled={testStep === 'checking'}
              className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700 flex items-center justify-center space-x-2"
            >
              <span>Check Dashboard Components</span>
              {testStep === 'checking' && <RefreshCw className="animate-spin h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Diagnostic Logs</h2>
          
          <div className="h-[400px] overflow-y-auto bg-gray-900 rounded-md p-3 font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1">
                  <span className="text-gray-500">[{log.timestamp}]</span>
                  <span className={`ml-2 ${
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 flex space-x-3">
            <Link 
              to="/login" 
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Go to Login
            </Link>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm ml-auto"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage; 