import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import FriendsPage from './pages/FriendsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotificationsPage from './pages/NotificationsPage';
import StatsPage from './pages/StatsPage';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { SocialProvider } from './context/SocialContext';
import { AiAssistantProvider } from './context/AiAssistantContext';
import { CalendarProvider } from './context/CalendarContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <SocialProvider>
            <CalendarProvider>
              <AiAssistantProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Layout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="tasks" element={<TasksPage />} />
                    <Route path="tasks/new" element={<CreateTaskPage />} />
                    <Route path="friends" element={<FriendsPage />} />
                    <Route path="leaderboard" element={<LeaderboardPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="stats" element={<StatsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Route>
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