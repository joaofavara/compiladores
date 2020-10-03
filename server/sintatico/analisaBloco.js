const analisaComandos = require('./analisaComandos');
const analisaEtVariaveis = require('./analisaEtVariaveis');
const analisaSubrotinas = require('./analisaSubrotinas');

module.exports = (obj) => {
  obj.lista.pop();
  analisaEtVariaveis(obj);
  analisaSubrotinas(obj);
  analisaComandos(obj);
};
