import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function HomeRedirect() {
  const { user } = useAuth();
  const map = { admin: '/admin', faculty: '/faculty', student: '/student' };
  return <Navigate to={map[user?.role] || '/login'} replace />;
}

export default function App() {
  return (
    <AppRoutes />
  );
}
