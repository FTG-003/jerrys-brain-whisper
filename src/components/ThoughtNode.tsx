
import React from 'react';
import { cn } from '@/lib/utils';

export interface Thought {
  id: string;
  name: string;
  typeId?: number;
  label?: string;
}

interface ThoughtNodeProps {
  thought: Thought;
  onClick?: (thought: Thought) => void;
  className?: string;
}

const ThoughtNode: React.FC<ThoughtNodeProps> = ({ 
  thought, 
  onClick,
  className 
}) => {
  return (
    <div 
      className={cn(
        "flex items-center p-2 rounded-md cursor-pointer transition-all duration-200",
        "hover:bg-brain-light/50 border border-transparent hover:border-brain-light",
        className
      )}
      onClick={() => onClick && onClick(thought)}
    >
      <div className="w-3 h-3 rounded-full bg-brain-primary mr-2 flex-shrink-0"></div>
      <div className="flex-1 overflow-hidden">
        <h3 className="font-medium text-brain-dark text-sm truncate">{thought.name}</h3>
        {thought.label && (
          <p className="text-xs text-gray-500 truncate">{thought.label}</p>
        )}
      </div>
    </div>
  );
};

export default ThoughtNode;
