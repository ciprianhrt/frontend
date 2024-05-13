import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import reportWebVitals from './reportWebVitals';
import RemoveTelemetry from './RemoveTelemetryData/RemoveTelemetry';
import OpenCV from'./OpenCv/OpenCV';
import Gallery from './GalleryComponent/Gallery';
import WeatherNowcast from './WeatherNowcastComponent/WeatherNowcast';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/telemetry" element={<RemoveTelemetry />} />
        <Route path="/openCV" element={<OpenCV />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/forecast" element={<WeatherNowcast />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();