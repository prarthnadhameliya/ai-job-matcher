import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResumeUpload from './components/ResumeUpload';
import Home from './pages/Home';
import Jobs from './pages/Jobs';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="*" element={<div style={{ padding: "2rem" }}>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
