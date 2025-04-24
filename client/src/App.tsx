import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthCheck from './components/auth/AuthCheck';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import Landing from './pages/Landing';

export default function App() {
  return (
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
      </Routes>
    </Router>
  );
}
