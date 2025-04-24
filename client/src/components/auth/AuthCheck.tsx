import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthCheckProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthCheck({ children, requireAuth = true }: AuthCheckProps) {
  const { user, loading, fetchUserData } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to landing page if authentication is required but user is not logged in
        navigate('/landing');
      } else if (!requireAuth && user) {
        // Redirect to home if user is logged in but trying to access auth pages
        navigate('/');
      } else if (user) {
        // Fetch user data when user is authenticated
        fetchUserData();
      }
    }
  }, [user, loading, requireAuth, navigate, fetchUserData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
} 