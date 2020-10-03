const analisaDeclaracaoProcedimento = require('./analisaDeclaracaoProcedimento');
const analisaDeclaracaoFuncao = require('./analisaDeclaracaoFuncao');

module.exports = (obj) => {
  const token = obj.lista.pop();
  if (token.simbolo === 'sprocedimento' || token.simbolo === 'sfuncao');

  while (token.simbolo === 'sprocedimento' || token.simbolo === 'sfuncao') {
    if (token.simbolo === 'sprocedimento') {
      analisaDeclaracaoProcedimento(obj);
    } else {
      analisaDeclaracaoFuncao(obj);
    }
    if (token.simbolo === 'sponto-virgula') {
      obj.lista.pop();
    } else {
      // ERRO
    }
  }
};
