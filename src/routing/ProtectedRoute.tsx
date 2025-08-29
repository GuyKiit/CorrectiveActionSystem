import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/core/AuthContext';
import MasterLayout from '../layout';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <MasterLayout >
      <Outlet />
    </MasterLayout>
  );
};
