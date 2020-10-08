const analisaLexico = require('../lexico/index');
// const analisaBloco = require('./analisaBloco');
const AnalisadorSint = require('./AnalisadorSintatico.js');

module.exports = async (file) => {
  const sintatico = new AnalisadorSint(await analisaLexico(file));
  sintatico.lertoken();
  if (sintatico.tokenAtual.simbolo === 'sprograma') {
    sintatico.lertoken();
    if (sintatico.tokenAtual.simbolo === 'sidentificador') {
      sintatico.lertoken();
      if (sintatico.tokenAtual.simbolo === 'spontovirgula') {
        sintatico.analisaBloco();
        if (sintatico.tokenAtual.simbolo === 'sponto') {
          sintatico.lertoken();
          if (sintatico.listaTokens.length === 0) {
            console.log('Fim da execucao\n');
          } else {
            throw new Error(`Error: ${sintatico.tokenAtual.lexema} - ${sintatico.tokenAtual.simbolo} ${sintatico.tokenAtual.row} ${sintatico.tokenAtual.column}`);
          }
        } else {
          throw new Error(`Error: ${sintatico.tokenAtual.lexema} - ${sintatico.tokenAtual.simbolo} ${sintatico.tokenAtual.row} ${sintatico.tokenAtual.column}`);
        }
      } else {
        throw new Error(`Error: ${sintatico.tokenAtual.lexema} - ${sintatico.tokenAtual.simbolo}`);
      }
    } else {
      throw new Error(`Error: ${sintatico.tokenAtual.lexema} - ${sintatico.tokenAtual.simbolo}`);
    }
  } else {
    throw new Error(`Error: ${sintatico.tokenAtual.lexema} - ${sintatico.tokenAtual.simbolo}`);
  }
};
