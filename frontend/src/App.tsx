import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/Landing';
import { FeaturesPage } from './pages/Features';
import { HowItWorksPage } from './pages/HowItWorks';
import { SignInPage } from './pages/SignIn';
import { SignUpPage } from './pages/SignUp';
import { OpenSourcePage } from './pages/OpenSource';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/Dashboard';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailPage } from './pages/ProjectDetail';
import { MigrationWorkspacePage } from './pages/MigrationWorkspace';
import { VerificationResultsPage } from './pages/VerificationResults';
import { HistoryPage } from './pages/History';
import { SettingsPage } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing & Information Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/open-source" element={<OpenSourcePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Authenticated Application Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/:id/dependencies" element={<ProjectDetailPage />} />
          <Route path="/migrations/:id" element={<MigrationWorkspacePage />} />
          <Route path="/migrations/:id/verification" element={<VerificationResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
