import React from "react";
import "./Loading.css";

const Loading = ()=> (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <span className="wellness-icon">🌿</span>
    </div>
    <p>Loading wellness...</p>
  </div>
);

export default Loading;
