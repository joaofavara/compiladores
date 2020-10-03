const analisaLexico = require('../lexico/index');
const analisaBloco = require('./analisaBloco');

module.exports = async (file) => {
  const obj = {
    lista: await analisaLexico(file),
  };
  console.log('LISTA: ', obj.lista);

  let token = obj.lista.pop();
  console.log('token: ', token);

  if (token.simbolo === 'sprograma') {
    token = obj.lista.pop();
    if (token.simbolo === 'sidentificador') {
      token = obj.lista.pop();
      if (token.simbolo === 'spontovirgula') {
        analisaBloco(obj);
        if (token.simbolo === 'sponto') {
          // if ('acabou arquivo' || 'é comentario');
          // else {
          //   // ERRO
          // }
        } else {
          // ERRO
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
