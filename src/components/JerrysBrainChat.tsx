import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ThoughtNode from './ThoughtNode';
import ThinkingIndicator from './ThinkingIndicator';
import ThoughtGraph from './ThoughtGraph';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchThoughts, getRelatedThoughts, getThought } from '@/services/brainApi';
import { ThoughtNode as ApiThoughtNode } from '@/services/brainTypes';
import { 
  generateWelcomeMessage, 
  generateSearchResponse, 
  generateThoughtExplorationResponse, 
  generateErrorMessage 
} from '@/utils/responseCraft';
import { Search, BrainCog, ZoomIn, ZoomOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

interface ThoughtResult {
  mainThought?: ApiThoughtNode;
  relatedThoughts: ApiThoughtNode[];
}

const JerrysBrainChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', content: generateWelcomeMessage(), isUser: false }
  ]);
  const [input, setInput] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [thoughtResults, setThoughtResults] = useState<ThoughtResult | null>(null);
  const [showChat, setShowChat] = useState<boolean>(true);
  const [graphZoom, setGraphZoom] = useState<number>(1);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    setIsThinking(true);
    setThoughtResults(null);
    
    try {
      const searchResult = await searchThoughts(userMessage);
      
      let botResponseContent = '';
      let thoughtResult: ThoughtResult = { relatedThoughts: [] };
      
      if (searchResult.thoughts.length > 0) {
        botResponseContent = generateSearchResponse(userMessage, searchResult.thoughts);
        thoughtResult = {
          relatedThoughts: searchResult.thoughts
        };
      } else {
        botResponseContent = generateSearchResponse(userMessage, []);
      }
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponseContent,
        isUser: false
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setThoughtResults(thoughtResult);
      
      setShowChat(true);
    } catch (error) {
      console.error('Error searching thoughts:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateErrorMessage(),
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleThoughtClick = async (thought: Thought) => {
    setIsThinking(true);
    
    try {
      const [thoughtDetails, relatedThoughts] = await Promise.all([
        getThought(thought.id),
        getRelatedThoughts(thought.id)
      ]);
      
      const botResponseContent = generateThoughtExplorationResponse(
        thoughtDetails, 
        relatedThoughts
      );
      
      const newBotMessage: Message = {
        id: Date.now().toString(),
        content: botResponseContent,
        isUser: false
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      
      setThoughtResults({
        mainThought: thoughtDetails,
        relatedThoughts: relatedThoughts
      });
    } catch (error) {
      console.error('Error getting thought details:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: generateErrorMessage(),
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  
  const handleZoomIn = () => {
    setGraphZoom(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setGraphZoom(prev => Math.max(prev - 0.2, 0.6));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-brain-primary text-white py-3 px-6 flex items-center justify-between shadow-md border-b border-white/10">
        <div className="flex items-center">
          <BrainCog className="mr-2 h-6 w-6 text-brain-light animate-pulse-slow" />
          <h1 className="text-xl font-semibold">Jerry's Brain Explorer</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/10 transition-colors"
            onClick={toggleChat}
          >
            {showChat ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            <span className="ml-1">{showChat ? 'Hide Chat' : 'Show Chat'}</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden bg-gradient-to-b from-brain-primary/90 to-brain-dark">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="backdrop-blur-sm bg-white/5 border-b border-white/10 p-2 flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleZoomIn}
                className="bg-brain-dark/70 hover:bg-brain-primary border-brain-light/30 text-white"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleZoomOut}
                className="bg-brain-dark/70 hover:bg-brain-primary border-brain-light/30 text-white"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-brain-light">
              {thoughtResults?.mainThought 
                ? `Exploring: ${thoughtResults.mainThought.name}` 
                : 'Search for a concept to begin'}
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden bg-gradient-to-b from-brain-dark to-brain-primary/70">
            {thoughtResults?.mainThought ? (
              <div 
                className="w-full h-full" 
                style={{ transform: `scale(${graphZoom})`, transformOrigin: 'center' }}
              >
                <ThoughtGraph
                  centralThought={thoughtResults.mainThought}
                  relatedThoughts={thoughtResults.relatedThoughts.slice(0, 12)}
                  onNodeClick={handleThoughtClick}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full flex-col">
                <BrainCog className="h-20 w-20 mb-6 text-brain-light animate-pulse-slow" />
                <p className="text-brain-light text-lg mb-4">Explore Jerry's Brain</p>
                <div className="max-w-md text-center text-brain-light/70 text-sm">
                  Type a concept in the search box below to discover related thoughts and connections in Jerry's vast brain network.
                </div>
              </div>
            )}
          </div>
          
          <div className="backdrop-blur-sm bg-brain-dark/70 border-t border-white/10 p-4">
            <div className="max-w-4xl mx-auto flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search Jerry's Brain (e.g. trust, capitalism, AI)..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                disabled={isThinking}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isThinking}
                className="bg-brain-secondary hover:bg-brain-secondary/80 text-white"
              >
                {isThinking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div className={`border-l border-white/10 backdrop-blur-sm bg-brain-dark/80 overflow-hidden transition-all duration-300 ease-in-out ${showChat ? 'w-1/3 max-w-md' : 'w-0 max-w-0 border-l-0'}`}>
          {showChat && (
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-white/10 bg-brain-primary/50">
                <h2 className="font-medium text-white">Thoughts & Connections</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
                {messages.map(message => (
                  <ChatMessage
                    key={message.id}
                    content={message.content}
                    isUser={message.isUser}
                    className={message.isUser ? "bg-brain-primary/70 border border-white/10" : "bg-brain-dark/60 border border-white/5"}
                  />
                ))}
                {isThinking && (
                  <ChatMessage
                    content={<ThinkingIndicator />}
                    isUser={false}
                    className="bg-brain-dark/60 border border-white/5"
                  />
                )}
                <div ref={endOfMessagesRef} />
              </div>
              
              {thoughtResults && thoughtResults.relatedThoughts.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-brain-primary/40">
                  <h3 className="text-sm font-medium mb-2 text-brain-light">Related Thoughts</h3>
                  <div className="max-h-60 overflow-y-auto scrollbar-none">
                    {thoughtResults.relatedThoughts.map(thought => (
                      <ThoughtNode
                        key={thought.id}
                        thought={thought}
                        onClick={handleThoughtClick}
                        className="mb-2 hover:bg-white/5"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JerrysBrainChat;
