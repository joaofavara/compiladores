/* eslint-disable no-param-reassign */
module.exports = (obj) => {
  let dpontos = obj.file[obj.caracter];
  const token = { lexema: '', simbolo: '' };
  obj.caracter += 1;

  if (obj.file[obj.caracter] === '=') {
    dpontos += obj.file[obj.caracter];
    token.lexema = dpontos;
    token.simbolo = 'satribuicao';
    obj.caracter += 1;
  } else {
    token.lexema = dpontos;
    token.simbolo = 'sdoispontos';
  }
  return token;
};
