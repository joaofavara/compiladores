const analisaTipo = require('./analisaExpressao');

module.exports = (obj) => {
  let token = obj.lista.pop();
  do {
    if (token.simbolo === 'sidentificador') {
      token = obj.lista.pop();
      if (token.simbolo === 'svirgula' || token.simbolo === 'sdoispontos') {
        if (token.simbolo === 'svirgula') {
          token = obj.lista.pop();
          if (token.simbolo === 'sdoispontos') {
            // ERRO
          }
        }
      } else {
        // ERRO
      }
    } else {
      // ERRO
    }
  } while (token.simbolo === 'sdoispontos');
  obj.lista.pop();
  analisaTipo(obj);
};
