const TratadorLexico = require('./lexico/TratadorLexico.js');
const AnalisadorSintatico = require('./sintatico/AnalisadorSintatico');
const AnalisadorSemantico = require('./semantico/AnalisadorSemantico');
const GeradorDeCodigo = require('./geracaoDeCodigo/GeradorDeCodigo');

module.exports = async (code) => {
  const tLexico = new TratadorLexico(code);
  const gCodigo = new GeradorDeCodigo();
  const aSemantico = new AnalisadorSemantico(gCodigo);

  const aSintatico = new AnalisadorSintatico(tLexico, aSemantico, gCodigo);

  aSintatico.analisarPrograma();
};
