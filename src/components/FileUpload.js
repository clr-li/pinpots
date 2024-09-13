// Filename: FileUpload.js
import React, { useState, useEffect } from 'react';
import PopupMessage from './PopupMessage';
import { getUserFromToken } from '../auth';
import '../styles/uploader.css';
import { useNavigate } from 'react-router-dom';
import { postVisibility } from '../enum';

function FileUploader(props) {
  const { selectPosition, setPostImage } = props;
  const [image, setImage] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null); // State for message (error or success)
  const history = useNavigate();

  useEffect(() => {
    try {
      const userInfo = getUserFromToken();
      setUser(userInfo);
    } catch (error) {
      history('/login.html');
    }
  }, []);

  // TODO: when location is changed, image doesn't post
  async function convertToBase64(e) {
    let file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await fileToBase64(file);
        const resizedImage = await resizeBase64Image(base64Image, file.size);
        setImage(resizedImage);

        // Automatically save the image and location after processing
        saveImageToState(resizedImage);
      } catch (error) {
        setMessage({ text: 'Error processing file.', type: 'error' });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function resizeBase64Image(base64Image, fileSize) {
    const targetSizeInKB = 75 * 1024;
    return new Promise(resolve => {
      const img = new Image();
      img.src = base64Image;

      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = img.width;
        const height = img.height;

        let scale = Math.sqrt(targetSizeInKB / fileSize);
        if (scale > 1) scale = 1;

        const newWidth = width * scale;
        const newHeight = height * scale;

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        function estimateSize(dataURL) {
          const byteString = atob(dataURL.split(',')[1]);
          return byteString.length;
        }

        let quality = 1;
        let dataURL;
        do {
          dataURL = canvas.toDataURL('image/jpeg', quality);
          const size = estimateSize(dataURL);

          if (size <= targetSizeInKB) break;

          quality -= 0.1;
        } while (quality > 0);

        resolve(dataURL);
      };

      img.onerror = function () {
        console.error('Failed to load image.');
        resolve(base64Image);
      };
    });
  }

  function saveImageToState(imageData = image) {
    if (!user) {
      setMessage({ text: 'User not authenticated.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (!selectPosition) {
      setMessage({
        text: 'Please select a location (a marker should appear on the map)',
        type: 'error',
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Save the image to the parent component's state
    setPostImage({
      img: imageData,
      uid: user.id,
      text: '',
      location: selectPosition,
      visibility: postVisibility.PRIVATE,
      takenDate: Date.now(),
    });

    setMessage({ text: 'Image saved successfully!', type: 'success' });
    setTimeout(() => setMessage(null), 3000); // Hide message after 3 seconds
  }

  return selectPosition ? (
    <div className="file-uploader">
      <h2>2. Upload Image</h2>
      <input type="file" accept="image/*" onChange={convertToBase64} />
      {image && <img src={image} alt="Preview" />}
      <button className="save-image" onClick={saveImageToState}>
        Save
      </button>
      {message && <PopupMessage message={message.text} type={message.type} />}
    </div>
  ) : (
    <div></div>
  );
}

export default FileUploader;
