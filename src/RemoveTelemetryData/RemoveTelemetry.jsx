import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RemoveTelemetry.css';

const RemoveTelemetry = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [importedImageURL, setImportedImageURL] = useState(null);
  const [inputFile, setInputFile] = useState('');
  const [resultFile, setResultFile] = useState('');
  const [removeSuccess, setRemoveSuccess] = useState(false);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImportedImageURL(imageURL);
      setInputFile(file.name);
    }
  };

  const handleRemoveClick = () => {
    if (!importedImageURL) return;

    const requestBody = {
      fileName: inputFile
    };

    fetch('http://localhost:8080/api/removeTelemetry', {
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
  // Move this inside the then block
  setTimeout(() => {
    setResultFile(data);
  }, 1500);
  setRemoveSuccess(true);
  console.log('Absolute Image Path:', data); // Log the absolute image path
})
.catch(error => {
  console.error('Error:', error);
  setRemoveSuccess(false);
});

  };

  const handleOpenCVRedirect = () => {
    navigate('/openCV');
  };

  const handleClearClick = () => {
    setImportedImageURL(null);
    setRemoveSuccess(false);
    // Clear the file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return (
    <div className="remove-telemetry-container">
      <h1 className="page-header"> Remove Telemetry Page </h1>
      <div className="imported-image-zone">
        {importedImageURL && <img src={importedImageURL} alt="Imported Image" className="imported-image" />}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button className="remove-telemetry-button" onClick={handleImportClick}>Import</button>
      {removeSuccess && resultFile && <img src={require(`../OpenCVImages/${resultFile}`)} alt="My Image" />}
      <button className="remove-telemetry-button" onClick={handleRemoveClick}>Remove Telemetry</button>
      <button className="remove-telemetry-button" onClick={handleOpenCVRedirect}>Redirect To OpenCV part</button>
      <button className="remove-telemetry-button" onClick={handleClearClick}>Clear</button>
    </div>
  );
};

export default RemoveTelemetry;