import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">JobMatch</h1>
        <p className="subtitle">Find Your Perfect Career Match</p>
        <div className="cta-buttons">
          <Link to="/jobs" className="cta-button primary">Browse Jobs</Link>
          <Link to="/upload" className="cta-button secondary">Upload Resume</Link>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Smart Job Search</h3>
          <p>Find jobs that match your skills and experience using our advanced matching algorithm.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Resume Analysis</h3>
          <p>Upload your resume and get personalized job recommendations based on your profile.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Perfect Matches</h3>
          <p>Get matched with opportunities that align with your career goals and aspirations.</p>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Your Resume</h3>
            <p>Start by uploading your resume in PDF or DOCX format.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Matched</h3>
            <p>Our AI analyzes your skills and finds the best job matches.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Apply & Succeed</h3>
            <p>Apply to matched positions and take the next step in your career.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
