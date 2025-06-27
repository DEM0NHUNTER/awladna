import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "@/api/axiosInstance";
import { motion } from "framer-motion";

interface Message {
  id: string;
  text: string;
  fromUser: boolean;
}

const getFollowUpQuestion = () => {
  const questions = [
    "How did your child respond to this?",
    "Would you like more ideas?",
    "Was this advice helpful?",
    "Do you want to try a different approach?",
    "Want to explore this topic more?"
  ];
  return questions[Math.floor(Math.random() * questions.length)];
};

const ChatInterface: React.FC<{ childId: number }> = ({ childId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUpQueue, setFollowUpQueue] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Polling chat history (simulate real-time updates)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get(`/auth/chat/history/${childId}`);
        const formatted = res.data.map((m: any) => ({
          id: m.id || Date.now().toString(),
          text: m.chatbot_response || m.user_input,
          fromUser: !!m.user_input
        }));
        setMessages(formatted.slice(-10)); // Last 10
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, [childId]);

  // Trigger follow-up every 5 user messages
  useEffect(() => {
    const userMessages = messages.filter(m => m.fromUser).length;
    if (userMessages > 0 && userMessages % 5 === 0) {
      setFollowUpQueue(prev => [...prev, getFollowUpQuestion()]);
    }
  }, [messages]);

  const sendMessage = async (message: string, isFollowUp: boolean = false) => {
    const userMessage: Message = { id: Date.now().toString(), text: message, fromUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/chat/", {
        child_id: childId,
        message,
        context: isFollowUp ? "follow_up" : undefined,
      });

      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        text: res.data.response,
        fromUser: false
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: `${Date.now()}-err`, text: "⚠️ AI failed to respond.", fromUser: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 text-sm">
        {messages.map((m, index) => (
          <motion.div
            key={m.id + index}
            initial={{ opacity: 0, x: m.fromUser ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-md px-4 py-2 rounded shadow ${
              m.fromUser ? "bg-blue-100 self-end" : "bg-white self-start"
            }`}
          >
            {m.text}
          </motion.div>
        ))}

        {/* Follow-up buttons */}
        {followUpQueue.map((question, idx) => (
          <div key={`follow-${idx}`} className="bg-yellow-100 p-2 rounded self-start">
            <p>{question}</p>
            <button
              className="mt-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              onClick={() => sendMessage(question, true)}
            >
              Ask
            </button>
          </div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 italic"
          >
            AI is thinking...
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
