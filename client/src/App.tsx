import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/authStore';
import AuthCheck from './components/auth/AuthCheck';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import BookDetails from './pages/BookDetails';
import GenrePage from './pages/GenrePage';
import UserFanfictionsPage from './pages/UserFanfictionsPage';
import CreateFanfictionPage from './pages/CreateFanfictionPage';
import ResourcesPage from './pages/ResourcesPage';
import Settings from './pages/Settings';
import ThemeProvider from './components/providers/ThemeProvider';


export default function App() {
  const { setUser, setLoading, fetchUserData } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserData();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, fetchUserData]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/landing"
            element={
              <AuthCheck requireAuth={false}>
                <Landing />
              </AuthCheck>
            }
          />
          <Route
            path="/login"
            element={
              <AuthCheck requireAuth={false}>
                <Login />
              </AuthCheck>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthCheck requireAuth={false}>
                <Signup />
              </AuthCheck>
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <AuthCheck>
                <Home />
              </AuthCheck>
            }
          />

          <Route
            path="/settings"
            element={
              <AuthCheck>
                <Settings />
              </AuthCheck>
            }
          />

          {/* User Fanfiction routes */}
          <Route
            path="/fanfiction/user"
            element={
              <AuthCheck>
                <UserFanfictionsPage />
              </AuthCheck>
            }
          />
          <Route
            path="/fanfiction/create"
            element={
              <AuthCheck>
                <CreateFanfictionPage />
              </AuthCheck>
            }
          />

          <Route
            path="/genres/:genre"
            element={
              <AuthCheck>
                <GenrePage />
              </AuthCheck>
            }
          />

          {/* Dynamic protected routes */}
          <Route
            path="/profile/:username"
            element={
              <AuthCheck>
                <Profile />
              </AuthCheck>
            }
          />
          <Route
            path="/book/:id"
            element={
              <AuthCheck>
                <BookDetails />
              </AuthCheck>
            }
          />
          <Route
            path="/resources"
            element={
              <AuthCheck>
                <ResourcesPage />
              </AuthCheck>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
