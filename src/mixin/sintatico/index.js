const analisaLexico = require('../lexico/index');

module.exports = async (event) => {
  const lista = await analisaLexico(event);
  console.log('LISTA: ', lista);
};
