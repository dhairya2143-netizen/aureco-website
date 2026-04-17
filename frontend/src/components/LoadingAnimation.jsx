import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="loading-animation">
      <div className="logo-fade">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="32"
            fontFamily="Playfair Display, serif"
            fill="#6B8E3E"
            className="logo-text"
          >
            Aureco
          </text>
        </svg>
      </div>
    </div>
  );
};

export default LoadingAnimation;
