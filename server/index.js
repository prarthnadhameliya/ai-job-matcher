const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { TFIDF, cosineSimilarity } = require('./utils'); // We'll create these helper functions

const app = express();
const PORT = 5000;

// Middleware
//app.use(cors());

const corsOptions = {
    //origin: 'http://localhost:3000', // Allow the frontend at port 3000
    //origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    origin: '*',
    methods: ['GET', 'POST'], // Allowed HTTP methods
    allowedHeaders: '*',
    credentials: true, // Allow cookies (if needed)
  };
  
  //app.use(cors(corsOptions)); // Apply the CORS options
  app.use(cors(corsOptions));
 // app.options('*', cors(corsOptions));
  app.use(express.json());


// Set up file upload using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Load job dataset
let jobDataset = [];

// Read CSV file and store job data
fs.createReadStream(path.join(__dirname, 'fake_job_postings.csv'))
  .pipe(csv())
  .on('data', (row) => {
    jobDataset.push(row); // Assuming each row has { Job_Title, Company, Job_Description }
  })
  .on('end', () => {
    console.log('Job dataset loaded');
  });

// Route to handle resume upload and job matching
app.post('/upload', upload.single('resume'), async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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

// Function to match resume with jobs using TF-IDF and Cosine Similarity
function matchJobs(resumeText, dataset) {
  const tfidf = new TFIDF();

  // Add job descriptions to the TF-IDF model
  dataset.forEach((job) => {
    tfidf.addDocument(job.Job_Description);
  });

  // Compute TF-IDF for the resume
  tfidf.addDocument(resumeText);

  // Get the vector for the resume
  const resumeVector = tfidf.listTerms(tfidf.documents.length - 1);

  // Find cosine similarity for each job description
  const matches = dataset.map((job, index) => {
    const jobVector = tfidf.listTerms(index);
    const similarity = cosineSimilarity(resumeVector, jobVector);
    return { job, score: similarity };
  });

  // Sort matches by score (higher similarity)
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 5); // Return top 5 matches
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
