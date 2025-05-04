const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const { jobDataset } = require('./dataset/data');
const { matchJobs } = require('./utils/helper'); // We'll create these helper functions

app.use("/api/auth", require("./routes/authRoutes"));


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
    const jobMatches = matchJobs(resumeText, jobDataset);

    return res.json(jobMatches);
  } catch (error) {
    console.error('Error uploading resume:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
