import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopupMessage from './PopupMessage';
import '../styles/posts.css';
import '../styles/uploader.css';
import { postVisibility } from '../enum';
import { getUserFromToken } from '../auth';
import { HOSTNAME } from '../constants';
import { v4 as uuidv4 } from 'uuid';

function MultiPostDetails({ postImages, imageLocations }) {
  const [user, setUser] = useState(null);
  const [visibility, setVisibility] = useState(postVisibility.PRIVATE);
  const [takenDates, setTakenDates] = useState(
    postImages.map(() => new Date().toISOString().split('T')[0]),
  );
  const [captions, setCaptions] = useState(postImages.map(() => ''));
  const [message, setMessage] = useState(null);

  useEffect(() => {
    try {
      const userInfo = getUserFromToken();
      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error) {
      console.log('Error getting user info:', error);
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    if (!user) {
      setMessage({ text: 'User not authenticated.', type: 'error' });
      return;
    }

    const tripId = uuidv4();
    for (let index = 0; index < postImages.length; index++) {
      const postData = {
        uid: user.id, // Use the user ID from the token
        img: postImages[index].img,
        location: imageLocations[index],
        visibility,
        takenDate: new Date(takenDates[index]).toISOString(),
        text: captions[index].trim() || undefined, // Include caption if not empty
        index, // Include the post index
        tripId: tripId, // Include the trip ID
      };

      // Check for public house rule
      if (postData.visibility === postVisibility.PUBLIC && postData.location?.type === 'house') {
        setMessage({
          text: `Cannot post public images of houses (Post ${index + 1})`,
          type: 'error',
        });
        return;
      }

      try {
        const response = await axios.post(`${HOSTNAME}/upload-multiple-posts/`, postData);

        if (response.status === 201) {
          setMessage({ text: `Post ${index + 1} uploaded successfully!`, type: 'success' });
        } else {
          setMessage({ text: `Failed to upload Post ${index + 1}.`, type: 'error' });
          break;
        }
      } catch (error) {
        setMessage({ text: `Error uploading Post ${index + 1}.`, type: 'error' });
        break;
      }
    }
  };

  return (
    <div className="post-settings">
      <h2 className="center-h2">3. Post Details</h2>
      <form onSubmit={handleSubmit}>
        {postImages.map((_, index) => (
          <div key={index} className="post-item">
            <h3>Post {index + 1}</h3>
            <div>
              <label htmlFor={`caption-${index}`}>Caption (Optional):</label>
              <textarea
                id={`caption-${index}`}
                value={captions[index]}
                onChange={e => {
                  const updatedCaptions = [...captions];
                  updatedCaptions[index] = e.target.value;
                  setCaptions(updatedCaptions);
                }}
              />
            </div>
            <div>
              <label htmlFor={`takenDate-${index}`}>Date Taken:</label>
              <input
                type="date"
                id={`takenDate-${index}`}
                value={takenDates[index]}
                onChange={e => {
                  const updatedDates = [...takenDates];
                  updatedDates[index] = e.target.value;
                  setTakenDates(updatedDates);
                }}
              />
            </div>
          </div>
        ))}
        <div>
          <label htmlFor="visibility">Visibility:</label>
          <select
            id="visibility"
            value={Object.keys(postVisibility).find(key => postVisibility[key] === visibility)}
            onChange={e => setVisibility(postVisibility[e.target.value])}
          >
            {Object.keys(postVisibility).map(key => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Post All</button>
      </form>
      {message && <PopupMessage message={message.text} type={message.type} />}
    </div>
  );
}

export default MultiPostDetails;
