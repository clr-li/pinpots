import React, { useState } from 'react';
import '../styles/uploader.css';
import PopupMessage from './PopupMessage';

function PhotoSelector({ selectPosition, setPostImage }) {
  const [image, setImage] = useState('');
  const [message, setMessage] = useState(null);

  async function handleFileChange(e) {
    let file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await fileToBase64(file);
        const resizedImage = await resizeBase64Image(base64Image, file.size);
        setImage(resizedImage);
        // Set the image in parent component
        setPostImage({
          img: resizedImage,
          text: '',
          location: selectPosition,
          visibility: 'public',
          takenDate: Date.now(),
        });
      } catch (error) {
        setMessage({ text: 'Error processing file. Please try again.', type: 'error' });
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
        setMessage({ text: 'Failed to load image.', type: 'error' });
        setTimeout(() => setMessage(null), 3000);
        resolve(base64Image);
      };
    });
  }

  return (
    <div className="upload-section">
      <label className="file-input-label">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="file-input"
        />
        <span>Choose file</span>
      </label>
      {image && (
        <div className="image-preview">
          <img src={image} alt="Preview" />
        </div>
      )}
      {message && <PopupMessage message={message.text} type={message.type} />}
    </div>
  );
}

export default PhotoSelector;