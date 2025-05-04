import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResumeUpload from './components/ResumeUpload';
import Settings from './components/Settings';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/SignUp';

function App() {
  const [user, setUser] = useState(null); // State for logged-in user

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<div style={{ padding: "2rem" }}>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
