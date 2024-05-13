import React, { useState, useEffect } from 'react';
import './Gallery.css'; // Import the CSS file

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const importAll = async (r) => {
      const images = await Promise.all(
        r.keys().map(async (key) => {
          const module = await import(`../OpenCVImages/KMeansResult/${key.substr(2)}`);
          return module.default;
        })
      );
      setImages(images);
    };

    importAll(require.context('../OpenCVImages/KMeansResult', false, /\.(png|jpe?g|svg)$/));
  }, []);

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="gallery">
      <button  className="open-cv-button" onClick={previousImage}>Previous</button>
      {images.length > 0 && (
        <img src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} />
      )}
      <button className="open-cv-button" onClick={nextImage}>Next</button>
    </div>
  );
};

export default Gallery;