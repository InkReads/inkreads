import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthCheckProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthCheck({ children, requireAuth = true }: AuthCheckProps) {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to landing page if authentication is required but user is not logged in
        navigate('/landing');
      } else if (!requireAuth && user) {
        // Redirect to home if user is logged in but trying to access auth pages
        navigate('/');
      }
    }
  }, [user, loading, requireAuth, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Only render children if authentication requirements are met
  if ((requireAuth && user) || (!requireAuth && !user)) {
    return <>{children}</>;
  }

  return null;
} 