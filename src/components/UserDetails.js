// Filename - UserDetails.js
import React from 'react';
import '../styles/search.css'; // Import the CSS file
import UserInfo from './UserInfo';

function UserDetails({ username }) {
  if (!username) {
    return (
      <div className="user-info">
        <p className="user-info-text">Here are posts from people you follow</p>
      </div>
    );
  }

  return (
    <div className="user-info">
      <p className="user-info-text">
        Viewing @{username}
        <UserInfo username={username} />
      </p>
    </div>
  );
}

export default UserDetails;
