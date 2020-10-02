module.exports = (token) => {
  if (token.simbolo === 'sidentificador') {
    // analisaChamadaFuncao();
  } else if (token.simbolo === 'snumero') {
    // pegaToken();
  } else if (token.simbolo === 'snao') {
    // pegaToken();
    // analisaFator();
  } else if (token.simbolo === 'sabre_parenteses') {
    // pegaToken();
    // analisaExpressao();
    if (token.simbolo === 'sfecha_parenteses') {
      // pegaToken();
    } else {
      // ERRO
    }
  } else if (token.lexema === 'verdadeiro' || token.lexema === 'falso') {
    // pegaToken();
  } else {
    // ERRO
  }
};
