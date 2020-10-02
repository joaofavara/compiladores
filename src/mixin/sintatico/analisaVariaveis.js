module.exports = (token) => {
  do {
    if (token.simbolo === 'sidentificador') {
      // pegaToken();
      if (token.simbolo === 'svirgula' || token.simbolo === 'sdoispontos') {
        if (token.simbolo === 'svirgula') {
          // pegaToken();
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
  // pegaToken();
  // analisaTipo();
};
