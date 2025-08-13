import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ChatInterface({ user, onLogout }) {
  const [mode, setMode] = useState('');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( loading || !mode) return;

    const userMessage = { sender: 'user', content: question.trim() };
    const currentQuestion = question.trim();

    // Immediately add user message and clear input
    setChatHistory((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      let res;

      if (mode === 'stored') {
        res = await axios.post('http://ec2-13-60-83-180.eu-north-1.compute.amazonaws.com:8080/api/ask', null, {
          params: { companyName: user.businessName, question: currentQuestion },
        });
      } else if (mode === 'crawl') {
        if (!url.trim()) {
          throw new Error('Please enter a website URL');
        }
        res = await axios.post('http://ec2-13-60-83-180.eu-north-1.compute.amazonaws.com:8080/api/crawl-and-ask', null, {
          params: { url: url.trim(), companyName: user.businessName, question: currentQuestion },
        });
      } else if (mode === 'upload') {
        if (!file) {
          throw new Error('Please select a file to upload');
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('question', currentQuestion);
        formData.append('companyName', user.businessName);

        res = await axios.post('http://ec2-13-60-83-180.eu-north-1.compute.amazonaws.com:8080/api/ask-from-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      const apiRes = res.data;
      console.log('API Response:', apiRes);

      let botAnswer;
      if (apiRes?.success) {
        botAnswer = apiRes.data;
      } else {
        console.warn("DocAI API error:", apiRes.message);
        if (apiRes.message === 'Invalid Data') {
          botAnswer = "Sorry, we couldn't understand your request. Please try rephrasing your question.";
        } else {
          botAnswer = apiRes?.message || 'Something went wrong. Please try again.';
        }
      }

      const botMessage = { sender: 'bot', content: botAnswer };
      setChatHistory((prev) => [...prev, botMessage]);

    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        sender: 'bot',
        content: err.message || 'Something went wrong while processing your request. Please try again.',
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setUrl('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetMode = () => {
    setMode('');
    setUrl('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Loading screen if user not ready
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
          Doc<span className="text-blue-400">AI</span> Business
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
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" style={{ minHeight: 0 }}>
        {chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white/60">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-lg mb-2">Welcome to DocAI Business!</p>
              <p className="text-sm mb-4">Choose a mode below to get started</p>
              <div className="flex flex-wrap gap-2 justify-center text-xs">
                <span className="bg-white/10 px-2 py-1 rounded">📄 Upload Documents</span>
                <span className="bg-white/10 px-2 py-1 rounded">🌐 Crawl Websites</span>
                <span className="bg-white/10 px-2 py-1 rounded">🗃️ Query Stored Data</span>
              </div>
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
                  className={`px-4 py-3 rounded-xl shadow-md max-w-[70%] break-words ${msg.sender === 'user'
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
                    <span className="text-sm text-gray-600">DocAI is processing...</span>
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

          {/* Mode Selection */}
          {!mode && (
            <div className="mb-6">
              <p className="text-center text-white/70 mb-4 text-sm">Choose how you want to ask your question:</p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#6b3ce9] to-[#9f53e0] hover:scale-105 transition duration-200 text-sm font-medium"
                  onClick={() => handleModeChange('upload')}
                >
                  📄 Upload Document
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#6b3ce9] to-[#9f53e0] hover:scale-105 transition duration-200 text-sm font-medium"
                  onClick={() => handleModeChange('crawl')}
                >
                  🌐 Crawl Website
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#6b3ce9] to-[#9f53e0] hover:scale-105 transition duration-200 text-sm font-medium"
                  onClick={() => handleModeChange('stored')}
                >
                  🗃️ Ask from Stored Docs
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          {mode && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Mode Header */}
              <div className="flex items-center justify-between bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">
                  {mode === 'upload' && '📄 Upload Document Mode'}
                  {mode === 'crawl' && '🌐 Website Crawl Mode'}
                  {mode === 'stored' && '🗃️ Stored Documents Mode'}
                </span>
                <button
                  type="button"
                  onClick={resetMode}
                  className="text-white/70 hover:text-white text-sm"
                >
                  ✕ Change Mode
                </button>
              </div>

              {/* URL Input for Crawl Mode */}
              {mode === 'crawl' && (
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Website URL:</label>
                  <input
                    className="w-full bg-white/10 p-3 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* File Input for Upload Mode */}
              {mode === 'upload' && (
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Select PDF File:</label>
                  <input
                    ref={fileInputRef}
                    className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  {file && (
                    <p className="text-xs text-white/70">Selected: {file.name}</p>
                  )}
                </div>
              )}

              {/* Question Input */}
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
                {/* <button
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
                </button> */}
                <button
                  type="submit"
                  disabled={loading || (mode !== 'upload' && !question.trim())}
                  className={`px-6 py-3 text-xl transition duration-200 ${loading || (mode !== 'upload' && !question.trim())
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
          )}
        </div>
      </div>
    </div>
  );
}