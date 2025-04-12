
import React from 'react';

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-2 my-2">
      <div className="w-2 h-2 rounded-full bg-brain-light/50 animate-pulse-slow" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 rounded-full bg-brain-light/50 animate-pulse-slow" style={{ animationDelay: '0.3s' }}></div>
      <div className="w-2 h-2 rounded-full bg-brain-light/50 animate-pulse-slow" style={{ animationDelay: '0.6s' }}></div>
    </div>
  );
};

export default ThinkingIndicator;
