const analisaAtribuicao = require('./analisaAtribuicao');

module.exports = (obj) => {
  const token = obj.lista.pop();
  if (token.simbolo === 'satribuicao') {
    analisaAtribuicao(obj);
  }
  // else {
  //   chamadaProcedimento();
  // }
};
