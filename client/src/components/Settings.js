import React, { useState } from 'react';
import { Container, TextField, Typography, Button } from '@mui/material';

const Settings = () => {
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const handleSave = () => {
    console.log("Preferences saved:", { location, jobType });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Settings</Typography>
      <TextField
        label="Preferred Job Location"
        variant="outlined"
        fullWidth
        margin="normal"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <TextField
        label="Preferred Job Type (e.g. Remote, Full-time)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Preferences
      </Button>
    </Container>
  );
};

export default Settings;
