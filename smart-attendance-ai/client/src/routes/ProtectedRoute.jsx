import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardSkeleton } from '../components/ui/Skeleton';

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    const redirect = { admin: '/admin', faculty: '/faculty', student: '/student' };
    return <Navigate to={redirect[user.role] || '/login'} replace />;
  }

  return children;
}
