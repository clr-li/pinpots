// Filename - MyPosts.js
import React, { useState, useEffect } from 'react';
import { getUserFromToken } from '../auth';
import axios from 'axios';
import '../styles/posts.css';
import '../styles/popup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { postVisibility } from '../enum';
import { HOSTNAME } from '../constants';

function MyPosts(props) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const { setSelectPosition, selectPosition } = props;

  useEffect(() => {
    async function fetchData() {
      try {
        const userInfo = getUserFromToken();

        if (selectPosition) {
          const res = await axios.get(`${HOSTNAME}/get-posts-by-loc`, {
            params: {
              uid: userInfo.id,
              lat: selectPosition.lat,
              lon: selectPosition.lon,
            },
          });

          if (res.status === 201) {
            setPosts(res.data.data);
          } else {
            console.log('Failed to fetch posts', res);
          }
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    }

    fetchData();
  }, [selectPosition]);

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const truncateCaption = caption => {
    return caption.length > 20 ? caption.substring(0, 20) + '...' : caption;
  };

  const getVisibilityLabel = visibility => {
    switch (visibility) {
      case postVisibility.PUBLIC:
        return 'Public';
      case postVisibility.PRIVATE:
        return 'Private';
      case postVisibility.FRIENDS:
        return 'Friends';
      default:
        return 'Unknown';
    }
  };

  const handleImageClick = post => {
    setSelectedPost(post);
  };

  const closePopup = () => {
    setSelectedPost(null);
  };

  const deletePost = async () => {
    try {
      const response = await axios.delete(`${HOSTNAME}/delete-post`, {
        params: { postId: selectedPost._id },
      });

      if (response.status === 200) {
        setPosts(posts.filter(post => post._id !== selectedPost._id));
        setSelectedPost(null); // Close the popup
      } else {
        console.log('Failed to delete post', response.status);
      }
    } catch (error) {
      console.log('Error deleting post:', error);
    }
  };

  const goToNextPost = async () => {
    if (!selectedPost || !selectedPost.tripId) return;

    // Get all posts with the same tripId
    const tripPosts = posts.filter(post => post.tripId === selectedPost.tripId);

    // use posts-by-username endpoint to get all posts by the user
    const res = await axios.get(`${HOSTNAME}/posts-by-uid`, {
      params: { uid: selectedPost.uid },
    });

    console.log(res);

    if (res.status === 201) {
      const userPosts = res.data.data;
      const nextPostIndex = userPosts.findIndex(post => post._id === selectedPost._id) + 1;

      if (nextPostIndex < userPosts.length) {
        setSelectedPost(userPosts[nextPostIndex]);
        setSelectPosition(userPosts[nextPostIndex].location);
      } else {
        setSelectedPost(userPosts[0]);
      }
    } else {
      console.log('Failed to fetch posts by username', res.status);
    }
  };

  return (
    <div className="posts-grid">
      {posts.map((data, index) => (
        <div key={index} className="post-container">
          <div className="square-image-wrapper">
            <img
              className="post-img"
              src={data.img}
              alt="a post"
              onClick={() => handleImageClick(data)}
            />
          </div>
          <div className="post-date">{formatDate(data.uploadDate)}</div>
          {data.text && <div className="post-caption">{truncateCaption(data.text)}</div>}
        </div>
      ))}

      {selectedPost && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <div className="popup-details">
              <div>
                <strong>Taken:</strong> {formatDate(selectedPost.takenDate)}
              </div>
              <div>
                <strong>Visibility:</strong> {getVisibilityLabel(selectedPost.visibility)}
              </div>
              <div>
                <button className="delete-post" onClick={deletePost}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
            <img className="popup-img" src={selectedPost.img} alt="Selected Post" />
            <div className="popup-caption">{selectedPost.text}</div>
            {selectedPost.tripId && (
              <button className="next-post-btn" onClick={goToNextPost}>
                Go to Next Post in Trip
              </button>
            )}
            <button className="close-popup" onClick={closePopup}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPosts;
