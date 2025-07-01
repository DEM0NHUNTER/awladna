// front_end/src/components/chat/ChatInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory } from '../../services/api';

const ChatInterface: React.FC<{ childId: number }> = ({ childId }) => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const data = await getChatHistory(token!, childId);
      setHistory(data.slice(-10));  // Keep only last 10 messages
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);  // Poll for new messages
    return () => clearInterval(interval);
  }, [childId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") {
      console.warn("Message cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await sendMessage(token!, message, childId);
      setHistory([...history, { user: message, bot: response.response }]);
      setMessage('');
    } catch (error) {
      setHistory([...history, { user: message, bot: "Error: Could not get response" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
        {history.map((msg, index) => (
          <div key={index} className="space-y-2">
            <div className="bg-blue-100 p-2 rounded">{msg.user}</div>
            <div className="bg-gray-100 p-2 rounded">{msg.bot}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded focus:outline-none"
        />
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;