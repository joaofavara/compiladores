const analisaComandoSimples = require('./analisaComandoSimples');

module.exports = (obj) => {
  let token = obj.lista.pop();
  if (token.simbolo === 'sinicio') {
    token = obj.lista.pop();
    analisaComandoSimples(obj);
    while (token.simbolo !== 'sfim') {
      if (token.simbolo === 'spontovirgula') {
        token = obj.lista.pop();
        if (token.simbolo !== 'sfim') {
          analisaComandoSimples(obj);
        }
      } else {
        // ERRO
      }
    }
    obj.lista.pop();
  } else {
    // ERRO
  }
};
