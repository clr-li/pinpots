// Filename: home.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBox from '../components/SearchBox';
import Maps from '../components/Maps';
import TopPosts from '../components/TopPosts';
import axios from 'axios';
import { getUserFromToken } from '../auth';
import { HOSTNAME } from '../constants';

function HomePage() {
    const [locations, setLocations] = useState([]);
    const [selectPosition, setSelectPosition] = useState(null);
    const [loggedIn, setLoggedIn] = useState(null);

    useEffect(() => {
        async function fetchTopPosts() {
            try {
                let userInfo = null;
                try {
                    userInfo = getUserFromToken();
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
                } else {
                    console.log('Failed to fetch top posts', res.status);
                }
            } catch (error) {
                console.log('Error fetching top posts:', error);
            }
        }

        fetchTopPosts();
    }, []);

    const handleMarkerClick = location => {
        setSelectPosition(location);
    };

    return (
        <React.StrictMode>
            <Navbar />
            <div className="half-half-containter">
                <div className="half-container">
                    <Maps
                        selectPosition={selectPosition}
                        locations={locations}
                        onMarkerClick={handleMarkerClick}
                    />
                </div>
                <div className="half-container">
                    {loggedIn ? (
                        <h1>PinPot Top Posts</h1>
                    ) : (
                        <div>
                            <h1>PinPot</h1>
                            <h4>Write reviews, organize your photos, or explore a new location!</h4>
                        </div>
                    )}
                    <SearchBox
                        selectPosition={selectPosition}
                        setSelectPosition={setSelectPosition}
                    />
                    <TopPosts selectPosition={selectPosition} />
                </div>
            </div>
        </React.StrictMode>
    );
}

export default HomePage;
