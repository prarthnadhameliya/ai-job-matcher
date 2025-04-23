const express = require('express');
const router = express.Router();

const jobController = require('../controllers/jobController');

router.post('/recommend', jobController.getRecommendedJobs);

module.exports = router;
