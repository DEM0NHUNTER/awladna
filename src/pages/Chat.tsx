import React, { useEffect, useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";

import Sidebar from "@/components/layout/Sidebar";
import RecommendationPanel from "@/components/Recommendations/RecommendationPanel";

interface Message {
  id: string;
  text: string;
  fromUser: boolean;
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

  const [activeTab, setActiveTab] = useState<"chat" | "recommendations">("chat");
  const [childInfo, setChildInfo] = useState<ChildProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!childId || isNaN(childIdNum)) {
    return <Navigate to="/profile" replace />;
  }

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch child profile info
  useEffect(() => {
    const fetchChildInfo = async () => {
      try {
        const res = await axiosInstance.get(`/auth/child/${childIdNum}`);
        setChildInfo(res.data);
      } catch (err: any) {
        console.error("Failed to fetch child info", err.response?.data ?? err);
        setError("Could not load child profile.");
      }
    };
    fetchChildInfo();
  }, [childIdNum]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input;

    setMessages((prev) => [...prev, { id: Date.now().toString(), text, fromUser: true }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post('/auth/chat/', {
        child_id: childIdNum,
        message: text,
      });
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-ai`, text: res.data.response, fromUser: false },
      ]);
    } catch (err: any) {
      console.error('Send error', err.response?.data ?? err);
      setError("Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex h-screen">
        <Sidebar childId={childIdNum.toString()} />

        <div className="flex flex-col flex-1">
          {/* Header with tab switching */}
          <header className="bg-white/10 backdrop-blur-md shadow-lg px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/20">
            <div className="mb-2 sm:mb-0">
              <h2 className="text-xl font-bold text-white">Chat with AI</h2>
              {childInfo && (
                <p className="text-sm text-gray-300 mt-1">
                  Talking about: <strong>{childInfo.name}</strong> ({childInfo.gender}, {childInfo.age}y)
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "chat"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setActiveTab("chat")}
              >
                Chat
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "recommendations"
                    ? "bg-purple-600 text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setActiveTab("recommendations")}
              >
                Recommendations
              </motion.button>
            </div>
          </header>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border-l-4 border-red-500 text-red-200 p-3 m-4 rounded-md"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === "chat" ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-auto p-6 space-y-4 bg-gray-900/70"
              >
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${m.fromUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl shadow-lg text-sm ${
                        m.fromUser
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                          : "bg-white/10 text-gray-200 rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-xs px-4 py-3 rounded-2xl shadow bg-white/10 text-gray-200 rounded-bl-none">
                      <span className="animate-pulse">AI is typing...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </motion.div>
            ) : (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto p-4"
              >
                <RecommendationPanel childId={childIdNum} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white/10 backdrop-blur-md p-4 flex items-center space-x-2 border-t border-white/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 border border-gray-400/50 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-r-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 rounded-full border-t-2 border-b-2 border-white"></span>
                  Sending...
                </span>
              ) : (
                "Send"
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;