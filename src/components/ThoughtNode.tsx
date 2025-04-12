
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
      className={cn("node-card cursor-pointer mb-2", className)}
      onClick={() => onClick && onClick(thought)}
    >
      <h3 className="font-medium text-brain-dark">{thought.name}</h3>
      {thought.label && (
        <p className="text-sm text-gray-500 mt-1">{thought.label}</p>
      )}
    </div>
  );
};

export default ThoughtNode;
