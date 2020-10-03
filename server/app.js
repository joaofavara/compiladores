const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sintatico = require('./sintatico');

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.post('/api/code', (req, res) => {
  const { file } = req.body;
  sintatico(file);
  res.status(200).json({
    message: 'TESTE',
    error: false,
  });
});

app.listen(3000, () => {
  console.log('App is running at 3000');
});
