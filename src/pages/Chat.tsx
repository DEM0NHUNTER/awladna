// src/pages/Chat.tsx
import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/layout/Sidebar";
import MessageInput from "../components/chat/MessageInput";
import { useChatContext } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { fetchChatResponse } from "../api/chat";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/common/LoadingSpinner";

interface Child {
  child_id: number;
  name: string;
  birth_date: string;
  gender: string;
  behavioral_patterns: Record<string, any>;
  emotional_state: Record<string, any>;
}

const Chat: React.FC = () => {
  const { token } = useAuth();
  const {
    chats,
    currentChatId,
    currentChild,
    setCurrentChild,
    setCurrentChatId,
    addMessageToChat,
    createNewChat,
  } = useChatContext();

  const [children, setChildren] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  useEffect(() => {
    const fetchChildren = async () => {
      setLoadingChildren(true);
      try {
        const res = await fetch('/api/auth/child/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setChildren(data);
        } else {
          console.warn("Unexpected child response:", data);
          setChildren([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch child profiles.");
      } finally {
        setLoadingChildren(false);
      }
    };

    if (token) fetchChildren();
  }, [token]);

  const calculateAge = (birthDate: string) => {
    const dob = new Date(birthDate);
    const diff = Date.now() - dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const handleChildSelect = (childId: number) => {
    const child = children.find(c => c.child_id === childId);
    if (!child) return;

    const age = calculateAge(child.birth_date);
    setCurrentChild({ id: child.child_id, name: child.name, age });
    createNewChat();
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentChatId || !currentChat) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      fromChild: true,
      timestamp: new Date().toISOString(),
    };

    addMessageToChat(currentChatId, userMessage);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const aiData = await fetchChatResponse({
        user_input: userMessage.text,
        child_id: currentChat.childId,
        child_age: currentChat.childAge,
        child_name: currentChat.childName,
      });

      const aiMessage = {
        id: `${Date.now()}_ai`,
        text: aiData.response,
        fromChild: false,
        timestamp: new Date().toISOString(),
        sentiment: aiData.sentiment,
        sentiment_score: aiData.sentiment_score,
        suggestions: aiData.suggested_actions,
      };

      addMessageToChat(currentChatId, aiMessage);
    } catch (err: any) {
      console.error(err);
      setError("Failed to get AI response.");
    } finally {
      setIsTyping(false);
    }
  };

  const playTTS = async (messageId: string, text: string) => {
    setPlayingMessageId(messageId);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS request failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audioEl = new Audio(url);
      setAudio(audioEl);
      audioEl.play();
      audioEl.onended = () => {
        setPlayingMessageId(null);
        setAudio(null);
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      setPlayingMessageId(null);
      setError("TTS playback failed.");
    }
  };

  useEffect(() => {
    return () => {
      audio?.pause();
      setAudio(null);
    };
  }, [audio]);

  return (
    <div className={`min-h-screen flex flex-row ${isRTL ? 'flex-row-reverse' : ''}`}>
      <aside className={`hidden md:flex fixed top-0 h-full w-64 z-30 bg-[#000080] text-white ${isRTL ? 'right-0' : 'left-0'}`}>
        <Sidebar />
      </aside>

      <main className={`flex-1 min-h-screen pt-[64px] pb-4 bg-gray-50 ${isRTL ? 'md:mr-64' : 'md:ml-64'}`}>
        {/* Header */}
        <div className="flex justify-between items-center bg-white px-4 py-3 shadow-sm sticky top-[64px] z-40 border-b">
          <h1 className="text-lg font-semibold text-gray-800">{t('chat', 'Chat')}</h1>
          {loadingChildren ? (
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          ) : (
            <select
              className="px-3 py-2 border rounded text-sm"
              value={currentChild?.id || ""}
              onChange={(e) => handleChildSelect(Number(e.target.value))}
            >
              <option value="">{t('selectChild', 'Select a child')}</option>
              {children.map(child => (
                <option key={child.child_id} value={child.child_id}>
                  {child.name} (age {calculateAge(child.birth_date)})
                </option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex flex-col space-y-3 px-4 py-2 max-w-screen-md mx-auto">
          {!currentChat && !loadingChildren && (
            <div className="text-center text-gray-500 mt-10">{t('noChat', 'Start a conversation by selecting a child.')}</div>
          )}

          {currentChat?.messages.map((msg, idx) => (
            <div key={msg.id} className={`flex ${msg.fromChild ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] md:max-w-md ${msg.fromChild ? 'order-2' : 'order-1'}`}>
                <div className={`px-4 py-3 rounded-xl shadow-sm ${
                  msg.fromChild
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs mt-1 text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                  {msg.sentiment && <p className="text-xs text-blue-600 mt-1">Sentiment: {msg.sentiment}</p>}
                  {msg.suggestions?.length > 0 && (
                    <ul className="text-xs text-blue-700 mt-1 list-disc ml-5">
                      {msg.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  )}
                  {!msg.fromChild && (
                    <button
                      className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      onClick={() => playTTS(msg.id, msg.text)}
                      disabled={playingMessageId === msg.id}
                    >
                      {playingMessageId === msg.id ? (
                        <LoadingSpinner size={16} />
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 4l12 6-12 6V4z" />
                          </svg>
                          Play
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {currentChat && (
          <div className="sticky bottom-0 bg-gray-50 z-50 max-w-screen-md mx-auto px-4 py-2">
            <MessageInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              isTyping={isTyping}
              inputRef={inputRef}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;
