import React, { useState } from 'react';
import Maps from '../components/Maps';
import Navbar from '../components/Navbar';
import MultiPostDetails from '../components/MultiPostDetails';
import '../styles/map.css';
import '../styles/uploader.css';
import '../styles/search.css';
import PhotoSelector from '../components/PhotoSelect';
import SearchBox from '../components/SearchBox';

function TripPage() {
  const [selectPosition, setSelectPosition] = useState(null);
  const [postImages, setPostImages] = useState([]); // Store multiple selected images
  const [isDone, setIsDone] = useState(false); // Flag to determine if uploading is done
  const [imageLocations, setImageLocations] = useState([]); // Store locations for each image

  // Function to add a new PhotoSelector
  const handleAddPicture = () => {
    setPostImages([...postImages, { img: null, uploaded: false }]); // Add a new entry with a null image and uploaded flag
  };

  // Function to handle image selection and update the state
  const handleImageUpload = (index, image) => {
    const updatedImages = [...postImages];
    updatedImages[index] = { img: image, uploaded: true }; // Update the image and set uploaded to true
    setPostImages(updatedImages);
  };

  // Check if the last selector has a photo uploaded
  const canAddPicture = postImages.length === 0 || postImages[postImages.length - 1].uploaded;

  // Handle "Done" button
  const handleDone = () => {
    setIsDone(true); // Set done flag to true
  };

  // Assign location to the image
  const handleAssignLocation = index => location => {
    const updatedLocations = [...imageLocations];
    updatedLocations[index] = location;
    setImageLocations(updatedLocations);
  };
  // Only show "Done" button if the last image has been uploaded and images exist
  const showDoneButton = postImages.some(imageData => imageData.uploaded) && !isDone;

  // Check if all uploaded images have assigned locations
  const allLocationsAdded = postImages.every(
    (imageData, index) => imageData.uploaded && imageLocations[index],
  );

  return (
    <React.StrictMode>
      <Navbar />
      <div className="half-half-containter">
        <div className="half-container">
          <Maps selectPosition={selectPosition} />
        </div>
        <div className="half-container">
          {/* Render each PhotoSelector component if not done */}
          {!isDone &&
            postImages.map((imageData, index) => (
              <PhotoSelector
                key={index}
                setPostImage={image => handleImageUpload(index, image)} // Pass the handler to update state
              />
            ))}
          {/* Only show the button if the last image has been uploaded */}
          {!isDone && canAddPicture && (
            <button onClick={handleAddPicture} className="search-button">
              Add Picture
            </button>
          )}
          {/* Show the "Done" button if the user can add photos */}
          {showDoneButton && (
            <button onClick={handleDone} className="done-button">
              Done
            </button>
          )}
          {/* If done, display the uploaded images in a grid and allow location assignment */}
          {isDone && (
            <div className="image-grid">
              {postImages.map((imageData, index) => (
                <div key={index} className="image-item">
                  <img
                    src={imageData.img.img}
                    alt={`Upload ${index + 1}`}
                    className="uploaded-image"
                  />
                  <SearchBox
                    selectPosition={selectPosition}
                    setSelectPosition={handleAssignLocation(index)}
                  />
                </div>
              ))}
            </div>
          )}
          {/* Show PostDetails only if all locations are assigned */}
          {isDone && allLocationsAdded && (
            <MultiPostDetails postImages={postImages} imageLocations={imageLocations} />
          )}
        </div>
      </div>
    </React.StrictMode>
  );
}

export default TripPage;
