const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const { initializeDatabase, findMatchingJobs } = require('./dataset/index');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors())  

// Set up file upload using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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


// Initialize cache before starting server
initializeDatabase().then(() => {
  // Start the server
  app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
