import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import HrDashboard from './pages/dashboard/HrDashboard'
import PlacementDashboard from './pages/dashboard/PlacementDashboard'
import Profile from './pages/Profile'
import StudentJobs from './pages/student/StudentJobs'
import StudentApplications from './pages/student/StudentApplications'
import StudentAutoApply from './pages/student/StudentAutoApply'
import StudentAssessment from './pages/student/StudentAssessment'
import StudentRoadmap from './pages/student/StudentRoadmap' // New Import
import StudentInterview from './pages/student/StudentInterview'
import './index.css'

function App() {
  useEffect(() => {
    let logoutTimer;
    const INACTIVITY_LIMIT = 25 * 60 * 1000; // 25 minutes

    const resetTimer = () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        alert("Session expired due to inactivity. You have been logged out.");
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }, INACTIVITY_LIMIT);
    };

    // Listen for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Initial start
    resetTimer();

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/student/jobs" element={<StudentJobs />} />
        <Route path="/dashboard/student/applications" element={<StudentApplications />} />
        <Route path="/dashboard/student/auto-apply" element={<StudentAutoApply />} />
        <Route path="/dashboard/student/assessment" element={<StudentAssessment />} />
        <Route path="/dashboard/student/roadmap" element={<StudentRoadmap />} />
        <Route path="/dashboard/student/interview" element={<StudentInterview />} />
        <Route path="/dashboard/hr/*" element={<HrDashboard />} />
        <Route path="/dashboard/officer/*" element={<PlacementDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
