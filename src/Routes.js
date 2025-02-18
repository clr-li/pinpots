import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import MapPage from './pages/map';
import Upload from './pages/post';
import SearchPage from './pages/search';
import ExplorePage from './pages/explore';
import TripPage from './pages/trip';
import MobileProfile from './components/MobileProfile'
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from './auth';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  try {
    const userInfo = getUserFromToken();
    if (!userInfo) {
      return <Navigate to="/login.html" />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/login.html" />;
  }
};

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore.html" element={<ExplorePage />} />
        <Route path="/mymap.html" element={<MapPage />} />
        <Route path="/signup.html" element={<SignupPage />} />
        <Route path="/post.html" element={<Upload />} />
        <Route path="/login.html" element={<LoginPage />} />
        <Route path="/search.html" element={<SearchPage />} />
        <Route path="/trip.html" element={<TripPage />} />
        {/* Add both routes to handle both paths */}
        <Route 
          path="/profile.html" 
          element={
            <ProtectedRoute>
              <MobileProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <MobileProfile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};