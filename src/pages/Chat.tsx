// src/pages/ChatPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';                        // :contentReference[oaicite:2]{index=2}
import Sidebar from '../components/layout/Sidebar';
import MessageInput from '../components/chat/MessageInput';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ChatLogEntry {
  id: string;
  user_input: string;
  chatbot_response: string;
  timestamp: string;
}

interface Message {
  id: string;
  text: string;
  fromChild: boolean;
  timestamp?: string;
}

const ChatPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const numericChildId = Number(childId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch history (and poll)
  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      try {
        const { data } = await axiosInstance.get<ChatLogEntry[]>(
          `/chat/history/${numericChildId}`
        );                                                             // :contentReference[oaicite:3]{index=3}

        if (cancelled) return;

        // Flatten each log entry into two messages: child → AI
        const msgs: Message[] = data.flatMap((entry) => ([
          {
            id: `${entry.id}-user`,
            text: entry.user_input,
            fromChild: true,
            timestamp: entry.timestamp,
          },
          {
            id: `${entry.id}-ai`,
            text: entry.chatbot_response,
            fromChild: false,
            timestamp: entry.timestamp,
          },
        ]));

        setMessages(msgs);
      } catch (err: any) {
        console.error('Failed to fetch chat history', err);
        if (!cancelled) setError('Could not load chat history.');
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [numericChildId]);

  // Send a new message
  const sendMessage = async () => {
    if (!input.trim()) return;
    setError(null);

    const userMsg: Message = {
      id: `new-${Date.now()}`,
      text: input.trim(),
      fromChild: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await axiosInstance.post<{
        response: string;
      }>('/chat', {
        message: userMsg.text,
        child_id: numericChildId,
        context: '',        // optional: pass any extra context
      });                  // :contentReference[oaicite:4]{index=4}

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        text: data.response,
        fromChild: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Send message failed', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (ts?: string) =>
    ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-80 fixed top-0 left-0 h-full bg-gradient-to-b from-[#000080] to-[#000080]/90 shadow-xl z-30">
        <Sidebar childId={childId!} />
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-80 pt-[64px] flex flex-col">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-2 m-4 rounded">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loadingHistory ? (
            <LoadingSpinner />
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">No messages yet. Say hello!</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.fromChild ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[80%]">
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm ${
                      msg.fromChild
                        ? 'bg-gradient-to-r from-[#000080] to-[#000080]/90 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.timestamp && (
                      <div className="text-xs mt-1 text-gray-400 text-right">
                        {formatTime(msg.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="px-6 py-2 flex items-center">
            <LoadingSpinner />
            <span className="ml-2 text-gray-600">AI is typing…</span>
          </div>
        )}

        {/* Message Input */}
        <div className="sticky bottom-0 bg-gray-50 p-4 border-t">
          <MessageInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            isTyping={isTyping}
            inputRef={inputRef}
          />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
