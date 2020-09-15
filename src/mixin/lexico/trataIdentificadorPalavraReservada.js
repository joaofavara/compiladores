/* eslint-disable no-param-reassign */
const teste = require('./lexema.json');

module.exports = (obj) => {
  let id = obj.file[obj.caracter];
  const token = { lexema: '', simbolo: '' };

  obj.caracter += 1;

  while (obj.file[obj.caracter] && /[_a-zA-Z]/.test(obj.file[obj.caracter])) {
    id += obj.file[obj.caracter];
    obj.caracter += 1;
  }

  token.lexema = id;
  token.simbolo = teste[id] || 'sidentificador';
  obj.lista = token;
};
