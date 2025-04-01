
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Enable CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// API routes
app.use('/api', api);

// Start server
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
