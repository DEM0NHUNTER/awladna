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

interface CurrentChild {
  id: number;
  name: string;
  age: number;
}

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  addMessageToChat: (chatId: string, message: ChatMessage) => void;
  createNewChat: () => void;
  currentChild: CurrentChild | null;
  setCurrentChild: (child: CurrentChild | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentChild, setCurrentChild] = useState<CurrentChild | null>(null);

  const createNewChat = () => {
    if (!currentChild) return;

    const newChat: Chat = {
      id: Date.now().toString(),
      childId: currentChild.id,
      childName: currentChild.name,
      childAge: currentChild.age,
      messages: [],
    };
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  const addMessageToChat = (chatId: string, message: ChatMessage) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        setCurrentChatId,
        addMessageToChat,
        createNewChat,
        currentChild,
        setCurrentChild,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
