import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/Loading';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Redirect to sign in with return URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check if specific permission is required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirect to dashboard if user doesn't have required permission
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;