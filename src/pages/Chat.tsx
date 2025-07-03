import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

const SimpleChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulated bot reply
    setTimeout(() => {
      const botMsg: Message = {
        role: 'bot',
        content: `Echo: ${userMsg.content}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Simple Chat</h2>

      <div className="flex-1 overflow-y-auto bg-white p-4 rounded shadow space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded max-w-md ${
              msg.role === 'user' ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-200'
            }`}
          >
            <div>{msg.content}</div>
            <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
