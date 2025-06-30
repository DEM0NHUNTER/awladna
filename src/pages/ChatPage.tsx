import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatPage = () => {
  const { child_id } = useParams<{ child_id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { token } = useAuthStore();

  useEffect(() => {
    if (!child_id) return;
    apiClient.get(`/api/chat/history?child_id=${child_id}`)
      .then(({ data }) => setMessages(data))
      .catch(console.error);
  }, [child_id]);

  const sendMessage = async () => {
    if (!child_id || !input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const { data } = await apiClient.post('/api/chat', {
        message: input,
        child_id: parseInt(child_id)
      });
      setMessages([...messages, newMessage, { ...data.response, sender: 'ai' }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="h-[600px] overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id}
            className={`p-3 rounded-lg max-w-md ${
              msg.sender === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-200 text-gray-800'
            }`}
          >
            <p>{msg.text}</p>
            <small className="block text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;