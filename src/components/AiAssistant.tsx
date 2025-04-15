
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Sparkles, MessageCircle, X } from 'lucide-react';
import { ThoughtNode } from '@/services/brainTypes';

interface AiAssistantProps {
  currentThought?: ThoughtNode;
  relatedThoughts?: ThoughtNode[];
  onSuggestionClick?: (thoughtId: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ 
  currentThought, 
  relatedThoughts = [],
  onSuggestionClick
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [suggestions, setSuggestions] = useState<ThoughtNode[]>([]);
  
  useEffect(() => {
    if (currentThought) {
      // Generate AI messages based on current thought
      generateAiResponse(currentThought, relatedThoughts);
    } else {
      setMessage("Welcome to Jerry's Brain. Search for a concept to begin your exploration. I'll guide you through interesting connections as you explore.");
      setSuggestions([]);
    }
  }, [currentThought, relatedThoughts]);
  
  const generateAiResponse = (thought: ThoughtNode, related: ThoughtNode[]) => {
    const responses = [
      `Exploring "${thought.name}" opens up many interesting paths of thought. What aspects are you most curious about?`,
      `"${thought.name}" connects to ${related.length} other thoughts in Jerry's Brain. Each connection represents a unique relationship.`,
      `As you explore "${thought.name}", consider how these connections reflect different perspectives and dimensions of the concept.`,
      `The beauty of thought networks like Jerry's Brain is seeing how "${thought.name}" relates to seemingly unrelated ideas. Which connection surprises you most?`,
      `"${thought.name}" serves as a node in a vast web of knowledge. How might these connections inspire new ideas?`
    ];
    
    // Select a random response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setMessage(randomResponse);
    
    // Suggest up to 3 related thoughts
    if (related.length > 0) {
      const suggestedThoughts = related
        .sort(() => 0.5 - Math.random()) // Shuffle array
        .slice(0, 3); // Get first 3 elements
      setSuggestions(suggestedThoughts);
    } else {
      setSuggestions([]);
    }
  };
  
  if (!isOpen) {
    return (
      <Button 
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 flex items-center justify-center bg-brain-secondary hover:bg-brain-secondary/80 text-white shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <BrainCircuit className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-brain-dark/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between bg-brain-primary/70 px-4 py-2 border-b border-white/10">
        <div className="flex items-center">
          <BrainCircuit className="h-5 w-5 text-brain-secondary mr-2" />
          <h3 className="font-medium text-white">AI Guide</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start mb-4">
          <div className="bg-brain-secondary/20 rounded-full p-2 mr-3 mt-0.5">
            <Sparkles className="h-4 w-4 text-brain-secondary" />
          </div>
          <div className="text-white/90 text-sm leading-relaxed">{message}</div>
        </div>
        
        {suggestions.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-medium text-white/60 mb-2">Suggested paths to explore:</div>
            <div className="space-y-2">
              {suggestions.map(thought => (
                <Button
                  key={thought.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-white/10 hover:bg-white/5 text-left"
                  onClick={() => onSuggestionClick && onSuggestionClick(thought.id)}
                >
                  <MessageCircle className="h-3.5 w-3.5 mr-2 text-brain-secondary" />
                  <span className="truncate">{thought.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;
