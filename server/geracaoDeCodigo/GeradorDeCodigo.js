/* eslint-disable no-lonely-if */
/* eslint-disable no-underscore-dangle */
const fs = require('fs');

module.exports = class GeradorDeCodigo {
  constructor() {
    this.labelSubrotina = 1;
    this.labelSesenao = 1;
    this.labelEnquanto = 1;
    this.instrucoes = [];
    this.quantidadeAlocada = 0;
  }

  gerarJump(jump, label) {
    this.instrucoes.push([jump, label]);
  }

  gerarLabel(tipoLabel) {
    let numeroLabel;

    if (tipoLabel === 'SUBROTINA') {
      numeroLabel = this.labelSubrotina;
      this.labelSubrotina += 1;
    } else if (tipoLabel === 'SESENAO') {
      numeroLabel = this.labelSesenao;
      this.labelSesenao += 1;
    } else if (tipoLabel === 'ENQUANTO') {
      numeroLabel = this.labelEnquanto;
      this.labelEnquanto += 1;
    }

    return `${tipoLabel}${numeroLabel}`;
  }

  inserirLabel(label) {
    this.instrucoes.push([label, 'NULL']);
  }

  gerarAlocacaoDesalocacao(instrucao, atributo1) {
    if (instrucao === 'ALLOC') {
      this.instrucoes.push([instrucao, this.quantidadeAlocada, atributo1]);
      this.quantidadeAlocada += atributo1;
    } else if (instrucao === 'DALLOC') {
      this.instrucoes.push([instrucao, this.quantidadeAlocada - atributo1, atributo1]);
      this.quantidadeAlocada -= atributo1;
    }
  }

  gerarInstrucao(instrucao, atributo1 = undefined) {
    if (atributo1 !== undefined) {
      this.instrucoes.push([instrucao, atributo1]);
    } else {
      this.instrucoes.push([instrucao]);
    }
  }

  gerarArquivo() {
    let codigo = '';
    this.instrucoes.forEach((element) => {
      codigo += `${element}\n`;
    });

    console.log('codigo: ', codigo);

    fs.writeFileSync('./codigo.txt', codigo);
    return './codigo.txt';
  }
};
