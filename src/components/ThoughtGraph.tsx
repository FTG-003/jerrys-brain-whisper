
import React, { useEffect, useRef } from 'react';
import { ThoughtNode } from '@/services/brainApi';

interface ThoughtGraphProps {
  centralThought: ThoughtNode;
  relatedThoughts: ThoughtNode[];
  onNodeClick?: (thought: ThoughtNode) => void;
  className?: string;
}

const ThoughtGraph: React.FC<ThoughtGraphProps> = ({
  centralThought,
  relatedThoughts,
  onNodeClick,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !centralThought || !relatedThoughts.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas width and height to match its display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate center position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    // Draw lines from center to each related thought
    ctx.strokeStyle = '#c7d2fe'; // Light indigo color
    ctx.lineWidth = 2;

    // Draw central node
    ctx.fillStyle = '#6366f1'; // Indigo
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fill();

    // Draw related thought nodes in a circle around the central node
    const sliceAngle = (Math.PI * 2) / relatedThoughts.length;
    
    relatedThoughts.forEach((_, index) => {
      const angle = index * sliceAngle;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Draw line from center to node
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Draw node
      ctx.fillStyle = '#818cf8'; // Lighter indigo
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add text for central node
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Truncate text if too long
    const centralText = centralThought.name.length > 10 
      ? centralThought.name.substring(0, 10) + '...'
      : centralThought.name;
    ctx.fillText(centralText, centerX, centerY);

    // Add interactions - this is just visual, actual click handling happens elsewhere
  }, [centralThought, relatedThoughts]);

  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
      />
    </div>
  );
};

export default ThoughtGraph;
