import React, { useState } from "react";

const FlipCard = ({ frontIcon, frontTitle, backText, color }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flip-card w-64 h-40 perspective cursor-pointer`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      tabIndex={0}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
    >
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}> 
        <div className={`flip-card-front flex flex-col items-center justify-center rounded-2xl shadow-lg p-6 bg-white border-2 ${color} transition-all duration-300`}> 
          <div className="mb-3">{frontIcon}</div>
          <h3 className="text-xl font-bold text-gray-800">{frontTitle}</h3>
        </div>
        <div className="flip-card-back flex flex-col items-center justify-center rounded-2xl shadow-lg p-6 bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-2 border-blue-400 transition-all duration-300"> 
          <p className="text-base text-center font-medium">{backText}</p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
