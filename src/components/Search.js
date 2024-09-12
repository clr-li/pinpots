// Filename - Search.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/search.css'; // Include any styles you need
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../auth';
import SearchResults from './SearchResults'; // Import the new component
import { HOSTNAME } from '../constants';

function Search() {
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [message, setMessage] = useState(null);
    const history = useNavigate();

    useEffect(() => {
        try {
            const userInfo = getUserFromToken();
            setUser(userInfo);
        } catch (error) {
            history('/login.html');
        }
    }, [history]);

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async e => {
        e.preventDefault();

        try {
            const response = await axios.get(`${HOSTNAME}/search-users`, {
                params: {
                    search: searchTerm,
                },
            });

            if (response.status === 201) {
                setSearchResults(response.data.data);
            } else {
                setMessage({ text: 'Failed to fetch users.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error searching users.', type: 'error' });
        }
    };

    const handleFollowUser = async followedId => {
        try {
            if (user.id === followedId) {
                setMessage({ text: "Can't follow yourself", type: 'error' });
                return;
            }
            const res = await axios.post(`${HOSTNAME}/follow-user`, {
                followerId: user.id,
                followedId,
            });

            if (res.status === 201) {
                setMessage({ text: 'Followed successfully!', type: 'success' });
                // Update the follower count in search results
                updateFollowerCount(followedId, 1);
            } else {
                const unfollowRes = await axios.post(`${HOSTNAME}/unfollow-user`, {
                    followerId: user.id,
                    followedId,
                });
                if (unfollowRes.status == 201) {
                    setMessage({ text: 'Unfollowed successfully!', type: 'success' });
                    updateFollowerCount(followedId, -1);
                } else {
                    setMessage({ text: unfollowRes.data.data, type: 'error' });
                }
            }
        } catch (error) {
            setMessage({ text: 'Error following user', type: 'error' });
        }
    };

    const updateFollowerCount = (userId, increment) => {
        setSearchResults(prevResults =>
            prevResults.map(user =>
                user._id === userId
                    ? { ...user, followerCount: user.followerCount + increment }
                    : user,
            ),
        );
    };

    return (
        <div className="search-container">
            <h1>Search Users</h1>
            <div className="search-box-container">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for users..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>
            </div>
            {message && <div className={`message ${message.type}`}>{message.text}</div>}
            <SearchResults
                searchResults={searchResults}
                handleFollowUser={handleFollowUser}
                updateFollowerCount={updateFollowerCount}
            />
        </div>
    );
}

export default Search;
