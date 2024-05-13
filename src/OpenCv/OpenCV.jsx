import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './OpenCV.css'; // Assuming you save the CSS code in a file named OpenCV.css
import Gallery from '../GalleryComponent/Gallery';
import GalleryFuzzy from '../GalleryComponentFuzzy/GalleryFuzzy';

const OpenCV = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [resultFile, setResultFile] = useState('');
  const [viewNoiseResult, setViewNoiseResult] = useState(false);
  const [viewKMeansResult, setviewKMeansResult] = useState(false);
  const [resultKMeansFile, setResultKMeansFile] = useState('');
  const [previewKNoise, setpreviewKNoise] = useState(false);

  const [viewFuzzyKMeansResult, setviewFuzzyKMeansResult] = useState(false);
  const [resultFuzzyKMeansFile, setresultFuzzyKMeansFile] = useState('');

  const [viewNoiseImage, setViewNoiseImage] = useState(false);

  const handleRemoveNoise = () => {
   
    setviewKMeansResult(false);
    setpreviewKNoise(false);
    setresultFuzzyKMeansFile(false); 
    setViewNoiseImage(true);

    if (resultFile === '') {
      const requestBody = {
        fileName: "noise.png"
      };
  
      fetch('http://localhost:8080/api/removeNoise', {
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
          return response.text(); // Parse response as text
        })
        .then(data => {
          console.log(data);
          setResultFile(data);
          setViewNoiseResult(true);
        })
        .catch(error => {
          console.error('Error while fetching:', error);
          // Handle error here if needed
        });
    } else {
      setViewNoiseResult(true);
    }
  };
  

  const handleProcessWithK_Means = () => {
    
    setViewNoiseResult(false);
    setpreviewKNoise(false);
    setresultFuzzyKMeansFile(false);
    setViewNoiseImage(false);

    if (resultKMeansFile === '') {

    const requestBody = {
      fileName: "noise.png"
    };

    fetch('http://localhost:8080/api/applyKMeans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
    }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.text(); // Parse response as text
  }).then(data => {
    setResultKMeansFile(data);
    setviewKMeansResult(true);
    console.log(data);
  });
}else
{
  setviewKMeansResult(true);
}
  };

  const handleProcessWithFuzzyK_Means = () => {
    
    setViewNoiseResult(false);
    setpreviewKNoise(false);
    setviewKMeansResult(false);
    setViewNoiseImage(false);

    if(resultFuzzyKMeansFile === ''){
    const requestBody = {
        fileName: "noise.png"
      };
  
      fetch('http://localhost:8080/api/applyFuzzyKMeans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
      }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    }).then(data => {
      setviewFuzzyKMeansResult(data);
      setresultFuzzyKMeansFile(true);
      console.log(data);
    });
  }else
  {
    setresultFuzzyKMeansFile(true);
  }
  };

  const handlePreviewKNoise = () => {
    setviewKMeansResult(false);
    setpreviewKNoise(true);
    setViewNoiseResult(false);
    setresultFuzzyKMeansFile(false);
    setViewNoiseImage(false);
  };

  const handleSeeForecast = () => {
    navigate('/forecast');
  };

  const handleBack = () => {
    navigate('/telemetry');
  };

  const handleCitiesIdentification = () => {

    const requestBody = {
      fileName: "bacau.png"
    };


    fetch('http://localhost:8080/api/identifyCities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
    }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.text(); // Parse response as text
  }).then(data => {
    console.log(data);
  });
  };

  const handleClustersCall = () => {

    const requestBody = {
      fileName: "alexandria.png"
    };


    fetch('http://localhost:8080/api/identifyClusters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
    }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.text(); // Parse response as text
  }).then(data => {
    console.log(data);
  });
  };

  const handleSeeNoiseImage = () => {
    setviewKMeansResult(false);
    setpreviewKNoise(false);
    setViewNoiseResult(false);
    setresultFuzzyKMeansFile(false);
    setViewNoiseImage(true);
  };

  return (
    <div className="open-cv-container">
      <h1>OpenCV Component</h1>
      <button className="open-cv-button" onClick={handleSeeNoiseImage}>See Noise Image </button>
      <button className="open-cv-button" onClick={handleRemoveNoise}>Remove Noise</button>
      <button className="open-cv-button" onClick={handleProcessWithK_Means}>Process With K-Means </button>
      <button className="open-cv-button" onClick={handleProcessWithFuzzyK_Means}>Process With FuzzyK-Means</button>
      <button className="open-cv-button" onClick={handleSeeForecast}>See the forecast</button>
      <button className="open-cv-button" onClick={handlePreviewKNoise}>Preview Noise K FKMeans</button>
      <button className="open-cv-button" onClick={handleBack}>Back</button>

      {viewNoiseResult &&  resultFile &&  
      <div> 
        <h2> NOISE RESULT </h2>
        <img src={require(`../OpenCVImages/NoiseRemoved/${resultFile}`)} alt="My Image" />
      </div>
      }

      { viewKMeansResult &&
        <Gallery/>
      }
      {
        previewKNoise && resultFile && 
        <div className="open-cv-container">
          <div className="open-cv-item-container">
            <img src={require(`../OpenCVImages/NoiseRemoved/${resultFile}`)} alt="My Image" />
            <Gallery />
            <GalleryFuzzy/>
          </div>
        </div>
      }
      {resultFuzzyKMeansFile && 
        <GalleryFuzzy/>
      }

      {viewNoiseImage && 
           <div className="open-cv-container">
            <h2> NOISE INPUT </h2>
           <div className="imported-image-zone">
             <img src={require(`../OpenCVImages/beforeNoise.png`)} alt="My Image" />
            </div>
            </div>
      }
    </div>
  );
};

export default OpenCV;
