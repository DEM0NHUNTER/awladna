// src/pages/Chat.tsx
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '@/api/axiosInstance';
import Sidebar from '@/components/layout/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface Message {
  id: string;
  user_input?: string;
  chatbot_response?: string;
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
  const childIdNum = Number(childId);
  if (!childId || isNaN(childIdNum)) {
      // Gracefully redirect to profile instead
     return <Navigate to="/profile" replace />;
  }
  const { user } = useAuth();
  const [childInfo, setChildInfo] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!childId || isNaN(childIdNum)) {
          navigate('/profile'); // 👈 Send to child profile creation page
        }
      }, [childId, childIdNum, navigate]);

    if (!childId || isNaN(childIdNum)) return null;
    useEffect(() => {
      const fetchChildInfo = async () => {
        try {
          const res = await axiosInstance.get(`/auth/child/${childIdNum}`);
          setChildInfo(res.data);
        } catch (err) {
          console.error("Failed to fetch child info", err);
        }
      };
      fetchChildInfo();
    }, [childIdNum]);
    // Scroll to bottom on new messages
    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      const controller = new AbortController();

    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/auth/chat/history/${childIdNum}?limit=100`, {
          signal: controller.signal
        });
        const data = res.data as any[];
        setMessages(
          data.map(item => ({
            id: item.timestamp ?? Math.random().toString(),
            text: item.chatbot_response ?? item.user_input,
            fromChild: Boolean(item.user_input)
          }))
        );
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error(err);
          setError("Failed to load chat history.");
        }
      }
    };

      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);

      return () => {
        clearInterval(interval);
        controller.abort();
      };
    }, [childIdNum]);

    // Send message function
    const sendMessage = async () => {
      if (!input.trim()) return;

      const tempMessage: Message = {
        id: Date.now().toString(),
        text: input,
        fromChild: true
      };
      setMessages(prev => [...prev, tempMessage]);
      setInput('');
      setIsLoading(true);
      try {
        const response = await axiosInstance.post('/auth/chat', {
          child_id: childIdNum,
          message: tempMessage.text,
          context: null
        });
        const aiMessage: Message = {
          id: Date.now().toString() + "-ai",
          text: response.data.response,
          fromChild: false
        };
        setMessages(prev => [...prev, aiMessage]); // ✅ Add this line
      } catch (err) {
        console.error(err);
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
