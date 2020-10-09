const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const index = require('.');
const handlerError = require('./error/handler-error');

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.post('/api/code', async (req, res, next) => {
  const { file } = req.body;
  try {
    await index(file);
    res.status(200).json({
      message: 'TESTE',
      error: false,
    });
  } catch (err) {
    next(err);
  }
}, handlerError);

app.listen(3000, () => {
  console.log('App is running at 3000');
});
