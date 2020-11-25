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

app.use(cors());
app.use('/', serverStatic(path.join(__dirname, '../dist')));

app.post('/api/code', async (req, res, next) => {
  const { code } = req.body;
  try {
    const filename = await index(code);
    const readStream = fs.createReadStream(filename);

    readStream.on('error', (err) => {
      res.end(err);
    });

    readStream.on('end', () => {
      fs.unlinkSync(filename);
    });

    readStream.pipe(res);
  } catch (err) {
    next(err);
  }
}, handlerError);

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`server started ${port}`);
