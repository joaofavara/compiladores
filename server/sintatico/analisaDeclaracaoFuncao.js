const analisaBloco = require('./analisaBloco');

module.exports = (obj) => {
  let token = obj.lista.pop();
  if (token.simbolo === 'sidentificador') {
    token = obj.lista.pop();
    if (token.simbolo === 'sdoispontos') {
      token = obj.lista.pop();
      if (token.simbolo === 'sinteiro' || token.simbolo === 'sbooleano') {
        token = obj.lista.pop();
        if (token.simbolo === 'sponto_virgula') {
          analisaBloco(obj);
        }
      } else {
        // ERRO
      }
    } else {
      // ERRO
    }
  } else {
    // ERRO
  }
};
