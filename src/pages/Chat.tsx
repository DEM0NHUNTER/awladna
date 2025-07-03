// src/pages/Chat.tsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, SendHorizonal } from "lucide-react";
import  Input  from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

interface Message {
  role: "parent" | "assistant";
  content: string;
  timestamp?: string;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://your-api-domain/ws/chat"); // 🔁 Replace with actual endpoint
    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      setLoading(false);
    };
    ws.onerror = (err) => console.error("WebSocket error", err);
    ws.onclose = () => console.warn("WebSocket closed");

    setSocket(ws);
    return () => ws.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    const newMessage: Message = {
      role: "parent",
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.send(JSON.stringify({ message: input }));
    setInput("");
    setLoading(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <div className="p-4 border-b font-semibold text-lg flex items-center gap-2">
        <MessageSquare className="text-indigo-600" /> Parenting Chat
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "parent" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-xs md:max-w-md rounded-xl p-3 text-sm whitespace-pre-wrap ${
              msg.role === "parent"
                ? "bg-indigo-100 text-right"
                : "bg-gray-100 text-left"
            }`}
            >
              <p className="font-semibold mb-1">
                {msg.role === "parent" ? user?.name || "You" : "Awladna AI"}
              </p>
              <p>{msg.content}</p>
              {msg.timestamp && (
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md rounded-xl p-3 bg-gray-100">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something about your child..."
        />
        <Button onClick={sendMessage} disabled={!input.trim() || loading}>
          <SendHorizonal size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
