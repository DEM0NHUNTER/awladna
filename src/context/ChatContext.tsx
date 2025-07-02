import React, { createContext, useContext, useState } from 'react';

export interface Message {
  id: string;
  text: string;
  fromChild: boolean;
  timestamp?: string;
}

export interface Chat {
  id: string;
  topic: string;
  messages: Message[];
  createdAt: string;
}

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  createNewChat: () => string;
  setCurrentChatId: (id: string) => void;
  addMessageToChat: (chatId: string, message: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newChat: Chat = {
      id: newId,
      topic: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newId);
    return newId;
  };

  const addMessageToChat = (chatId: string, message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        // If this is the first user message, set as topic
        let topic = chat.topic;
        if (chat.messages.length === 0 && message.fromChild) {
          topic = message.text.slice(0, 40) + (message.text.length > 40 ? '...' : '');
        }
        return {
          ...chat,
          topic,
          messages: [...chat.messages, message],
        };
      }
      return chat;
    }));
  };

  const value: ChatContextType = {
    chats,
    currentChatId,
    createNewChat,
    setCurrentChatId,
    addMessageToChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}; 