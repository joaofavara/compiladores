module.exports = (token) => {
  if (token.simbolo === 'sinicio') {
    // pegaToken();
    // analisaComandoSimples();
    while (token.simbolo !== 'sfim') {
      if (token.simbolo === 'spontovirgula') {
        // pegaToken();
        if (token.simbolo !== 'sfim') {
          // analisaComandoSimples();
        }
      } else {
        // ERRO
      }
    }
    // pegaToken();
  } else {
    // ERRO
  }
};
