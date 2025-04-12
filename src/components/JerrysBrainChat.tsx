
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ThoughtNode, { Thought } from './ThoughtNode';
import ThinkingIndicator from './ThinkingIndicator';
import ThoughtGraph from './ThoughtGraph';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { searchThoughts, getRelatedThoughts, getThought, ThoughtNode as ApiThoughtNode } from '@/services/brainApi';
import {
  generateWelcomeMessage,
  generateSearchResponse,
  generateThoughtExplorationResponse,
  generateErrorMessage
} from '@/utils/responseCraft';
import { Search, BrainCog, ZoomIn, ZoomOut, Info } from 'lucide-react';

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
  const [showChat, setShowChat] = useState<boolean>(false);
  const [graphZoom, setGraphZoom] = useState<number>(1);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Show thinking indicator
    setIsThinking(true);
    setThoughtResults(null);
    
    try {
      // Search for thoughts related to the user's query
      const searchResult = await searchThoughts(userMessage);
      
      let botResponseContent = '';
      let thoughtResult: ThoughtResult = { relatedThoughts: [] };
      
      if (searchResult.thoughts.length > 0) {
        // Generate response based on search results
        botResponseContent = generateSearchResponse(userMessage, searchResult.thoughts);
        
        // Store the thought results for display
        thoughtResult = {
          relatedThoughts: searchResult.thoughts
        };
      } else {
        botResponseContent = generateSearchResponse(userMessage, []);
      }
      
      // Add bot response to chat
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponseContent,
        isUser: false
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setThoughtResults(thoughtResult);
      
      // Automatically show chat when new results arrive
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
      // Fetch the thought and its relations
      const [thoughtDetails, relatedThoughts] = await Promise.all([
        getThought(thought.id),
        getRelatedThoughts(thought.id)
      ]);
      
      // Generate response based on the thought and its relations
      const botResponseContent = generateThoughtExplorationResponse(
        thoughtDetails, 
        relatedThoughts
      );
      
      // Add the response to the chat
      const newBotMessage: Message = {
        id: Date.now().toString(),
        content: botResponseContent,
        isUser: false
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      
      // Update thought results for display
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
      <div className="bg-brain-primary text-white py-3 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <BrainCog className="mr-2 h-6 w-6" />
          <h1 className="text-xl font-semibold">Jerry's Brain Explorer</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={toggleChat}
          >
            <Info className="h-5 w-5" />
            <span className="ml-1">{showChat ? 'Hide Info' : 'Show Info'}</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden bg-brain-background">
        {/* Main visualization area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Graph controls */}
          <div className="bg-white/50 backdrop-blur-sm p-2 flex justify-between items-center border-b border-brain-light">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleZoomIn}
                className="bg-white hover:bg-brain-light"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleZoomOut}
                className="bg-white hover:bg-brain-light"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {thoughtResults?.mainThought 
                ? `Exploring: ${thoughtResults.mainThought.name}` 
                : 'Search for a concept to begin'}
            </div>
          </div>
          
          {/* Main graph visualization */}
          <div className="flex-1 overflow-hidden bg-gradient-to-b from-brain-background to-white/90">
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
              <div className="flex items-center justify-center h-full text-gray-400 flex-col">
                <BrainCog className="h-16 w-16 mb-4 text-brain-light" />
                <p>Search for a concept in Jerry's Brain</p>
              </div>
            )}
          </div>
          
          {/* Search bar */}
          <div className="bg-white p-4 border-t border-gray-200">
            <div className="max-w-4xl mx-auto flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search Jerry's Brain (e.g. trust, capitalism, AI)..."
                className="flex-1"
                disabled={isThinking}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isThinking}
                className="bg-brain-primary hover:bg-brain-dark"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Chat sidebar */}
        <div className={`w-1/3 max-w-md border-l border-brain-light bg-white/90 backdrop-blur-sm overflow-hidden transition-all duration-300 ease-in-out ${showChat ? '' : 'w-0 max-w-0 border-l-0'}`}>
          {showChat && (
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-brain-light bg-gray-50">
                <h2 className="font-medium text-brain-dark">Thoughts & Connections</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map(message => (
                  <ChatMessage
                    key={message.id}
                    content={message.content}
                    isUser={message.isUser}
                    className={message.isUser ? "bg-gray-100 ml-auto" : "bg-brain-light"}
                  />
                ))}
                {isThinking && (
                  <ChatMessage
                    content={<ThinkingIndicator />}
                    isUser={false}
                  />
                )}
                <div ref={endOfMessagesRef} />
              </div>
              
              {/* Related thoughts in sidebar */}
              {thoughtResults && thoughtResults.relatedThoughts.length > 0 && (
                <div className="p-4 border-t border-brain-light bg-gray-50">
                  <h3 className="text-sm font-medium mb-2 text-brain-dark">Related Thoughts</h3>
                  <div className="max-h-60 overflow-y-auto">
                    {thoughtResults.relatedThoughts.map(thought => (
                      <ThoughtNode
                        key={thought.id}
                        thought={thought}
                        onClick={handleThoughtClick}
                        className="mb-2"
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
