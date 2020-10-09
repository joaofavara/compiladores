const fs = require('fs');
const TratadorLex = require('./lexico/TratadorLexico.js');
const AnalisadorSint = require('./sintatico/AnalisadorSintatico.js');

module.exports = async (path) => {
  const code = fs.readFileSync(path, 'utf8');
  const tLexico = new TratadorLex(code);
  const aSintatico = new AnalisadorSint(tLexico);

  aSintatico.analisarPrograma();
};
