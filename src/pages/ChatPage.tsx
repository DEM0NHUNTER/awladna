import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { sendMessage, getChatHistory } from "@/services/chat";
import { useChildProfiles } from "@/hooks/useChildProfile";
import apiClient from "@/services/api";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  fromChild: boolean;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const { token } = useAuth();
  const { profiles, loading: profilesLoading } = useChildProfiles();
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch chat history when child is selected
  useEffect(() => {
    if (!selectedChild) return;

    const fetchHistory = async () => {
      try {
        const response = await apiClient.get(`/chat/history/${selectedChild}`);
        // Decrypt messages if needed
        const decryptedHistory = response.data.map((log: any) => ({
          id: log.id,
          text: log.user_input, // Adjust based on backend response structure
          fromChild: false,
          timestamp: log.timestamp
        }));
        setMessages(decryptedHistory);
      } catch (err) {
        setError("Failed to load chat history");
      }
    };

    fetchHistory();
  }, [selectedChild]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages (every 3 seconds)
  useEffect(() => {
    if (!selectedChild) return;

    const interval = setInterval(async () => {
      try {
        const newHistory = await getChatHistory(token!, selectedChild);
        if (newHistory.length > messages.length) {
          setMessages(newHistory.map((log: any) => ({
            id: log.id,
            text: log.user_input,
            fromChild: false,
            timestamp: log.timestamp
          })));
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedChild, messages.length]);

  const handleSendMessage = async () => {
    if (!selectedChild || !message.trim()) return;

    setLoading(true);
    try {
      // Send message to backend
      const response = await sendMessage(token!, message, selectedChild);

      // Add AI response to chat
      setMessages(prev => [...prev,
        {
          id: response.id,
          text: message,
          fromChild: false,
          timestamp: new Date().toISOString()
        },
        {
          id: `ai-${response.id}`,
          text: response.response,
          fromChild: true,
          timestamp: new Date().toISOString()
        }
      ]);

      setMessage("");
    } catch (err) {
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (profilesLoading) {
    return <div className="p-8">Loading child profiles...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Parenting AI Chat</h1>
          <select
            onChange={(e) => setSelectedChild(Number(e.target.value))}
            className="mt-2 p-2 border border-gray-300 rounded"
            value={selectedChild || ""}
          >
            <option value="">Select a child</option>
            {profiles.map(profile => (
              <option key={profile.child_id} value={profile.child_id}>
                {profile.name} ({profile.age} years)
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Chat History */}
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No messages yet. Start a conversation with your AI assistant!
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.fromChild ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-md p-4 rounded-lg ${
                      msg.fromChild
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <small className="block mt-1 text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white shadow-inner">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedChild}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !selectedChild}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;