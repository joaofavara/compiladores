const analisaExpressao = require('./analisaExpressao');
const analisaComandoSimples = require('./analisaComandoSimples');

module.exports = (obj) => {
  let token = obj.lista.pop();
  analisaExpressao();
  if (token.simbolo === 'sentao') {
    token = obj.lista.pop();
    analisaComandoSimples(obj);
    if (token.simbolo === 'ssenao') {
      obj.lista.pop();
      analisaComandoSimples(obj);
    }
  } else {
    // ERRO
  }
};
