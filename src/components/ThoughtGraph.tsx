import React, { useEffect, useRef, useState } from 'react';
import { ThoughtNode } from '@/services/brainTypes';

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
  const [hoveredNode, setHoveredNode] = useState<ThoughtNode | null>(null);
  const nodePositions = useRef<Map<string, {x: number, y: number, radius: number}>>(new Map());

  useEffect(() => {
    if (!canvasRef.current || !centralThought || !relatedThoughts.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    nodePositions.current.set(centralThought.id, {
      x: centerX,
      y: centerY,
      radius: 35
    });

    ctx.strokeStyle = '#c7d2fe';
    ctx.lineWidth = 2;

    const sliceAngle = (Math.PI * 2) / relatedThoughts.length;
    
    relatedThoughts.forEach((thought, index) => {
      const angle = index * sliceAngle;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      nodePositions.current.set(thought.id, {
        x: x,
        y: y,
        radius: 25
      });
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    drawNodes(ctx, hoveredNode);

  }, [centralThought, relatedThoughts, hoveredNode]);

  const drawNodes = (ctx: CanvasRenderingContext2D, hoveredNode: ThoughtNode | null) => {
    const centralPos = nodePositions.current.get(centralThought.id);
    if (centralPos) {
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(centralPos.x, centralPos.y, centralPos.radius, 0, Math.PI * 2);
      ctx.fill();

      const gradient = ctx.createRadialGradient(
        centralPos.x, centralPos.y, 0,
        centralPos.x, centralPos.y, centralPos.radius
      );
      gradient.addColorStop(0, '#818cf8');
      gradient.addColorStop(1, '#4338ca');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centralPos.x, centralPos.y, centralPos.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centralText = centralThought.name.length > 18
        ? centralThought.name.substring(0, 18) + '...'
        : centralThought.name;
      ctx.fillText(centralText, centralPos.x, centralPos.y);
    }

    relatedThoughts.forEach((thought) => {
      const pos = nodePositions.current.get(thought.id);
      if (pos) {
        const isHovered = hoveredNode && hoveredNode.id === thought.id;
        
        const gradient = ctx.createRadialGradient(
          pos.x, pos.y, 0,
          pos.x, pos.y, pos.radius
        );
        gradient.addColorStop(0, isHovered ? '#a5b4fc' : '#818cf8');
        gradient.addColorStop(1, isHovered ? '#6366f1' : '#4f46e5');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isHovered ? pos.radius * 1.1 : pos.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = isHovered ? 'bold 13px Arial' : '13px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const nodeText = thought.name.length > 12
          ? thought.name.substring(0, 12) + '...'
          : thought.name;
        ctx.fillText(nodeText, pos.x, pos.y);
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    let hovered: ThoughtNode | null = null;
    
    for (const thought of relatedThoughts) {
      const pos = nodePositions.current.get(thought.id);
      if (pos) {
        const distance = Math.sqrt(
          Math.pow(mouseX - pos.x, 2) + Math.pow(mouseY - pos.y, 2)
        );
        if (distance <= pos.radius) {
          hovered = thought;
          break;
        }
      }
    }
    
    if (!hovered) {
      const centralPos = nodePositions.current.get(centralThought.id);
      if (centralPos) {
        const distance = Math.sqrt(
          Math.pow(mouseX - centralPos.x, 2) + Math.pow(mouseY - centralPos.y, 2)
        );
        if (distance <= centralPos.radius) {
          hovered = centralThought;
        }
      }
    }
    
    setHoveredNode(hovered);
    
    canvasRef.current.style.cursor = hovered ? 'pointer' : 'default';
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredNode && onNodeClick) {
      onNodeClick(hoveredNode);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  );
};

export default ThoughtGraph;
