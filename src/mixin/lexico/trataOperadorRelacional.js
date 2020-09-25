/* eslint-disable no-param-reassign */
const teste = require('./lexema.json');

module.exports = (obj) => {
  let opRelacional = obj.file[obj.caracter];
  const token = { lexema: '', simbolo: '' };
  obj.caracter += 1;

  if (opRelacional === '!') {
    if (obj.file[obj.caracter] === '=') {
      opRelacional += obj.file[obj.caracter];
      token.lexema = opRelacional;
      token.simbolo = teste[opRelacional];
      obj.lista = token;
    }
  } else if (opRelacional === '>' || opRelacional === '<') {
    if (obj.file[obj.caracter] === '=') {
      opRelacional += obj.file[obj.caracter];
      token.lexema = opRelacional;
      token.simbolo = teste[opRelacional];
      obj.lista = token;
    } else {
      token.lexema = opRelacional;
      token.simbolo = teste[opRelacional];
      obj.lista = token;
    }
  } else if (opRelacional === '=') {
    token.lexema = opRelacional;
    token.simbolo = teste[opRelacional];
    obj.lista = token;
  }

  obj.caracter += 1;
};
