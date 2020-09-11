/* eslint-disable no-param-reassign */
const trataDigito = require('./trataDigito');
const trataIdentificadorPalavraReservada = require('./trataIdentificadorPalavraReservada');
const trataAtribuicao = require('./trataAtribuicao');
const trataOperadorAritmetico = require('./trataOperadorAritmetico');
const trataOperadorRelacional = require('./trataOperadorRelacional');
const trataPontuacao = require('./trataPontuacao');

module.exports = (obj) => {
  if (/[0-9]/.test(obj.file[obj.caracter])) {
    trataDigito(obj);
  } else if (/[a-zA-Z]/.test(obj.file[obj.caracter])) {
    trataIdentificadorPalavraReservada(obj);
  } else if (obj.file[obj.caracter] === ':') {
    trataAtribuicao(obj);
  } else if (['+', '-', '*'].includes(obj.file[obj.caracter])) {
    trataOperadorAritmetico(obj);
  } else if (['<', '>', '=', '!'].includes(obj.file[obj.caracter])) {
    trataOperadorRelacional(obj);
  } else if ([';', '(', ')', '.', ','].includes(obj.file[obj.caracter])) {
    trataPontuacao(obj);
  } else {
    return -1;
  }

  return 1;
};
