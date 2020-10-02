module.exports = (obj) => {
  const token = obj.lista.pop();
  if (token.simbolo !== 'sinteiro' && token.simbolo !== 'sbooleano') {
    // ERRO
  }
  obj.lista.pop();
};
