exports.getRecommendedJobs = (req, res) => {
    const { skills } = req.body;
  
    const jobs = [
      {
        id: 1,
        title: 'Frontend Developer',
        description: 'Looking for React and JavaScript experience',
        score: 0.9,
      },
      {
        id: 2,
        title: 'Backend Developer',
        description: 'Requires Node.js and MongoDB skills',
        score: 0.85,
      },
    ];
  
    res.json(jobs);
  };
  