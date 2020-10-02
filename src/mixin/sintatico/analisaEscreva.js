module.exports = (obj) => {
  let token = obj.lista.pop();
  if (token.simbolo === 'sabre_parenteses') {
    token = obj.lista.pop();
    if (token.simbolo === 'sidentificador') {
      token = obj.lista.pop();
      if (token.simbolo === 'sfecha_parenteses') {
        token = obj.lista.pop();
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
