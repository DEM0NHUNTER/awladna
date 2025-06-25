// src/pages/Chat.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/api/axiosInstance';
import axios from 'axios';

import Sidebar from '@/components/layout/Sidebar';

interface Message {
  id: string;
  text: string;
  fromChild: boolean;
}

interface ChildProfile {
  name: string;
  age: number;
  gender: string;
}

const ChatPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { user } = useAuth();
  const childIdNum = Number(childId);

  const [childInfo, setChildInfo] = useState<ChildProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if no valid childId
  if (!childId || isNaN(childIdNum)) {
    return <Navigate to="/profile" replace />;
  }

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load child profile once
  useEffect(() => {
    const fetchChildInfo = async () => {
      try {
        const res = await axiosInstance.get(`/auth/child/${childIdNum}`);
        setChildInfo(res.data);
      } catch (err) {
        console.error('Failed to fetch child info', err);
      }
    };
    fetchChildInfo();
  }, [childIdNum]);

  // Poll chat history (optional; you can disable this block if you want)
  useEffect(() => {
    const controller = new AbortController();

    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get(`/auth/chat/${childIdNum}/history?limit=50`, {
          signal: controller.signal,
        });
        setMessages(
          res.data.map((item: any) => ({
            id: item.timestamp ?? Math.random().toString(),
            text: item.chatbot_response ?? item.user_input,
            fromChild: Boolean(item.user_input),
          }))
        );
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('History load error', err);
          setError('Failed to load chat history.');
        }
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [childIdNum]);

  // Send a new message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const tempMessage: Message = {
      id: Date.now().toString(),
      text: input,
      fromChild: true,
    };
    setMessages((prev) => [...prev, tempMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post(`/auth/chat/${childIdNum}`, {
        child_id: childIdNum,
        message: tempMessage.text,
      });
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: res.data.response,
        fromChild: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      // If this was a validation error, dump the Pydantic details:
      if (axios.isAxiosError(err) && err.response) {
        console.error('Server validation error:', err.response.data);
      }
      setError('Failed to send message.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar childId={childIdNum.toString()} />

      <div className="flex flex-col flex-1">
        <header className="bg-white shadow px-6 py-4 flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Chat with AI{user?.email ? ` — ${user.email}` : ''}
            </h2>
            {childInfo && (
              <p className="text-sm text-gray-600">
                Talking about: <strong>{childInfo.name}</strong> ({childInfo.gender}, {childInfo.age}y)
              </p>
            )}
          </div>
        </header>

        {error && <div className="text-red-600 p-4">{error}</div>}

        <div className="flex-1 overflow-auto p-6 space-y-4 bg-gray-50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.fromChild ? 'justify-end' : 'justify-start'}`}>
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
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs px-4 py-2 rounded-xl shadow bg-white text-gray-800 rounded-bl-none animate-pulse">
                ...typing
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white p-4 flex items-center space-x-2 border-t border-gray-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
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
