/* eslint-disable no-param-reassign */
const trataDigito = require('./trataDigito');
const trataIdentificadorPalavraReservada = require('./trataIdentificadorPalavraReservada');
const trataAtribuicao = require('./trataAtribuicao');
const trataOperadorAritmetico = require('./trataOperadorAritmetico');
const trataOperadorRelacional = require('./trataOperadorRelacional');
const trataPontuacao = require('./trataPontuacao');

module.exports = (obj) => {
  if (!obj.file[obj.caracter].isNaN()) {
    trataDigito(obj);
  } else if (obj.file[obj.caracter].isNaN()) {
    trataIdentificadorPalavraReservada(obj);
  } else if (obj.file[obj.caracter] === ':') {
    trataAtribuicao(obj);
  } else if (['+', '-', '*'].includes(obj.file[obj.caracter])) {
    trataOperadorAritmetico(obj);
  } else if (['<', '>', '='].includes(obj.file[obj.caracter])) {
    trataOperadorRelacional(obj);
  } else if ([';', '(', ')', '.', ','].includes(obj.file[obj.caracter])) {
    trataPontuacao(obj);
  } else {
    console.log('ERRO!');
  }
};
