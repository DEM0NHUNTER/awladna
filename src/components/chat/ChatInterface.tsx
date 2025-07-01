import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { sendMessage, getChatHistory } from "@/services/chat";
import { useChildProfiles } from "@/hooks/useChildProfiles";

const ChatInterface = ({ childId }) => {
  const { token } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { profiles } = useChildProfiles();

  const child = profiles.find(p => p.id === childId);

  const sendMessageToAI = async () => {
    if (!message.trim()) return;

    try {
      const response = await sendMessage(token, message, childId);
      setMessages([...messages, response]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Load chat history from real API
  useEffect(() => {
    getChatHistory(token, childId).then(setMessages);
  }, [childId]);

  return (
    <div className="chat-container">
      {messages.map(msg => (
        <div key={msg.id} className={msg.fromChild ? "user-message" : "ai-message"}>
          {msg.text}
        </div>
      ))}

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Ask ${child?.name}'s AI`}
        />
        <button onClick={sendMessageToAI}>Send</button>
      </div>
    </div>
  );
};