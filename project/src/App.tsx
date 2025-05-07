import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import FriendsPage from './pages/FriendsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotificationsPage from './pages/NotificationsPage';
import StatsPage from './pages/StatsPage';
import DebugPage from './pages/DebugPage';
import DiagnosticPage from './pages/DiagnosticPage';
import TestDashboard from './pages/TestDashboard';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { SocialProvider } from './context/SocialContext';
import { AiAssistantProvider } from './context/AiAssistantContext';
import { CalendarProvider } from './context/CalendarContext';
import PrivateRoute from './components/auth/PrivateRoute';
import { useAuth } from './context/AuthContext';
import { isFirebaseInitialized } from './config/firebase';
import { Link } from 'react-router-dom';

// Debug component to help diagnose authentication issues
const DebugView: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const fbInitialized = isFirebaseInitialized();

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">TaskTribe Debug Info</h1>
      
      <div className="bg-gray-800 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Authentication State</h2>
        <p>Firebase Initialized: <span className={fbInitialized ? "text-green-400" : "text-red-400"}>{String(fbInitialized)}</span></p>
        <p>Auth Loading: <span className={loading ? "text-yellow-400" : "text-green-400"}>{String(loading)}</span></p>
        <p>User Authenticated: <span className={currentUser ? "text-green-400" : "text-red-400"}>{String(!!currentUser)}</span></p>
        {currentUser && (
          <div className="mt-2 border-t border-gray-700 pt-2">
            <p>User ID: {currentUser.uid}</p>
            <p>Email: {currentUser.email}</p>
            <p>Provider: {currentUser.providerData[0]?.providerId}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Link to="/" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Home</Link>
        <Link to="/login" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Login</Link>
        <Link to="/signup" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Signup</Link>
        <Link to="/dashboard" className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded">Dashboard</Link>
        <Link to="/profile-setup" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Profile Setup</Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <SocialProvider>
            <CalendarProvider>
              <AiAssistantProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/debug" element={<DebugView />} />
                  <Route path="/debug-new" element={<DebugPage />} />
                  <Route path="/diagnostic" element={<DiagnosticPage />} />
                  <Route path="/test-dashboard" element={<TestDashboard />} />
                  
                  {/* Protected routes */}
                  <Route path="/profile-setup" element={<PrivateRoute><ProfileSetupPage /></PrivateRoute>} />
                  
                  {/* Dashboard routes */}
                  <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route index element={<DashboardPage />} />
                    <Route path="tasks" element={<TasksPage />} />
                    <Route path="tasks/new" element={<CreateTaskPage />} />
                    <Route path="friends" element={<FriendsPage />} />
                    <Route path="leaderboard" element={<LeaderboardPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="stats" element={<StatsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Route>
                  
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AiAssistantProvider>
            </CalendarProvider>
          </SocialProvider>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;