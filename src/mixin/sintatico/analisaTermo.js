const analisaFator = require('./analisaFator');

module.exports = (obj) => {
  analisaFator();
  let token = obj.lista.pop();
  while (token.simbolo === 'smult' || token.simbolo === 'sdiv' || token.simbolo === 'se') {
    token = obj.lista.pop();
    analisaFator(obj);
  }
};
