const TratadorLexico = require('./lexico/TratadorLexico.js');
const AnalisadorSintatico = require('./sintatico/AnalisadorSintatico.js');
const AnalisadorSemantico = require('./semantico/AnalisadorSemantico');

module.exports = async (code) => {
  const tLexico = new TratadorLexico(code);
  const aSemantico = new AnalisadorSemantico();
  const aSintatico = new AnalisadorSintatico(tLexico, aSemantico);

  aSintatico.analisarPrograma();
};
