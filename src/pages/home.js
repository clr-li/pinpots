import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import Maps from '../components/Maps';
import '../styles/home.css';
import { getUserFromToken } from '../auth';
import { HOSTNAME } from '../constants';
import axios from 'axios';
import logo from '../assets/logopn.png';

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

function HomePage() {
  const [locations, setLocations] = useState([]);
  const [selectPosition, setSelectPosition] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    async function fetchTopPosts() {
      try {
        let userInfo = null;
        try {
          userInfo = await getUserFromToken();
          setLoggedIn(userInfo);
        } catch {
          console.log('Not logged in home');
        }

        const res = await axios.get(`${HOSTNAME}/top-posts`);
        if (res.status === 200) {
          let extractedLocations = res.data.data.map(post => post.location);
          extractedLocations = Array.from(
            new Set(extractedLocations.map(loc => JSON.stringify(loc))),
          ).map(loc => JSON.parse(loc));
          setLocations(extractedLocations);
        }
      } catch (error) {
        console.log('Error fetching top posts:', error);
      }
    }
    fetchTopPosts();
  }, []);

  return (
    <div className="home-container">
      {/* Logo Section */}
      <header className="header-section">
        <h1 className="logo">
          P
          <span className="logo-icon-wrapper">
            <img src={logo} alt="Pin" className="logo-icon" />
          </span>
          inPots
        </h1>
        <p className="description">
          Write reviews, organize your photos, or explore a new location!
        </p>
      </header>

      {/* Search Box */}
      <SearchBox 
        selectPosition={selectPosition} 
        setSelectPosition={setSelectPosition}
      />

      {/* Map Section */}
      <div className="map-container">
        <Maps
          selectPosition={selectPosition}
          locations={locations}
          onMarkerClick={location => setSelectPosition(location)}
        />
      </div>

      {/* Auth Buttons */}
      <div className="auth-buttons">
        <a href="/login.html" className="auth-btn">Login</a>
        <a href="/signup.html" className="auth-btn">Signup</a>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <a href="/search.html" className="nav-btn">
          <SearchIcon />
          <span>Search</span>
        </a>
        <a href="/post.html" className="nav-btn">
          <PlusIcon />
          <span>Post</span>
        </a>
        <a href="/explore.html" className="nav-btn">
          <GlobeIcon />
          <span>Explore</span>
        </a>
        <a href="/profile.html" className="nav-btn">
          <UserIcon />
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
}

export default HomePage;