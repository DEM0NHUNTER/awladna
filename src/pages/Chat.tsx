// src/pages/ChatPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from "@/api/axiosInstance";
import LogoutButton from '../components/auth/LogoutButton';
import Sidebar from '../components/layout/Sidebar';
import { useParams } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  fromChild: boolean;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { childId } = useParams<{ childId: string }>();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = () => {
      apiClient.get('/api/auth/chat/history/1?limit=100')
        .then(res => setMessages(res.data))
        .catch(console.error);
    };

    fetchMessages();
    const interval = window.setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

    const sendMessage = async () => {
      if (!input.trim()) return;
      const payload = {
        child_id: 1,
        message: input,
        context: null
      };
      await apiClient.post('/api/auth/chat', payload); // Sends to backend
      setInput('');
    };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar */}
      <Sidebar childId={childId} />

      <div className="flex flex-col flex-1 h-full">


        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex ${m.fromChild ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-2 rounded-xl shadow ${
                m.fromChild
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white p-4 flex items-center space-x-2 border-t border-gray-300">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-r-md transition hover:bg-blue-700 disabled:opacity-50"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
