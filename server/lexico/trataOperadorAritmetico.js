/* eslint-disable no-param-reassign */
const teste = require('./lexema.json');

module.exports = (obj) => {
  const opAritmetico = obj.file[obj.caracter];
    const token = {
    lexema: '', simbolo: '', row: '', column: obj.caracter,
  };
  obj.caracter += 1;

  token.lexema = opAritmetico;
  token.simbolo = teste[opAritmetico];
  return token;
};
