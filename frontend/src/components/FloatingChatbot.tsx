import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { queryKnowledgeBase } from '../api';
import { eventBus } from '../events';
import '../index.css';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
     const openChatHandler = (data: { message?: string } = {}) => {
         setIsOpen(true);
         if (data.message) {
             setInputText(data.message);
         }
     };

     eventBus.on('chat:open', openChatHandler);

     return () => {
         eventBus.off('chat:open', openChatHandler);
     };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, sender: 'user' as const };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await queryKnowledgeBase(userMessage.text);
      setMessages((prev) => [...prev, { text: response.answer, sender: 'bot' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Sorry, I couldn't reach the server.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Gym Assistant</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="message bot">Typing...</div>}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about equipment..."
            />
            <button onClick={handleSend} disabled={isLoading}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
