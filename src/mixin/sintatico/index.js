const analisaLexico = require('../lexico/index');

module.exports = async (event) => {
  const lista = await analisaLexico(event);
  console.log('LISTA: ', lista);

  const token = { simbolo: '' };
  // pegaToken();
  if (token.simbolo === 'sprograma') {
    // pegaToken();
    if (token.simbolo === 'sidentificador') {
      // pegaToken();
      if (token.simbolo === 'spontovirgula') {
        // analisaBloco();
        if (token.simbolo === 'sponto') {
          if ('acabou arquivo' || 'é comentario');
          else {
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
  } else {
    // ERRO
  }
};
