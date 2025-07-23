import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ChatInterface from './components/ChatInterface';         // For business users
import CustomerChatInterface from './components/CustomerChat';  // For customer users

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Login navigates to the correct interface */}
        <Route path="/login" element={
          user 
            ? (user.accountType === 'customer' 
                ? <Navigate to="/customerinterface" /> 
                : <Navigate to="/chat" />
              ) 
            : <Login onLogin={setUser} />
        } />

        <Route path="/signup" element={<Signup />} />

       {/* Protect Customer Interface */}
        <Route
          path="/customerinterface"
          element={
            user ? (
              <CustomerChatInterface user={user} onLogout={() => setUser(null)} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Protect Business Chat */}
        <Route
          path="/chat"
          element={
            user ? (
              <ChatInterface user={user} onLogout={() => setUser(null)} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
