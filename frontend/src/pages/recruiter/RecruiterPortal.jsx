import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RecruiterProvider, useRecruiter } from '../../context/RecruiterContext';
import RecruiterLogin from './RecruiterLogin';
import RecruiterOnboarding from './RecruiterOnboarding';
import RecruiterDashboard from './RecruiterDashboard';
import MyAssessments from './MyAssessments';
import AssessmentBuilder from './AssessmentBuilder';
import TalentPool from './TalentPool';
import Analytics from './Analytics';
import RecruiterSettings from './RecruiterSettings';

function RecruiterGuard() {
  const { recruiter, loading } = useRecruiter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#00BCD4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!recruiter) {
    return <RecruiterLogin onSuccess={() => window.location.reload()} />;
  }

  if (!recruiter.onboardingComplete) {
    return <RecruiterOnboarding onComplete={() => window.location.reload()} />;
  }

  return (
    <Routes>
      <Route path="dashboard" element={<RecruiterDashboard />} />
      <Route path="assessments" element={<MyAssessments />} />
      <Route path="assessments/create" element={<AssessmentBuilder />} />
      <Route path="talent-pool" element={<TalentPool />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="settings" element={<RecruiterSettings />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}

export default function RecruiterPortal() {
  return (
    <RecruiterProvider>
      <RecruiterGuard />
    </RecruiterProvider>
  );
}
