import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Jobs.css';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery) {
        searchJobs(searchQuery);
      } else {
        fetchJobs();
      }
    }, 300); // Debounce search for 300ms

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/jobs');
      setJobs(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/jobs/search?query=${encodeURIComponent(query)}`);
      setJobs(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to search jobs. Please try again later.');
      console.error('Error searching jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Available Jobs</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search jobs by title, company, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading && <div className="loading">Loading jobs...</div>}
      {error && <div className="error">{error}</div>}

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h2>{job.title}</h2>
            <h3>{job.company_profile}</h3>
            <p className="job-location">{job.location}</p>
            <p className="job-type">{job.type}</p>
            <p className="job-description">{job.description}</p>
            <div className="job-footer">
              <span className="job-salary">{job.salary}</span>
              <button className="apply-button">Apply Now</button>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <div className="no-jobs">
          No jobs found matching your search criteria.
        </div>
      )}
    </div>
  );
}

export default Jobs; 