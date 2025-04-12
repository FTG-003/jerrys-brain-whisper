
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: React.ReactNode;
  isUser?: boolean;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  content, 
  isUser = false,
  className
}) => {
  return (
    <div className={cn(
      isUser ? 'user-message' : 'bot-message',
      className
    )}>
      {content}
    </div>
  );
};

export default ChatMessage;
