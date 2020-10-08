/* eslint-disable no-param-reassign */
const teste = require('./lexema.json');

module.exports = (obj) => {
  let opRelacional = obj.file[obj.caracter];
  const token = {
    lexema: '', simbolo: '', row: '', column: obj.caracter,
  };
  obj.caracter += 1;

  if (opRelacional === '!') {
    if (obj.file[obj.caracter] === '=') {
      opRelacional += obj.file[obj.caracter];
      token.lexema = opRelacional;
      token.simbolo = teste[opRelacional];
      obj.caracter += 1;
      return token;
    }
    return -1;
  } if (opRelacional === '>' || opRelacional === '<') {
    if (obj.file[obj.caracter] === '=') {
      opRelacional += obj.file[obj.caracter];
      token.lexema = opRelacional;
      token.simbolo = teste[opRelacional];
      obj.caracter += 1;
      return token;
    }
    token.lexema = opRelacional;
    token.simbolo = teste[opRelacional];
    return token;
  } if (opRelacional === '=') {
    token.lexema = opRelacional;
    token.simbolo = teste[opRelacional];
    obj.caracter += 1;
    return token;
  }
  return true;
};
