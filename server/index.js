const TratadorLex = require('./lexico/TratadorLexico.js');
const AnalisadorSint = require('./sintatico/AnalisadorSintatico.js');

module.exports = async (code) => {
  const tLexico = new TratadorLex(code);
  const aSintatico = new AnalisadorSint(tLexico);

  aSintatico.analisarPrograma();
};
