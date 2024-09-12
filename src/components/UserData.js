// Filename - UserData.js
import React, { useState, useEffect } from 'react';
import { getUserFromToken } from '../auth';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const history = useNavigate();

    useEffect(() => {
        try {
            const userInfo = getUserFromToken();
            setUser(userInfo);
        } catch (error) {
            setError('Not logged in');
            history('/login.html');
        }
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {user ? (
                <div>
                    <h1 style={{ margin: '0px 5px' }}>Welcome, {user.username}</h1>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default UserProfile;
