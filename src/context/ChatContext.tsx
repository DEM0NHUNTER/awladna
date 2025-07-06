// src/context/ChatContext.tsx
import React, { createContext, useContext, useState } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  fromChild: boolean;
  timestamp: string;
  sentiment?: string;
  sentiment_score?: number;
  suggestions?: string[];
}

export interface Chat {
  id: string;
  childId: number;
  childName: string;
  childAge: number;
  messages: ChatMessage[];
}

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  addMessageToChat: (chatId: string, message: ChatMessage) => void;
  createNewChat: (childId: number, childName: string, childAge: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const addMessageToChat = (chatId: string, message: ChatMessage) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat
      )
    );
  };

  const createNewChat = (childId: number, childName: string, childAge: number) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      childId,
      childName,
      childAge,
      messages: [],
    };
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  return (
    <ChatContext.Provider value={{ chats, currentChatId, setCurrentChatId, addMessageToChat, createNewChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;