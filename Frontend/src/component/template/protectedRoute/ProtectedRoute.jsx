import { Navigate, Outlet } from 'react-router';
import { authService } from '../../../services/AuthService';

export const ProtectedRoute = () => {
  const user = authService.getCurrentUser();

  console.log('HELLLO');
  if (!user || !user.token) {
    return <Navigate to="/signIn" replace />;
  }
  return <Outlet />;
};
