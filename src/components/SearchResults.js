// Filename: SearchResults.js
import React from 'react';
import axios from 'axios';
import { HOSTNAME } from '../constants';

const SearchResults = ({ searchResults, handleFollowUser, updateFollowerCount, currentUserId }) => {
  const handleSendFriendRequest = async requestedId => {
    try {
      const res = await axios.post(`${HOSTNAME}/send-friend-request`, {
        requesterId: currentUserId,
        requestedId,
      });

      if (res.status === 200) {
        alert('Friend request sent');
      } else if (res.status === 201 && res.data.data === 'You are now friends') {
        alert('You are now friends');
      } else {
        alert(res.data.data);
      }
    } catch (error) {
      alert('Error sending friend request');
    }
  };

  return (
    <div className="search-results-container">
      {searchResults.map(user => (
        <div key={user._id} className="search-result-item">
          <div>
            <span>{user.username}</span>
            <button onClick={() => handleFollowUser(user._id)}>
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <button onClick={() => handleSendFriendRequest(user._id)}>Send Friend Request</button>
          </div>
          <div>Followers: {user.followerCount}</div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
