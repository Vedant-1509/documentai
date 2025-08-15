import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerChatInterface({ user, onLogout }) {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 🧠 Debug: log user object
  console.log('CustomerChatInterface received user:', user);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };



  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!question.trim() || loading) return;

  const currentQuestion = question.trim();
  const userMessage = { sender: 'user', content: currentQuestion };

  // Immediately update UI with user's message
  setChatHistory((prev) => [...prev, userMessage]);
  setQuestion('');
  setLoading(true);

  try {
    // Step 1: Ask backend (DocAI)
    const botRes = await axios.post('http://ec2-16-170-249-229.eu-north-1.compute.amazonaws.com:8080/api/ask', null, {
      params: { companyName: user.businessName, question: currentQuestion },
    });

    const apiRes = botRes.data;
    console.log('API Response:', apiRes); // for debugging

    let botAnswer = '';

    if (apiRes?.success) {
      botAnswer = apiRes.data;
    } else {
      console.warn("DocAI API error:", apiRes.message);
      // Handle known error types with friendlier responses
      switch (apiRes.message) {
        case 'Invalid Data':
          botAnswer = "❗ We couldn't understand your question. Try rephrasing it.";
          break;
        case 'PDF not uploaded':
          botAnswer = "📄 Please upload a PDF before asking questions.";
          break;
        case 'No context found':
          botAnswer = "🧠 I couldn't find relevant context in your uploaded file.";
          break;
        default:
          botAnswer = `⚠️ ${apiRes.message || 'Something went wrong. Please try again.'}`;
      }
    }

    const botMessage = { sender: 'bot', content: botAnswer };

    // Step 2: Immediately show bot reply in UI
    setChatHistory((prev) => [...prev, botMessage]);

    // // Step 3: Save conversation to backend
    // await axios.post('http://localhost:5000/api/chat/save', {
    //   userId: user._id,
    //   messages: [userMessage, botMessage],
    // });
  } catch (err) {
    console.error('Chat error:', err);
    // const  = {
    //   sender: 'bot',
    //   content: "⚠️ Network error or server issue. Please try again later.",
    // };
    //setChatHistory((prev) => [...prev, errorMessage]);
  } finally {
    setLoading(false);
  }
};


  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // ⏳ Render loading if user not ready
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#130828] via-[#1f1140] to-[#2a1b59]">
        <div className="text-white p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          Loading user...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#130828] via-[#1f1140] to-[#2a1b59] text-white">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1f1140]/80 shadow-md flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-wide text-white">
          Doc<span className="text-blue-400">AI</span> Customer
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70">Hello, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        style={{ minHeight: 0 }} // Important for flex-1 to work with overflow
      >
        {chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white/60">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg mb-2">Welcome to DocAI!</p>
              <p className="text-sm">Ask me anything about {user.businessName}</p>
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} px-2`}
              >
                <div
                  className={`px-4 py-3 rounded-xl shadow-md max-w-[70%] break-words ${
                    msg.sender === 'user'
                      ? 'bg-[#dcf8c6] text-black rounded-bl-xl'
                      : 'bg-white text-black rounded-br-xl'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-xs text-right text-gray-600 mt-1">
                    {msg.sender === 'user' ? 'You' : 'DocAI'}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="w-full flex justify-start px-2">
                <div className="bg-white text-black px-4 py-3 rounded-xl rounded-br-xl shadow-md max-w-[70%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">DocAI is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 w-full px-4 pb-6 pt-2">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center bg-white/10 rounded-full overflow-hidden shadow-lg backdrop-blur-sm">
              <input
                type="text"
                placeholder={loading ? "Please wait..." : "Ask your question..."}
                className="flex-grow px-6 py-3 bg-transparent text-white placeholder-white/60 focus:outline-none text-base"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className={`px-6 py-3 text-xl transition duration-200 ${
                  loading || !question.trim() 
                    ? 'text-white/40 cursor-not-allowed' 
                    : 'text-white hover:text-blue-400 hover:scale-110'
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/40"></div>
                ) : (
                  '➤'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}