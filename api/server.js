const express = require('express');
const app = express();
const path = require(`path`);
const metadata = require('gcp-metadata');
const bodyParser = require('body-parser');
const {OAuth2Client} = require('google-auth-library');
const oAuth2Client = new OAuth2Client();

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));

// Cache externally fetched information for future invocations
let aud;

// Loads main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/donate', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/donate.html'));
});

app.get('/electronics', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/electronics.html'));
});

app.get('/login', async (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login.html'));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});