import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentsPage from '../pages/admin/StudentsPage';
import FacultyPage from '../pages/admin/FacultyPage';
import AdminReports from '../pages/admin/AdminReports';
import AdminAI from '../pages/admin/AdminAI';
import AlertsPage from '../pages/AlertsPage';
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import MarkAttendance from '../pages/faculty/MarkAttendance';
import FacultyRecords from '../pages/faculty/FacultyRecords';
import FacultyReports from '../pages/faculty/FacultyReports';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentSuggestions from '../pages/student/StudentSuggestions';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center p-8"><DashboardSkeleton /></div>;
  if (!user) return <Navigate to="/login" replace />;
  const map = { admin: '/admin', faculty: '/faculty', student: '/student' };
  return <Navigate to={map[user.role] || '/login'} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/" element={<HomeRedirect />} />

      <Route
        element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentsPage />} />
        <Route path="/admin/faculty" element={<FacultyPage />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/ai" element={<AdminAI />} />
        <Route path="/admin/alerts" element={<AlertsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['faculty', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/faculty/mark" element={<MarkAttendance />} />
        <Route path="/faculty/records" element={<FacultyRecords />} />
        <Route path="/faculty/alerts" element={<AlertsPage />} />
        <Route path="/faculty/reports" element={<FacultyReports />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/alerts" element={<AlertsPage />} />
        <Route path="/student/suggestions" element={<StudentSuggestions />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
