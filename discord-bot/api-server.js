
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// API routes
app.use('/api', api);

// Start server
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
