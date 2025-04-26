const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const jobDataset = [];

// Read CSV file and store job data
fs.createReadStream(path.join(__dirname, 'fake_job_postings.csv'))
  .pipe(csv())
  .on('data', (row) => {
    jobDataset.push(row); // Assuming each row has { Job_Title, Company, Job_Description }
  })
  .on('end', () => {
    console.log('Job dataset loaded');
  });

module.exports = { jobDataset };
