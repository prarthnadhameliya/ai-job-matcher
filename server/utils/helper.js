const TfidfHelper = require('./utils');

// Cosine Similarity
function cosineSimilarity(vec1, vec2Map, normA, normB) {
  let dotProduct = 0;

  vec1.forEach((term1) => {
    if (vec2Map.has(term1.term)) {
      dotProduct += term1.tfidf * vec2Map.get(term1.term);
    }
  });

  return dotProduct / (normA * normB);
}

function vectorNorm(vec) {
  return Math.sqrt(vec.reduce((sum, term) => sum + term.tfidf * term.tfidf, 0));
}

// Function to match resume with jobs using TF-IDF and Cosine Similarity
function matchJobs(resumeText, dataset) {
  const tfidf = new TfidfHelper();

  // Add all job descriptions to the TF-IDF model
  tfidf.addDocuments(dataset.map((job) => job.description));

  // Compute TF-IDF for the resume
  tfidf.addDocument(resumeText);

  const allDocs = tfidf.getAllDocuments();

  // Precompute job vectors and norms
  const jobVectors = dataset.map((_, index) => tfidf.listTerms(index));
  const jobVectorMaps = jobVectors.map(vec => new Map(vec.map(t => [t.term, t.tfidf])));
  const jobNorms = jobVectors.map(vectorNorm);

  // Resume vector and norm
  const resumeVector = tfidf.listTerms(allDocs.length - 1);
  const resumeNorm = vectorNorm(resumeVector);

  // Find cosine similarity
  const matches = dataset.map((job, index) => {
    const similarity = cosineSimilarity(resumeVector, jobVectorMaps[index], resumeNorm, jobNorms[index]);
    return { job, score: similarity };
  });

  // Sort matches by score
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 5); // Return top 5 matches
}

module.exports = { cosineSimilarity, matchJobs };
