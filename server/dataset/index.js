const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const natural = require("natural");
const TfIdf = natural.TfIdf;

const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const JOB_DATABASE_PATH = path.join(__dirname, "fake_job_postings.csv");
const VECTOR_CACHE_PATH = path.join(__dirname, "cache", "job_vectors.json");
const TFIDF_MODEL_PATH = path.join(__dirname, "cache", "tfidf_model.json");

// In-memory cache
let jobVectorsCache = null;
let jobDatabaseCache = null;
let tfidfModelCache = null;

async function loadCsv(filePath) {
  const jobDataset = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        jobDataset.push(row); // Assuming each row has { Job_Title, Company, Job_Description }
      })
      .on("end", () => {
        console.log("Job dataset loaded");
        resolve(jobDataset);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function loadJobDatabase(forceReload = false) {
  if (!forceReload && jobDatabaseCache) {
    return jobDatabaseCache;
  }
  const jobDataset = await loadCsv(JOB_DATABASE_PATH);
  jobDatabaseCache = jobDataset;
  return jobDataset;
}

function calculateTfIdf(documents) {
  const tfidf = new TfIdf();

  documents.forEach((doc) => {
    tfidf.addDocument(doc);
  });

  return tfidf;
}

function getDocumentVector(tfidf, docIndex) {
  const vector = {};
  tfidf.listTerms(docIndex).forEach((item) => {
    vector[item.term] = item.tfidf;
  });
  return vector;
}

function calculateCosineSimilarity(vec1, vec2) {
  // Calculate dot product
  let dotProduct = 0;
  for (const term in vec1) {
    if (vec2[term]) {
      dotProduct += vec1[term] * vec2[term];
    }
  }

  // Calculate magnitudes
  const mag1 = Math.sqrt(
    Object.values(vec1).reduce((sum, val) => sum + val * val, 0)
  );
  const mag2 = Math.sqrt(
    Object.values(vec2).reduce((sum, val) => sum + val * val, 0)
  );

  if (mag1 === 0 || mag2 === 0) return 0;

  return dotProduct / (mag1 * mag2);
}

function findTopMatches(resumeVector, jobVectors, jobs, topN = 5) {
  const similarities = jobVectors.map((jobVector, index) => ({
    job: jobs[index],
    score: calculateCosineSimilarity(resumeVector, jobVector),
  }));
  // console.log(similarities);

  // Sort by similarity in descending order
  similarities.sort((a, b) => b.score - a.score);

  // Return top N matches
  return similarities.slice(0, topN);
}

async function saveVectorsToCache(tfidf, jobVectors) {
  try {
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(path.dirname(VECTOR_CACHE_PATH))) {
      fs.mkdirSync(path.dirname(VECTOR_CACHE_PATH), { recursive: true });
    }

    // Save job vectors
    await writeFileAsync(VECTOR_CACHE_PATH, JSON.stringify(jobVectors));

    // Save TF-IDF model
    await writeFileAsync(TFIDF_MODEL_PATH, JSON.stringify(tfidf));

    console.log("Vector cache updated");
  } catch (error) {
    console.error("Error saving vector cache:", error);
  }
}

async function loadVectorsFromCache() {
  try {
    if (fs.existsSync(VECTOR_CACHE_PATH) && fs.existsSync(TFIDF_MODEL_PATH)) {
      const jobVectorsJson = await readFileAsync(VECTOR_CACHE_PATH, "utf8");
      const tfidfModelJson = await readFileAsync(TFIDF_MODEL_PATH, "utf8");

      const jobVectors = JSON.parse(jobVectorsJson);
      if (jobVectors.length == 0) {
        return null;
      }

      // Recreate the TF-IDF object from saved state
      const tfidf = new TfIdf();
      const savedModel = JSON.parse(tfidfModelJson);

      // Restore the model state
      if (savedModel.documents) {
        savedModel.documents.forEach((doc) => {
          tfidf.documents.push(doc);
        });
      }

      if (savedModel.documentVectors) {
        Object.keys(savedModel.documentVectors).forEach((key) => {
          tfidf.documentVectors[key] = savedModel.documentVectors[key];
        });
      }

      console.log("Loaded vectors from cache");
      return { jobVectors, tfidf };
    }
    return null;
  } catch (error) {
    console.error("Error loading vector cache:", error);
    return null;
  }
}

async function initializeDatabase() {
  try {
    // Load jobs
    const jobs = await loadJobDatabase(true);

    // Try to load from cache first
    const cachedData = await loadVectorsFromCache();
    
    // If cache exists and CSV hasn't been modified since the last cache update
    if (cachedData !== null) {
      jobVectorsCache = cachedData.jobVectors;
      tfidfModelCache = cachedData.tfidf;
    } else {
      // Recalculate vectors
      console.log('Calculating job vectors...');
      const jobDescriptions = jobs.map(job => job.description || '');
      
      // Create TF-IDF model
      tfidfModelCache = calculateTfIdf(jobDescriptions);
      
      // Calculate job vectors
      jobVectorsCache = jobDescriptions.map((_, index) => 
        getDocumentVector(tfidfModelCache, index)
      );
      
      // Save to cache
      await saveVectorsToCache(tfidfModelCache, jobVectorsCache);
    }

    console.log(`Indexed ${jobs.length} jobs`);
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

async function findMatchingJobs(resumeText) {
  // Get jobs from cache
  console.log("FINDING MATCHES......");
  const jobs = await loadJobDatabase();
  if (jobs.length === 0) {
    throw new Error("Job database is empty or could not be loaded");
  }

  // Use cached TF-IDF model to calculate resume vector
  const resumeTfIdf = new TfIdf(tfidfModelCache);
  resumeTfIdf.addDocument(resumeText);

  // Get the vector for the resume (which is the last document in the model)
  const resumeVector = getDocumentVector(
    resumeTfIdf,
    resumeTfIdf.documents.length - 1
  );

  // Find top matches using cached job vectors
  return findTopMatches(resumeVector, jobVectorsCache, jobs);
}

module.exports = {
  loadJobDatabase,
  initializeDatabase,
  findMatchingJobs,
};
