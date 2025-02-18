import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Maps from '../components/Maps';
import MyPosts from '../components/MyPosts'; // Changed from TopPosts to MyPosts
import axios from 'axios';
import { getUserFromToken } from '../auth';
import { HOSTNAME } from '../constants';
import '../styles/mobileprofile.css';

const MobileProfile = () => {
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [posts, setPosts] = useState([]); // Add this to store full post data
  const [selectPosition, setSelectPosition] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      let userInfo = null;
      try {
        userInfo = getUserFromToken();
        if (!userInfo) {
          navigate('/login.html');
          return;
        }
        setUser(userInfo);

        const res = await axios.get(`${HOSTNAME}/get-post`, {
          params: { uid: userInfo.id },
        });

        console.log('API Response:', res.data); // Debug log

        if (res.status === 201) {
          // Store full post data
          setPosts(res.data.data);
          
          // Extract locations for map markers
          let extractedLocations = res.data.data.map(post => ({
            ...post.location,
            name: post.title || 'Untitled Post'
          }));
          extractedLocations = Array.from(
            new Set(extractedLocations.map(loc => JSON.stringify(loc))),
          ).map(loc => JSON.parse(loc));
          
          console.log('Extracted Locations:', extractedLocations); // Debug log
          setLocations(extractedLocations);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserProfile();
  }, [navigate, location]);

  const handleMarkerClick = location => {
    console.log('Clicked location:', location); // Debug log
    setSelectPosition(location);
  };

  return (
    <div className="home-container">
      <div className="profile-section">
        <h1 className="text-2xl font-medium">{user?.name || "Vani Agarwal"}</h1>
        <p className="text-blue-600 my-1">@{user?.username || "vaniagarwall"}</p>
        <p className="text-gray-700 mb-4">i love pinpots!!!!!</p>
        
        <div className="flex gap-2 mb-4">
          <Link 
            to="/edit-profile"
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded flex-1 text-center"
          >
            edit profile
          </Link>
          <Link 
            to="/post.html"
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded flex-1 text-center"
          >
            make a post
          </Link>
        </div>
      </div>

        <div className={`map-container ${selectPosition ? 'map-shrink' : ''}`}>
          <Maps
            selectPosition={selectPosition}
            locations={locations}  // Changed from userLocations to locations
            onMarkerClick={handleMarkerClick}
            defaultCenter={{ lat: 47.6062, lng: -122.3321 }}
          />
        </div>

      {selectPosition && (
        <div className="posts-section">
          <MyPosts selectPosition={selectPosition} /> {/* Changed to MyPosts */}
        </div>
      )}

      <nav className="bottom-nav">
        <Link to="/search.html" className="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
          </svg>
          <span>Search</span>
        </Link>
        <Link to="/post.html" className="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5V19M5 12H19" />
          </svg>
          <span>Post</span>
        </Link>
        <Link to="/explore.html" className="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
          </svg>
          <span>Explore</span>
        </Link>
        <Link to="/profile.html" className="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
          </svg>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileProfile;