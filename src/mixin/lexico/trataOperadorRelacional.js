/* eslint-disable no-param-reassign */
const teste = require('./lexema.json');

module.exports = (obj) => {
  let opRelacional = obj.file[obj.caracter];
  const token = { lexema: '', simbolo: '' };
  obj.caracter += 1;

  if (obj.file[obj.caracter] === '=' && (opRelacional === '>' || opRelacional === '<' || opRelacional === '!')) {
    opRelacional += obj.file[obj.caracter];
  }

  token.lexema = opRelacional;
  token.simbolo = teste[opRelacional];
};
