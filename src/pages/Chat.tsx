//src/pages/Chat.tsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";
import axiosInstance from "../api/axiosInstance";
import { Message, ChildProfile } from "../types/chat";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Send } from "lucide-react";

const Chat: React.FC = () => {
  const { children } = useAuth();
  const { chats, setChats } = useChatContext();

  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const selectedChild: ChildProfile | undefined = children.find(c => c.child_id === selectedChildId);

  useEffect(() => {
    if (selectedChildId) {
      fetchChatHistory(selectedChildId);
    } else {
      setChats([]);
    }
  }, [selectedChildId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const fetchChatHistory = async (childId: number) => {
    try {
      const res = await axiosInstance.get(`/chat/history/${childId}`);
      const pastMessages: Message[] = res.data.map((msg: any) => ({
        role: "assistant",
        content: msg.response,
        timestamp: msg.timestamp,
      }));
      setChats(pastMessages);
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChats(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/chat/", {
        message,
        child_id: selectedChildId,
        context: `This conversation is about ${selectedChild?.name || "your child"}.`,
      });

      const aiMessage: Message = {
        role: "assistant",
        content: res.data?.response || "No reply received.",
        timestamp: res.data?.timestamp || new Date().toISOString(),
      };

      setChats(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Failed to send chat message", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Chat with Awladna AI</h1>

      {/* Child Selector */}
      <div className="mb-4">
        {children.length > 0 ? (
          <select
            className="p-2 border rounded-md text-gray-800"
            value={selectedChildId ?? ""}
            onChange={(e) => setSelectedChildId(Number(e.target.value))}
          >
            <option value="">Choose a child to focus on</option>
            {children.map((child) => (
              <option key={child.child_id} value={child.child_id}>
                {child.name} ({child.age}, {child.gender})
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-gray-500">
            No child profiles found.{" "}
            <a href="/profile" className="text-indigo-600 underline">Create one</a>.
          </p>
        )}
      </div>

      {/* Selected Child Info */}
      {selectedChild && (
        <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded mb-4">
          <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-white font-bold uppercase">
            {selectedChild.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{selectedChild.name}</p>
            <p className="text-sm text-gray-600">
              Age {selectedChild.age}, {selectedChild.gender}
            </p>
          </div>
        </div>
      )}

      {/* Chat Bubbles */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
        {chats.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xl ${msg.role === "user" ? "ml-auto text-right" : "text-left"}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-indigo-500 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.content}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 flex gap-2"
      >
        <Input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !message.trim()}>
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
