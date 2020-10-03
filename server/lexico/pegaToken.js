/* eslint-disable no-param-reassign */
const trataDigito = require('./trataDigito');
const trataIdentificadorPalavraReservada = require('./trataIdentificadorPalavraReservada');
const trataAtribuicao = require('./trataAtribuicao');
const trataOperadorAritmetico = require('./trataOperadorAritmetico');
const trataOperadorRelacional = require('./trataOperadorRelacional');
const trataPontuacao = require('./trataPontuacao');

module.exports = (obj) => {
  if (/[0-9]/.test(obj.file[obj.caracter])) {
    return trataDigito(obj);
  } if (/[a-zA-Z]/.test(obj.file[obj.caracter])) {
    return trataIdentificadorPalavraReservada(obj);
  } if (obj.file[obj.caracter] === ':') {
    return trataAtribuicao(obj);
  } if (['+', '-', '*'].includes(obj.file[obj.caracter])) {
    return trataOperadorAritmetico(obj);
  } if (['<', '>', '=', '!'].includes(obj.file[obj.caracter])) {
    return trataOperadorRelacional(obj);
  } if ([';', '(', ')', '.', ','].includes(obj.file[obj.caracter])) {
    return trataPontuacao(obj);
  }
  return -1;
};
