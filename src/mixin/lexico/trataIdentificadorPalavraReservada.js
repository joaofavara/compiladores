/* eslint-disable no-param-reassign */
const teste = require('./lexema.json');

module.exports = (obj) => {
  const alfabeto = ['_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  let id = obj.file[obj.caracter];
  const token = { lexema: '', simbolo: '' };

  obj.caracter += 1;

  while (obj.file[obj.caracter] && alfabeto.includes(obj.file[obj.caracter].toLowerCase())) {
    id += obj.file[obj.caracter];
    obj.caracter += 1;
  }

  token.lexema = id;
  token.simbolo = teste[id] || 'sidentificador';
  obj.lista.push(token);
};
