
const express = require('express');
const fs = require('fs');
const path = require('path');

// Config file path
const configPath = path.join(__dirname, '../config/discord-config.json');
const configDir = path.join(__dirname, '../config');

// Create Express router
const router = express.Router();

// GET /api/get-config - Get Discord configuration
router.get('/get-config', (req, res) => {
  try {
    // Check if config file exists
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      res.json(config);
    } else {
      res.status(404).json({ error: 'Configuration not found' });
    }
  } catch (error) {
    console.error('Error getting configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/save-config - Save Discord configuration
router.post('/save-config', (req, res) => {
  try {
    // Create config directory if it doesn't exist
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Save configuration to file
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
