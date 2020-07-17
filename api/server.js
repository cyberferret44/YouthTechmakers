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

async function audience() {
  if (!aud && (await metadata.isAvailable())) {
    let project_number = await metadata.project('numeric-project-id');
    let project_id = await metadata.project('project-id');

    aud = '/projects/' + project_number + '/apps/' + project_id;
  }

  return aud;
}

async function validateAssertion(assertion) {
  if (!assertion) {
    return {};
  }

  // Check that the assertion's audience matches ours
  const aud = await audience();

  // Fetch the current certificates and verify the signature on the assertion
  const response = await oAuth2Client.getIapPublicKeys();
  const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
    assertion,
    response.pubkeys,
    aud,
    ['https://cloud.google.com/iap']
  );
  const payload = ticket.getPayload();

  // Return the two relevant pieces of information
  return {
    email: payload.email,
    sub: payload.sub,
  };
}

app.get('/login', async (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login.html'));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});