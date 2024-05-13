import React, { useState, useEffect } from 'react';
import './WeatherNowcast.css';
import { useNavigate } from 'react-router-dom';

const WeatherNowcast = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [cloudKMeansData, setcloudKMeansData] = useState(null);

  useEffect(() => {
    const importAll = async (r) => {
      const images = await Promise.all(
        r.keys().map(async (key) => {
          const module = await import(`../OpenCVImages/RomaniaBroderAndCityOutput/${key.substr(2)}`);
          return { name: key.substr(2), src: module.default };
        })
      );
      setImages(images);
      if (images.length > 0) setSelectedImage(images[0].name);
    };

    importAll(require.context('../OpenCVImages/RomaniaBroderAndCityOutput', false, /\.(png|jpe?g|svg)$/));
  }, []);

  const handleImageChange = (event) => {

    setSelectedImage(event.target.value);

    const requestBody = {
      fileName: event.target.value,
      date: "2023-12-10"
    };
  
    fetch('http://localhost:8080/api/retreiveData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setWeatherData(data); // Set the weather data when the request succeeds
      console.log(data.hourly.cloud_cover_low); // Log the cloud cover low data
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });


    const requestBodyIdentifyClusters = {
      fileName: event.target.value
    };

    fetch('http://localhost:8080/api/identifyClusters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBodyIdentifyClusters)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);  
      setcloudKMeansData(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
  };

  const handleBack = () => {
    navigate('/openCV');
  };

  const formatImageName = (imageName) => {
    return imageName.replace(/\.png$/i, '').charAt(0).toUpperCase() + imageName.slice(1).replace(/\.png$/i, '');
  };

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weather Nowcast Page</h1>
      <div className="weather-content">
        <div className="image-container">
          {selectedImage && (
            <img className="weather-image" src={images.find(img => img.name === selectedImage).src} alt={`Weather Nowcast`} />
          )}
          <select className="image-dropdown" value={selectedImage} onChange={handleImageChange}>
            {images.map((image, index) => (
              <option key={index} value={image.name}>{image.name}</option>
            ))}
          </select>
          <button className='back-button' onClick={handleBack}>Back</button>
        </div>
        <div className="image-left">
          <img className="left-image" src={require('../OpenCVImages/RomaniaResidentCities/romaniaResidentCities.png')} alt="Romania Resident Cities" />
        </div>
      </div>

      {weatherData && cloudKMeansData && (
        <div className="k-under-image-container">
          <img className="k-under-image-container" src={require('../OpenCVImages/MapOverF_KAlgorithms/outputKOverlay.png')} alt="Romania Resident Cities" />
          <div className='under-image-container'>
            <h1>
              Specifications For K_Means over: {formatImageName(selectedImage)}
            </h1>
            <h2>
              <h3>Color codes:</h3>
              <li>Green = land</li>
              <li>Blue = ocean/sea</li>
              <li>Pink = high level clouds</li>
              <li>Cyan = mid level clouds</li>
              <li>Red = low level clouds</li>
            </h2>
            <h2>
              <li>Land Pixels coverage {cloudKMeansData.land} px</li>
              <li>Low Cloud coverage {cloudKMeansData.lowClouds} px</li>
              <li>Mid Cloud coverage {cloudKMeansData.middleClouds} px</li>
              <li>High Cloud coverage {cloudKMeansData.highClouds} px</li>
            </h2>
            <h3>Data from the Historical weather API:</h3>
            <h2>
            <li>Low Cloud coverage {weatherData.hourly.cloud_cover_low[11]}%</li>
            <li>Mid Cloud coverage {weatherData.hourly.cloud_cover_mid[11]}%</li>
            <li>High Cloud coverage {weatherData.hourly.cloud_cover_high[11]}%</li>
            </h2>
          </div>
        </div>
      )}

{weatherData && cloudKMeansData && (
        <div className="k-under-image-container">
          <img className="k-under-image-container" src={require('../OpenCVImages/MapOverF_KAlgorithms/outputFuzzyKOverlay.png')} alt="Romania Resident Cities" />
          <div className='fuzzy_under-image-container'>
            <h1>
              Specifications For Fuzzy_K_Means over: {formatImageName(selectedImage)}
            </h1>
            <h2>
              <h3>Color codes:</h3>
              <li>Green = land</li>
              <li>Blue = ocean/sea</li>
              <li>Pink = high level clouds</li>
              <li>Cyan = mid level clouds</li>
              <li>Red = low level clouds</li>
            </h2>
            <h2>
              <li>Land Pixels coverage {cloudKMeansData.land} px</li>
              <li>Low Cloud coverage {cloudKMeansData.lowClouds} px</li>
              <li>Mid Cloud coverage {cloudKMeansData.middleClouds} px</li>
              <li>High Cloud coverage {cloudKMeansData.highClouds} px</li>
            </h2>
            <h3>Data from the Historical weather API:</h3>
            <h2>
            <li>Low Cloud coverage {weatherData.hourly.cloud_cover_low[11]}%</li>
            <li>Mid Cloud coverage {weatherData.hourly.cloud_cover_mid[11]}%</li>
            <li>High Cloud coverage {weatherData.hourly.cloud_cover_high[11]}%</li>
            </h2>
          </div>
        
        </div>
      )}

    </div>
  );
};

export default WeatherNowcast;
