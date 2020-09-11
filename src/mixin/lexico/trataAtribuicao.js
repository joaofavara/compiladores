/* eslint-disable no-param-reassign */
module.exports = (obj) => {
  let dpontos = obj.file[obj.caracter];
  const token = { lexema: '', simbolo: '' };
  obj.caracter += 1;

  if (obj.file[obj.caracter] === '=') {
    dpontos += obj.file[obj.caracter];
    token.lexema = dpontos;
    token.simbolo = 'satribuicao';
  } else {
    token.lexema = dpontos;
    token.simbolo = 'sdoispontos';
  }
  obj.lista = token;
};
