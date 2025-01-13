// Filename: UserInfo.js
import React, { useState, useEffect } from 'react';
import { getUserFromToken } from '../auth';
import axios from 'axios';
import '../styles/headings.css';
import { HOSTNAME } from '../constants';

function UserInfo({ username }) {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userInfo = getUserFromToken();
        setUser(userInfo);

        // Check if the user is followed by @verified
        const response = await axios.get(`${HOSTNAME}/check-verified`, {
          params: {
            username: username,
          },
        });
        if (response.status === 200 && response.data.isVerified) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error('Error fetching user info or verification status:', error);
      }
    }

    fetchUserInfo();
  }, []);

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="verify-status">
      &nbsp;
      {isVerified ? (
        <img className="verified-badge" src="/verified.png" alt="verified" />
      ) : (
        <span></span>
      )}
    </div>
  );
}

export default UserInfo;
