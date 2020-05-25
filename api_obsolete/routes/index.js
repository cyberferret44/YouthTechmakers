// ./src/index.js

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

// importing the dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { startDatabase } = require('../database/mongo');
const { insertAd, getAds } = require('../database/ads');
const { deleteAd, updateAd } = require('../database/ads');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// GET
app.get('/ads/', async (req, res) => {
    res.send(await getAds());
});

router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

// POST
app.post('/ads/', async (req, res) => {
    const newAd = req.body;
    await insertAd(newAd);
    res.send({ message: 'New ad inserted.' });
});

// Delete
app.delete('/ads/:id', async (req, res) => {
    await deleteAd(req.params.id);
    res.send({ message: 'Ad removed.' });
});

// Update
app.put('/ads/:id', async (req, res) => {
    const updatedAd = req.body;
    await updateAd(req.params.id, updatedAd);
    res.send({ message: 'Ad updated.' });
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {
    await insertAd({ title: 'Hello, now from the in-memory database2!' });
    await insertAd({ title: 'Asdf' });

    // start the server
    app.listen(3001, async () => {
        console.log('listening on port 3001');
    });
});