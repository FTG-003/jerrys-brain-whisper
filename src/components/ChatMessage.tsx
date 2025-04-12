
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
      "p-3 rounded-lg mb-3 text-sm transition-colors",
      isUser 
        ? "user-message ml-auto" 
        : "bot-message",
      "max-w-full text-white",
      className
    )}>
      {content}
    </div>
  );
};

export default ChatMessage;
