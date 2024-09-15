import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getUserFromToken } from '../auth';
import '../styles/search.css'; // Include any styles you need
import { useNavigate } from 'react-router-dom';
import { HOSTNAME } from '../constants';

const SearchResults = ({ searchResults, handleFollowUser, handleSendFriendRequest }) => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [userFollows, setUserFollows] = useState([]);
  const [friendRequests, setFriendRequests] = useState({});
  const history = useNavigate();

  useEffect(() => {
    const fetchFollowerCounts = async () => {
      let userInfo = null;
      try {
        userInfo = getUserFromToken();
      } catch (error) {
        history('/login.html');
      }
      const followedArray = {};
      const doesUserFollow = {};
      const friendRequestsStatus = {};

      await Promise.all(
        searchResults.map(async user => {
          try {
            // Fetch follower counts
            const response = await axios.get(`${HOSTNAME}/follower-count`, {
              params: {
                uid: user._id,
              },
            });
            followedArray[user._id] = response.data.data.map(obj => obj.followerId);
            doesUserFollow[user._id] = followedArray[user._id].includes(userInfo.id);

            // Fetch friend request status
            const friendRequestResponse = await axios.get(`${HOSTNAME}/friend-status-display`, {
              params: {
                requesterId: userInfo.id,
                requestedId: user._id,
              },
            });
            friendRequestsStatus[user._id] = friendRequestResponse.data.Status;
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }),
      );
      setFollowedUsers(followedArray);
      setUserFollows(doesUserFollow);
      setFriendRequests(friendRequestsStatus);
    };

    fetchFollowerCounts();
  }, [searchResults]);

  const handleSendRequest = async userId => {
    try {
      // Send the friend request and get the updated status (e.g., 'Requested', 'Friends', etc.)
      const response = await handleSendFriendRequest(userId);
      const updatedStatus = response.data.status; // Assuming the response contains the new status

      // Update the friendRequests state with the new status
      setFriendRequests(prevState => ({
        ...prevState,
        [userId]: updatedStatus, // Use the actual status returned by the API
      }));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="search-results">
      {searchResults.length !== 0 &&
        searchResults.map(user => (
          <div key={user._id} className="user-info">
            <Link to={`/explore.html?username=${user.username}`}>@{user.username}</Link>
            <span className="follower-count">
              {followedUsers[user._id] !== undefined
                ? `${followedUsers[user._id].length} ${followedUsers[user._id].length === 1 ? 'follower' : 'followers'}`
                : 'Loading...'}
            </span>
            <button onClick={() => handleFollowUser(user._id)}>
              {userFollows[user._id] ? 'Unfollow' : 'Follow'}
            </button>

            <button onClick={() => handleSendRequest(user._id)}>{friendRequests[user._id]}</button>
          </div>
        ))}
    </div>
  );
};

SearchResults.propTypes = {
  searchResults: PropTypes.array.isRequired,
  handleFollowUser: PropTypes.func.isRequired,
  handleSendFriendRequest: PropTypes.func.isRequired, // Add friend request handler as prop
};

export default SearchResults;
