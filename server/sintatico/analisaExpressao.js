const analisaExpressaoSimples = require('./analisaExpressaoSimples');

module.exports = (obj) => {
  analisaExpressaoSimples(obj);
  const token = obj.lista.pop();
  if (['smaior', 'smaiorig', 'sig', 'smenor', 'smenorig', 'sdif'].includes(token.simbolo)) {
    obj.lista.pop();
    analisaExpressaoSimples(obj);
  }
};
