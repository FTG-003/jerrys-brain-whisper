
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
import { Send, BrainCog } from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-brain-primary text-white py-4 px-6 flex items-center">
        <BrainCog className="mr-2 h-6 w-6" />
        <h1 className="text-xl font-semibold">Jerry's Brain Whisper</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-4">
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                content={message.content}
                isUser={message.isUser}
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
          
          {/* Thought results */}
          {thoughtResults && thoughtResults.relatedThoughts.length > 0 && (
            <Card className="mb-6 border-brain-light">
              <CardContent className="p-4">
                <h2 className="text-lg font-medium mb-3 text-brain-dark">
                  {thoughtResults.mainThought 
                    ? `Connections to "${thoughtResults.mainThought.name}"` 
                    : "Related Thoughts"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {thoughtResults.relatedThoughts.map(thought => (
                    <ThoughtNode
                      key={thought.id}
                      thought={thought}
                      onClick={handleThoughtClick}
                    />
                  ))}
                </div>
                
                {/* Simple visualization */}
                {thoughtResults.mainThought && (
                  <div className="mt-6">
                    <h3 className="text-md font-medium mb-2 text-brain-dark">Thought Map</h3>
                    <ThoughtGraph
                      centralThought={thoughtResults.mainThought}
                      relatedThoughts={thoughtResults.relatedThoughts.slice(0, 8)}
                      className="h-60 border rounded-lg border-brain-light"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about any concept in Jerry's Brain..."
              className="flex-1"
              disabled={isThinking}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isThinking}
              className="bg-brain-primary hover:bg-brain-dark"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JerrysBrainChat;
