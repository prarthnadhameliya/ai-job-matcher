const { tfidf } = require('natural');

// TFIDF Helper Class
class TFIDF {
  constructor() {
    this.tfidf = new tfidf();
  }

  addDocument(text) {
    this.tfidf.addDocument(text);
  }

  listTerms(documentIndex) {
    return this.tfidf.listTerms(documentIndex);
  }
}

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

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { TFIDF, cosineSimilarity };
