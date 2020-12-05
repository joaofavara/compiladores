// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.log('Handler-error: ', err);
  res.status(404).send({ error: `${err}`, line: err.linhaErro });
};
