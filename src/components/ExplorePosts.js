// Filename: ExplorePosts.js
import React, { useState, useEffect } from 'react';
import { getUserFromToken } from '../auth';
import axios from 'axios';
import '../styles/posts.css';
import '../styles/popup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import { postVisibility } from '../enum';
import { HOSTNAME } from '../constants';

function ExplorePosts(props) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [paramUsername, setParamUsername] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set()); // Track liked posts
  const { selectPosition, uids } = props;
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const userInfo = getUserFromToken();

        const params = new URLSearchParams(location.search);
        const username = params.get('username');

        if (selectPosition) {
          let res = null;
          let postsData = null;
          if (username) {
            setParamUsername(username);
            res = await axios.get(`${HOSTNAME}/get-posts-by-username-loc`, {
              params: {
                username: username,
                lat: selectPosition.lat,
                lon: selectPosition.lon,
                visibility: postVisibility.PUBLIC,
              },
            });
            postsData = res.data.data;
          } else {
            res = await axios.get(`${HOSTNAME}/get-posts-by-uids-loc`, {
              params: {
                uids: uids,
                lat: selectPosition.lat,
                lon: selectPosition.lon,
                visibility: postVisibility.PUBLIC,
              },
            });
            postsData = res.data.posts;
            postsData.forEach(post => {
              post['username'] = res.data.users[post.uid] || 'Unknown'; // Map usernames to posts
            });
          }
          if (res.status === 201) {
            setPosts(postsData);

            const likedPostsSet = new Set(
              postsData.filter(post => post.likes.includes(userInfo.id)).map(post => post._id),
            );
            setLikedPosts(likedPostsSet);
          } else {
            console.log('Failed to fetch posts');
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

  const handleImageClick = post => {
    setSelectedPost(post);
  };

  const closePopup = () => {
    setSelectedPost(null);
  };

  const handleLikeClick = async postId => {
    try {
      const userInfo = getUserFromToken();

      const res = await axios.post(`${HOSTNAME}/like-post`, {
        postId: postId,
        userId: userInfo.id,
      });

      if (res.status === 200) {
        setPosts(prevPosts =>
          prevPosts.map(post => {
            if (post._id === postId) {
              const isLiked = post.likes.includes(userInfo.id);
              const updatedLikes = isLiked
                ? post.likes.filter(id => id !== userInfo.id)
                : [...post.likes, userInfo.id];
              return { ...post, likes: updatedLikes };
            }
            return post;
          }),
        );

        setLikedPosts(prev => {
          const newLikedPosts = new Set(prev);
          if (newLikedPosts.has(postId)) {
            newLikedPosts.delete(postId);
          } else {
            newLikedPosts.add(postId);
          }
          return newLikedPosts;
        });
      } else {
        console.log('Failed to update like status');
      }
    } catch (error) {
      console.log('Error liking post:', error);
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
          <div className="post-date">
            {formatDate(data.uploadDate)} @{data.username || username}
          </div>
          {data.text && <div className="post-caption">{truncateCaption(data.text)}</div>}
          <div className="post-likes">
            <button className="like-button" onClick={() => handleLikeClick(data._id)}>
              <FontAwesomeIcon
                icon={faHeart}
                className={`like-icon ${likedPosts.has(data._id) ? 'liked' : ''}`}
              />
            </button>
            <span>
              {data.likes.length} {data.likes.length === 1 ? 'Like' : 'Likes'}
            </span>
          </div>
        </div>
      ))}

      {selectedPost && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <img className="popup-img" src={selectedPost.img} alt="Selected Post" />
            <div className="post-date">
              {formatDate(selectedPost.uploadDate)} @{selectedPost.username || paramUsername}
            </div>
            <div className="popup-caption">{selectedPost.text}</div>
            <button className="close-popup" onClick={closePopup}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExplorePosts;
