import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI Job Matcher
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/upload">Upload Resume</Button>
        <Button color="inherit" component={Link} to="/settings">Settings</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
