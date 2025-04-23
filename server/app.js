const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/jobs', jobRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
