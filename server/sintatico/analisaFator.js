const analisaExpressao = require('./analisaExpressao');

function analiaFator(obj) {
  let token = obj.lista.pop();
  if (token.simbolo === 'sidentificador') {
    // analisaChamadaFuncao();
  } else if (token.simbolo === 'snumero') {
    token = obj.lista.pop();
  } else if (token.simbolo === 'snao') {
    token = obj.lista.pop();
    // eslint-disable-next-line no-undef
    analisaFator(obj);
  } else if (token.simbolo === 'sabre_parenteses') {
    token = obj.lista.pop();
    analisaExpressao(obj);
    if (token.simbolo === 'sfecha_parenteses') {
      token = obj.lista.pop();
    } else {
      // ERRO
    }
  } else if (token.lexema === 'verdadeiro' || token.lexema === 'falso') {
    token = obj.lista.pop();
  } else {
    // ERRO
  }
}

module.exports = analiaFator;
