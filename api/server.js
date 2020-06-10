const express = require('express');
const app = express();
const path = require(`path`);
const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));

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

// delete this later
app.get('/submit', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/form.html'));
});

// delete this later
app.post('/submit', (req, res) => {
  console.log({
    name: req.body.name,
    message: req.body.message
  });
  res.send('Thanks for your message!... ' + req.body.name + " : " + req.body.message);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
