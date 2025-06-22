// src/pages/ChatPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '@/api/axiosInstance';
import Sidebar from '@/components/layout/Sidebar';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  user_input?: string;
  chatbot_response?: string;
  text: string;
  fromChild: boolean;
}

const ChatPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const childIdNum = Number(childId) || 1;
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch and refresh chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/auth/chat/history/${childIdNum}?limit=100`);
        const data = res.data as any[];
        setMessages(
          data.map(item => ({
            id: item.timestamp ?? Math.random().toString(),
            text: item.chatbot_response ?? item.user_input,
            fromChild: Boolean(item.user_input),
          }))
        );
      } catch (err) {
        console.error(err);
        setError('Failed to load chat history. Please try again.');
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [childIdNum]);

  // Send new message
  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await axiosInstance.post('/auth/chat', {
        child_id: childIdNum,
        message: input,
        context: null
      });
      setInput('');
    } catch (err) {
      console.error(err);
      setError('Failed to send message.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar childId={childIdNum.toString()} />

      <div className="flex flex-col flex-1">
        <header className="bg-white shadow px-6 py-4 flex justify-between">
          <h2 className="text-xl font-semibold">
            Chat with AI{user?.email ? ` — ${user.email}` : ''}
          </h2>
        </header>

        {error && <div className="text-red-600 p-4">{error}</div>}

        <div className="flex-1 overflow-auto p-6 space-y-4 bg-gray-50">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex ${m.fromChild ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-xl shadow ${
                  m.fromChild
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
              >
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
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
