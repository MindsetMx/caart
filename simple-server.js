const express = require('express');
const { readFileSync } = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

// Serve static files from browser directory
app.use(express.static(path.join(__dirname, 'dist/caart/browser')));

// For all other routes, serve index.html (SPA fallback)
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(__dirname, 'dist/caart/browser/index.html');
    const html = readFileSync(indexPath, 'utf8');
    res.send(html);
  } catch (error) {
    res.status(500).send('Error serving application');
  }
});

app.listen(port, () => {
  console.log(`Simple server listening on http://localhost:${port}`);
});