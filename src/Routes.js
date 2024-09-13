import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import MapPage from './pages/map';
import Upload from './pages/post';
import SearchPage from './pages/search';
import ExplorePage from './pages/explore';

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore.html" element={<ExplorePage />} />
        <Route path="/mymap.html" element={<MapPage />} />
        <Route path="/signup.html" element={<SignupPage />} />
        <Route path="/post.html" element={<Upload />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search.html" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};
