// post.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import Maps from '../components/Maps';
import PhotoSelector from '../components/PhotoSelect';
import { getUserFromToken } from '../auth';
import axios from 'axios';
import { HOSTNAME } from '../constants';
import { postVisibility } from '../enum';
import '../styles/home.css';
import logo from '../assets/logo.png';

function PostPage() {
  const [selectPosition, setSelectPosition] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState(postVisibility.PUBLIC);
  const [dateTaken, setDateTaken] = useState(new Date().toISOString().split('T')[0]);
  const [user, setUser] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    try {
      const userInfo = getUserFromToken();
      setUser(userInfo);
    } catch (error) {
      history('/login.html');
    }
  }, [history]);

  const handlePost = async () => {
    if (!user) {
      alert('Please login to post');
      history('/login.html');
      return;
    }
  
    if (!selectPosition) {
      alert('Please select a location');
      return;
    }
  
    if (!postImage) {
      alert('Please select an image');
      return;
    }
  
    try {
      const postData = {
        img: postImage.img,
        uid: user.id,
        text: caption,
        location: selectPosition,
        visibility: visibility,
        takenDate: new Date(dateTaken).getTime(),
        uploadDate: Date.now()
      };
  
      const res = await axios.post(`${HOSTNAME}/create-post`, postData);
  
      if (res.status === 201) {
        alert('Post created successfully!');
        history('/mymap.html');
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
    }
  };
  
  return (
    <div className="home-container">
      <div className="logo-container">
        <h1 className="logo">
          P
          <span className="logo-icon-wrapper">
            <img src={logo} alt="Pin" className="logo-icon" />
          </span>
          nPots
        </h1>
      </div>

      <div className="post-steps">
        <div className="step">
          <h2>1. Search and Select a Location</h2>
          <SearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition} />
        </div>
        
        <div className={`map-container ${selectPosition ? 'map-shrink' : ''}`}>
          <Maps
            selectPosition={selectPosition}
            locations={[]}
            onMarkerClick={location => setSelectPosition(location)}
          />
        </div>

        {selectPosition && (
          <>
            <div className="step">
              <h2>2. Upload Image</h2>
              <PhotoSelector selectPosition={selectPosition} setPostImage={setPostImage} />
            </div>

            {postImage && (
              <div className="step">
                <h2>3. Post Details</h2>
                <div className="post-details">
                  <div className="input-group">
                    <label>Caption (Optional):</label>
                    <textarea
                      value={caption}
                      onChange={e => setCaption(e.target.value)}
                      placeholder="Add a caption..."
                    />
                  </div>

                  <div className="input-group">
                    <label>Visibility:</label>
                    <select 
                      value={visibility} 
                      onChange={e => setVisibility(e.target.value)}
                    >
                      <option value={postVisibility.PUBLIC}>Public</option>
                      <option value={postVisibility.PRIVATE}>Private</option>
                      <option value={postVisibility.FRIENDS}>Friends Only</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Date Taken:</label>
                    <input
                      type="date"
                      value={dateTaken}
                      onChange={e => setDateTaken(e.target.value)}
                    />
                  </div>

                  <button className="post-button" onClick={handlePost}>
                    Post
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <nav className="bottom-nav">
        <Link to="/search.html" className="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"/>
          </svg>
          <span>Search</span>
        </Link>
        <Link to="/post.html" className="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5V19M5 12H19"/>
          </svg>
          <span>Post</span>
        </Link>
        <Link to="/explore.html" className="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
          </svg>
          <span>Explore</span>
        </Link>
        <Link to="/profile.html" className="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"/>
          </svg>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default PostPage;