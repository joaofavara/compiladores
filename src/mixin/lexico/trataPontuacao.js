/* eslint-disable no-param-reassign */
const teste = require('./lexema.json');

module.exports = (obj) => {
  console.log('batatatatata: ', obj.file[obj.caracter]);
  const pont = obj.file[obj.caracter];
  const token = { lexema: '', simbolo: '' };
  obj.caracter += 1;

  token.lexema = pont;
  token.simbolo = teste[pont];
  obj.lista.push(token);
};
