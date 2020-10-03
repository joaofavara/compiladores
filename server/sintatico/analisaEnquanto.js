const analisaExpressao = require('./analisaExpressao');
const analisaComandoSimples = require('./analisaComandoSimples');

module.exports = (obj) => {
  const token = obj.lista.pop();
  analisaExpressao();
  if (token.simbolo === 'sfaca') {
    obj.lista.pop();
    analisaComandoSimples(obj);
  } else {
    // ERRO
  }
};
