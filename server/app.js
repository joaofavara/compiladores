/* eslint-disable max-len */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const serverStatic = require('serve-static');
const path = require('path');
const index = require('.');
const handlerError = require('./error/handler-error');

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  // origin: 'https://localhost:8080/',
  origin: 'http://127.0.0.1:8080',
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.post('/api/code', async (req, res, next) => {
  const { code } = req.body;
  try {
    const filename = await index(code);
    const readStream = fs.createReadStream(filename);

    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', () => {
    // This just pipes the read stream to the response object (which goes to the client)
      readStream.pipe(res);
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', (err) => {
      res.end(err);
    });
    readStream.pipe(res);
  } catch (err) {
    next(err);
  }
}, handlerError);

app.use('/', serverStatic(path.join(__dirname, '/dist')));

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`server started ${port}`);

// app.listen(3000, () => {
//   console.log('App is running at 3000');
// });
