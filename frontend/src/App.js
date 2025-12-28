import React from 'react';
import { useState } from 'react';

import './App.css';
import { Route, Routes, Navigate, BrowserRouter, HashRouter } from 'react-router-dom';
import Cookies from 'js-cookie';  // Assuming you're using cookies for authentication and role verification.

import SADash from './components/SuperAdmin/Dashboard/SA_Dashboard';
import Home from './components/Home/components/Home';
import InternDash from './components/Intern/Intern_Dashboard';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import SAJobDesc from './components/SuperAdmin/SAViewJobs/SAJobDesc';
import QuizAttempt from './components/Intern/quiz/QuizAttempt';
import UserQuizAnalysis from './components/Intern/quiz/userAnalyze';
import AnalyzeQuiz from './components/SuperAdmin/Quiz/Analyze/Analyze';
import HRDash from './components/HRS/Dashboard/HR_Dash';
import GuestDashboard from './components/Guest/Guest_Dashboard';
import QuizResults from './components/Intern/quiz/results';
import Results from './Components/Results/Results';
import Upload from './Components/Upload/Upload';
import CuratorDash from './components/Curator/Dashboard/CuratorDashboard';

// PrivateRoute to handle role-based route protection
function PrivateRoute({ element, role }) {
  const userRole = Cookies.get('role');
  const verified = Cookies.get('verified');
  if (verified === 'true' && userRole === role) {
    return element;
  }
  toast.warning('Session expired. Please login again.');
  return <Navigate to="/" />;
}

function App() {
  const [results, SetResults] = useState([]);
  return (
    <div className=''>
      <ToastContainer autoClose={5000} />
      <BrowserRouter>
	<Routes>
	  {/* Public Routes */}
          <Route path="/" element={<Home defaultTab="home" />} />
          <Route path="/About" element={<Home defaultTab="About" />} />
                    <Route path="/Achievements" element={<Home defaultTab="Achievements" />} />
	  <Route path="/Contact" element={<Home defaultTab="Contact" />} />
          <Route path="/Jobs" element={<Home defaultTab="Jobs" />} />
          <Route path="/Jobs/:id" element={<Home defaultTab="Jobs" />} />
          <Route path="/privacy-policy" element={<Home defaultTab="PrivacyPolicy" />} />
          <Route path="/security" element={<Home defaultTab="Security" />} />
          <Route path="/accessibility" element={<Home defaultTab="accessibility" />} />
          <Route path="/cookies" element={<Home defaultTab="Cookies" />} />
          <Route path="/results/:quizToken/:userId" element={<QuizResults />} />

          {/* Registration and Login */}
          <Route path="/register/intern" element={<Home defaultTab="InternReg" />} />
          <Route path="/register/hr" element={<Home defaultTab="HrReg" />} />
          <Route path="/register/guest" element={<Home defaultTab="GuestReg" />} />
          <Route path="/login" element={<Home defaultTab="GuestLogin" />} />

          <Route path="/login/hr" element={<Home defaultTab="HRLogin" />} />
          <Route path="/login/SA" element={<Home defaultTab="SuperAdminLogin" />} />
          <Route path="/login/curator" element={<Home defaultTab="CuratorLogin" />} />

          {/* Intern Routes */}
          <Route path="/test/:token" element={<PrivateRoute role="intern" element={<QuizAttempt />} />} />
          <Route path="/quiz-analysis/:userId/:quizToken" element={<PrivateRoute role="intern" element={<UserQuizAnalysis />} />} />
          <Route path="/intern_dash/*" element={<PrivateRoute role="intern" element={<InternDash />} />} />
          <Route path="/intern_dash/applied" element={<PrivateRoute role="intern" element={<InternDash defaultTab="Applied" />} />} />
          <Route path="/intern_dash/jobs" element={<PrivateRoute role="intern" element={<InternDash defaultTab="Jobs" />} />} />
          <Route path="/intern_dash/lms" element={<PrivateRoute role="intern" element={<InternDash defaultTab="LMS" />} />} />
          <Route path="/intern_dash/quiz" element={<PrivateRoute role="intern" element={<InternDash defaultTab="Quiz" />} />} />
          <Route path="/intern_dash/profile" element={<PrivateRoute role="intern" element={<InternDash defaultTab="Profile" />} />} />
          <Route path="/intern_dash" element={<Navigate to="/intern_dash/dashboard" />} /> {/* Redirect to Dashboard */}
          <Route path="/intern_dash/quiz-analysis/:quizToken" element={<UserQuizAnalysis />} />
          {/* HR Routes */}
          <Route path="/HR_dash/*" element={<PrivateRoute role="HR" element={<HRDash />} />} />

          {/* Super Admin (SA) Routes */}
          <Route path="/SA_dash/*" element={<PrivateRoute role="SA" element={<SADash />} />} />
          <Route path="/SA_dash/job/:jobId" element={<PrivateRoute role="SA" element={<SAJobDesc />} />} />
          <Route path="SA/analyze/:token" element={<PrivateRoute role="SA" element={<AnalyzeQuiz />} />} />

          {/* Curator Routes */}
          <Route path="/curator/*" element={<PrivateRoute role="curator" element={<CuratorDash />} />} />

          {/* Guest Routes */}
          <Route path="/extern_dash/*" element={<PrivateRoute role="Guest" element={<GuestDashboard defaultTab="Applied" />} />} />

          {/* Hallticket Routes */}
          <Route path="/upload_dash" element={<Upload/>} />
        </Routes>
        {/* </HashRouter> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
