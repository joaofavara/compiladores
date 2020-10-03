const analisaAtribChprocedimento = require('./analisaAtribChprocedimento');
const analisaSe = require('./analisaSe');
const analisaEnquanto = require('./analisaEnquanto');
const analisaLeia = require('./analisaLeia');
const analisaEscreva = require('./analisaEscreva');
const analisaComandos = require('./analisaComandos');

module.exports = (obj) => {
  const token = obj.lista.pop();
  if (token.simbolo === 'sidentificador') {
    analisaAtribChprocedimento(obj);
  } else if (token.simbolo === 'sse') {
    analisaSe(obj);
  } else if (token.simbolo === 'senquanto') {
    analisaEnquanto(obj);
  } else if (token.simbolo === 'sleia') {
    analisaLeia(obj);
  } else if (token.simbolo === 'sescreva') {
    analisaEscreva(obj);
  } else {
    analisaComandos(obj);
  }
};
