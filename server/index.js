const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const Fuse = require('fuse.js');
const { initializeDatabase, findMatchingJobs, loadJobDatabase } = require('./dataset/index');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors())  

// Set up file upload using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Fuse.js search index
let fuse = null;

// Configure Fuse.js options
const fuseOptions = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'company_profile', weight: 1.5 },
    { name: 'description', weight: 1 },
    { name: 'requirements', weight: 1 }
  ],
  threshold: 0.3,
  includeScore: true
};

// Initialize search index with jobs data
async function initializeSearchIndex() {
  const jobs = await loadJobDatabase();
  fuse = new Fuse(jobs, fuseOptions);
}

// Route to get all jobs
app.get('/jobs', async (req, res) => {
  const jobs = await loadJobDatabase();
  res.json(jobs);
});

// New route for searching jobs
app.get('/jobs/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!fuse) {
      await initializeSearchIndex();
    }

    const searchResults = fuse.search(query);
    const results = searchResults.map(result => ({
      ...result.item,
      score: result.score
    }));

    res.json(results);
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to handle resume upload and job matching
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let resumeText = '';

    // Extract text from PDF
    if (fileExtension === '.pdf') {
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text;
    }
    // Extract text from DOCX
    else if (fileExtension === '.docx') {
      const { value } = await mammoth.extractRawText({ buffer: req.file.buffer });
      resumeText = value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Match the resume text to job descriptions
    const topMatches = await findMatchingJobs(resumeText);
    return res.json(topMatches);
  } catch (error) {
    console.error('Error uploading resume:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Initialize cache and search index before starting server
initializeDatabase().then(() => {
  initializeSearchIndex().then(() => {
    // Start the server
    app.listen(PORT, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });
});
