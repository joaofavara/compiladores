const analisaVariaveis = require('./analisaVariaveis');

module.exports = (obj) => {
  const token = obj.lista.pop();
  if (token.simbolo === 'svar') {
    while (token.simbolo === 'sidentificador') {
      analisaVariaveis(obj);
      if (token.simbolo === 'spontovirg') {
        obj.lista.pop();
      } else {
        // ERRO
      }
    }
  } else {
    // ERRO
  }
};
