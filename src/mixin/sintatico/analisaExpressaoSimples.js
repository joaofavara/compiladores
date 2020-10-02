const analisaTermo = require('./analisaTermo');

module.exports = (obj) => {
  let token = obj.lista.pop();
  if (token.simbolo === 'smais' || token.simbolo === 'smenos') {
    token = obj.lista.pop();
    analisaTermo(obj);
    while (token.simbolo === 'smais' || token.simbolo === 'smenos' || token.simbolo === 'sou') {
      token = obj.lista.pop();
      analisaTermo(obj);
    }
  }
};
