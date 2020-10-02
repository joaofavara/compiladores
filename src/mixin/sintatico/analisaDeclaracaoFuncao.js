module.exports = (token) => {
  // pegaToken();
  if (token.simbolo === 'sidentificador') {
    // pegaToken();
    if (token.simbolo === 'sdoispontos') {
      // pegaToken();
      if (token.simbolo === 'sinteiro' || token.simbolo === 'sbooleano') {
        // pegaToken();
        if (token.simbolo === 'sponto_virgula') {
          // analisaBloco();
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
