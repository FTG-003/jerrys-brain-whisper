
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
      "p-3 rounded-lg mb-3 text-sm",
      isUser 
        ? "user-message bg-gray-100 text-gray-800 ml-auto" 
        : "bot-message bg-brain-light/70 text-gray-800",
      "max-w-full",
      className
    )}>
      {content}
    </div>
  );
};

export default ChatMessage;
