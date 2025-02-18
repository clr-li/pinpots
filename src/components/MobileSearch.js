// MobileSearch.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserFromToken } from '../auth';
import { HOSTNAME } from '../constants';
import '../styles/home.css';
import logo from '../assets/logo.png';

const MobileSearch = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [followedUsers, setFollowedUsers] = useState({});
  const [userFollows, setUserFollows] = useState({});
  const [friendRequests, setFriendRequests] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfo = getUserFromToken();
      setUser(userInfo);
    } catch (error) {
      navigate('/login.html');
    }
  }, [navigate]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${HOSTNAME}/search-users`, {
        params: { search: searchTerm },
      });

      if (response.status === 201) {
        setSearchResults(response.data.data);
        fetchFollowerCounts(response.data.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const fetchFollowerCounts = async (results) => {
    const followedArray = {};
    const doesUserFollow = {};
    const friendRequestsStatus = {};

    await Promise.all(
      results.map(async searchedUser => {
        try {
          // Fetch follower counts
          const response = await axios.get(`${HOSTNAME}/follower-count`, {
            params: {
              uid: searchedUser._id,
            },
          });
          followedArray[searchedUser._id] = response.data.data.map(obj => obj.followerId);
          doesUserFollow[searchedUser._id] = followedArray[searchedUser._id].includes(user.id);

          // Fetch friend request status
          const friendRequestResponse = await axios.get(`${HOSTNAME}/friend-status-display`, {
            params: {
              requesterId: user.id,
              requestedId: searchedUser._id,
            },
          });
          friendRequestsStatus[searchedUser._id] = friendRequestResponse.data.Status;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      })
    );
    setFollowedUsers(followedArray);
    setUserFollows(doesUserFollow);
    setFriendRequests(friendRequestsStatus);
  };

  const handleFollowUser = async (followedId) => {
    try {
      if (user.id === followedId) {
        return;
      }
      const res = await axios.post(`${HOSTNAME}/follow-user`, {
        followerId: user.id,
        followedId,
      });

      if (res.status === 201) {
        // Update local state
        setUserFollows(prev => ({
          ...prev,
          [followedId]: true
        }));
      } else {
        const unfollowRes = await axios.post(`${HOSTNAME}/unfollow-user`, {
          followerId: user.id,
          followedId,
        });
        if (unfollowRes.status === 201) {
          setUserFollows(prev => ({
            ...prev,
            [followedId]: false
          }));
        }
      }
      // Refresh follower counts
      fetchFollowerCounts(searchResults);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleSendFriendRequest = async (requestedId) => {
    try {
      if (user.id === requestedId) return;
      
      const res = await axios.post(`${HOSTNAME}/send-friend-request`, {
        requesterId: user.id,
        requestedId,
      });

      if (res.status === 200 || res.status === 201 || res.status === 202) {
        setFriendRequests(prev => ({
          ...prev,
          [requestedId]: res.data.status
        }));
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="home-container">
    <div className="logo-container">
      <Link to="/" className="logo-link">
        {' '}
        {/* Add this wrapper Link */}
        <h1 className="logo">
          P
          <span className="logo-icon-wrapper">
            <img src={logo} alt="Pin" className="logo-icon" />
          </span>
          nPots
        </h1>
      </Link>
      <p className="tagline">Find and connect with other users!</p>
      </div>

      <div className="search-box-wrapper">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      <div className="search-results-container">
        {searchResults.map(searchedUser => (
          <div key={searchedUser._id} className="user-result-card">
            <div className="flex justify-between items-center">
              <div>
                <Link to={`/explore.html?username=${searchedUser.username}`} className="user-link">
                  @{searchedUser.username}
                </Link>
                <p className="follower-count">
                  {followedUsers[searchedUser._id]?.length || 0} followers
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFollowUser(searchedUser._id)}
                  className="px-4 py-1 border border-[#FF7F50] text-[#FF7F50] rounded-lg hover:bg-[#FF7F50] hover:text-white"
                >
                  {userFollows[searchedUser._id] ? 'Unfollow' : 'Follow'}
                </button>
                <button
                  onClick={() => handleSendFriendRequest(searchedUser._id)}
                  className="px-4 py-1 border border-[#FF7F50] text-[#FF7F50] rounded-lg hover:bg-[#FF7F50] hover:text-white"
                >
                  {friendRequests[searchedUser._id]}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default MobileSearch;