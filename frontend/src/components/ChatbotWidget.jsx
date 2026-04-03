import { useState, useRef, useEffect } from 'react';
import diabetesKnowledge from '../data/diabetesKnowledge.js';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I\'m your diabetes health assistant chatbot. I can help answer questions about diabetes, symptoms, prevention, diet, and BMI.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "What is diabetes?",
    "What are diabetes symptoms?",
    "How to prevent diabetes?",
    "What is BMI?",
    "What foods are good for diabetes?",
    "What causes diabetes?",
    "Can diabetes be cured?",
    "How often should I check glucose?"
  ];

  const handleSendMessage = async (message = null) => {
    const userMessage = message || input.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { id: prev.length + 1, type: 'user', text: userMessage, timestamp: new Date() }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const response = findResponse(userMessage);
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'bot', text: response, timestamp: new Date() }]);
      setLoading(false);
    }, 1000);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const findResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Smart keyword matching
    if (lowerMessage.includes('symptom') || lowerMessage.includes('sign')) {
      return diabetesKnowledge.symptoms;
    }
    if (lowerMessage.includes('bmi') || lowerMessage.includes('body mass')) {
      return diabetesKnowledge.bmi;
    }
    if (lowerMessage.includes('prevent') || lowerMessage.includes('avoid') || lowerMessage.includes('reduce risk')) {
      return diabetesKnowledge["prevent diabetes"];
    }
    if (lowerMessage.includes('food') || lowerMessage.includes('diet') || lowerMessage.includes('eat') || lowerMessage.includes('nutrition')) {
      return diabetesKnowledge.foods;
    }
    if (lowerMessage.includes('cause') || lowerMessage.includes('why') || lowerMessage.includes('risk factor')) {
      return diabetesKnowledge.causes;
    }
    if (lowerMessage.includes('cure') || lowerMessage.includes('permanent') || lowerMessage.includes('heal')) {
      return diabetesKnowledge.cure;
    }
    if (lowerMessage.includes('glucose') || lowerMessage.includes('check') || lowerMessage.includes('monitor') || lowerMessage.includes('test')) {
      return diabetesKnowledge["glucose check"];
    }
    if (lowerMessage.includes('what is') || lowerMessage.includes('define') || lowerMessage.includes('explain')) {
      return diabetesKnowledge["what is diabetes"];
    }
    
    return "I'm sorry, I currently provide information about diabetes symptoms, prevention, BMI, causes, healthy lifestyle tips, and glucose monitoring. Feel free to ask about any of these topics.";
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 mb-4 flex flex-col max-h-[600px] border border-gray-200 transition-all duration-300 ease-in-out transform origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Health Assistant</h3>
              <p className="text-xs opacity-90">AI-Powered Diabetes Guide</p>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:opacity-80 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-xs">
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <p className="text-sm text-gray-600">Health Assistant is typing...</p>
                  <div className="flex gap-1 mt-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-white border-t">
            <p className="text-xs text-gray-600 mb-2 font-medium">Quick Questions:</p>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(question)}
                  className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 text-xs text-left transition-colors duration-200 border border-blue-200"
                  disabled={loading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white rounded-b-lg flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about diabetes..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Float Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-all transform hover:scale-110 ${
          isOpen
            ? 'bg-gray-400 text-white'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
        }`}
        style={{ borderRadius: '50%', width: '56px', height: '56px', padding: 0 }}
        title="Health Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatbotWidget;
