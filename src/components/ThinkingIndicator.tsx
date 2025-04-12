
import React from 'react';

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="my-2">
      <div className="thinking-dot animate-pulse-slow" style={{ animationDelay: '0s' }}></div>
      <div className="thinking-dot animate-pulse-slow" style={{ animationDelay: '0.3s' }}></div>
      <div className="thinking-dot animate-pulse-slow" style={{ animationDelay: '0.6s' }}></div>
    </div>
  );
};

export default ThinkingIndicator;
