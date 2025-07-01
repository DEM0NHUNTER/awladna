import React from 'react';

interface MessageInputProps {
  input: string;
  setInput: (val: string) => void;
  sendMessage: () => void;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  dimmed?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ input, setInput, sendMessage, isTyping, inputRef, dimmed }) => (
  <div className="w-full px-0 md:px-8 pb-6">
    <div className="max-w-4xl mx-auto">
      <div className={`flex items-center rounded-full border border-gray-200 px-4 py-2 gap-2 ${dimmed ? 'bg-transparent shadow-none' : 'bg-white shadow-lg'}`}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-base px-2 py-3 rounded-full focus:ring-0"
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={isTyping}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className="w-12 h-12 bg-gradient-to-r from-[#000080] to-[#000080]/90 text-white rounded-full flex items-center justify-center hover:from-[#000080]/90 hover:to-[#000080] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 send-button"
          aria-label="Send message"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export default MessageInput;