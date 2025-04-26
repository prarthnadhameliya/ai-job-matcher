const TfidfHelper = require('./utils');

// Cosine Similarity
function cosineSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  vec1.forEach((term1) => {
    const term2 = vec2.find((t) => t.term === term1.term);
    if (term2) {
      dotProduct += term1.tfidf * term2.tfidf;
    }
  });

  vec1.forEach((term) => {
    normA += term.tfidf * term.tfidf;
  });

  vec2.forEach((term) => {
    normB += term.tfidf * term.tfidf;
  });

  // console.log(dotProduct, normA, normB);
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Function to match resume with jobs using TF-IDF and Cosine Similarity
function matchJobs(resumeText, dataset) {
  const tfidf = new TfidfHelper();

  // Add all job descriptions to the TF-IDF model
  tfidf.addDocuments(dataset.map((job) => job.description));

  // Compute TF-IDF for the resume
  tfidf.addDocument(resumeText);

  // Get the vector for the resume
  const resumeVector = tfidf.listTerms(tfidf.getAllDocuments().length - 1);
  
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

module.exports = { cosineSimilarity, matchJobs };
