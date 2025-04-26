const natural = require('natural');
const TfIdf = natural.TfIdf;

class TfidfHelper {
  constructor() {
    this.tfidf = new TfIdf();
  }

  // Add a single document (string)
  addDocument(text) {
    this.tfidf.addDocument(text);
  }
  
  listTerms(documentIndex) {
    return this.tfidf.listTerms(documentIndex);
  }

  // Add multiple documents (array of strings)
  addDocuments(docs) {
    docs.forEach(doc => this.tfidf.addDocument(doc));
  }

  // Get TF-IDF weight of a word in all documents
  getTermScores(term) {
    const scores = [];
    this.tfidf.tfidfs(term, (i, measure) => {
      scores.push({ documentIndex: i, score: measure });
    });
    return scores;
  }

  // Get top N terms for a specific document
  getTopTerms(docIndex, topN = 5) {
    const items = this.tfidf.listTerms(docIndex);
    return items.slice(0, topN);
  }

  getAllDocuments() {
    return this.tfidf.documents;
  }
}

module.exports = TfidfHelper;