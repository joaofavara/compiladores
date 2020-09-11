/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
module.exports = (obj) => {
  let num = obj.file[obj.caracter];
  const token = { lexema: '', simbolo: '' };

  obj.caracter += 1;

  while (!isNaN(obj.file[obj.caracter])) {
    num += obj.file[obj.caracter];
    obj.caracter += 1;
  }

  token.lexema = num;
  token.simbolo = 'snumero';
  obj.lista = token;
};
