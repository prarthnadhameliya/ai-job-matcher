import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SearchIcon from '@mui/icons-material/Search';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

const benefits = [
  {
    icon: <WorkOutlineIcon fontSize="large" color="primary" />,
    title: 'Personalized Job Matches',
    desc: 'We analyze your resume using AI to recommend jobs that match your skills and interests.',
  },
  {
    icon: <SearchIcon fontSize="large" color="primary" />,
    title: 'Streamlined Search',
    desc: 'Skip the hassle of browsing endlessly. Let us bring the best jobs to you.',
  },
  {
    icon: <SettingsSuggestIcon fontSize="large" color="primary" />,
    title: 'Smart & Adaptive',
    desc: 'Our system gets smarter with time to better understand your preferences.',
  },
];

const Home = () => {
  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to <span style={{ color: '#1976d2' }}>AI Job Matcher</span>
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Upload your resume and let our AI find the best jobs tailored to you.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to="/upload"
        sx={{ mb: 6 }}
      >
        Upload Resume
      </Button>

      <Grid container spacing={4}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {benefit.icon}
                </Box>
                <Typography variant="h6" gutterBottom align="center">
                  {benefit.title}
                </Typography>
                <Typography variant="body2" align="center">
                  {benefit.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
