import React, { useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Paper } from '@mui/material';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMatchedJobs(response.data);
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Upload Your Resume</Typography>
      <Box sx={{ mt: 2 }}>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleUpload}
          style={{ marginBottom: '1rem' }}
        />
        <br />
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!file}>
          Submit Resume
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {matchedJobs.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Top Matching Jobs:</Typography>
          {matchedJobs.map((match, index) => (
            <Paper key={index} sx={{ p: 2, mt: 2 }}>
              <Typography><strong>Title:</strong> {match.job.title || match.job.Job_Title}</Typography>
              <Typography><strong>Company:</strong> {match.job.company || match.job.Company}</Typography>
              <Typography><strong>Description:</strong> {match.job.description?.substring(0, 200) || match.job.Job_Description?.substring(0, 200)}...</Typography>
              <Typography><strong>Score:</strong> {match.score.toFixed(4)}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ResumeUpload;
