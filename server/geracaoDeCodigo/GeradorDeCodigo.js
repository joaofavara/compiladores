/* eslint-disable no-lonely-if */
/* eslint-disable no-underscore-dangle */
module.exports = class GeradorDeCodigo {
  constructor() {
    this.label = 1;
    this.instrucoes = [];
    this.alocacao = [];
    this.quantidadeAlocada = 0;
  }

  gerarProcedimentoFunc(label) {
    this.instrucoes.push([label, 'NULL']);
  }

  gerarLabel() {
    this.label += 1;
    return `label${this.label - 1}`;
  }

  escreverLabel(label) {
    this.instrucoes.push([label, 'NULL']);
  }

  gerarInstrucao(instrucao, atributo1 = undefined, atributo2 = undefined) {
    if (atributo2 !== undefined) {
      this.instrucoes.push([instrucao, atributo1, atributo2]);
    } else if (atributo1 !== undefined) {
      if (instrucao === 'ALLOC') {
        this.instrucoes.push([instrucao, this.quantidadeAlocada, atributo1]);
        this.quantidadeAlocada += atributo1;
        this.alocacao.push(atributo1);
      } else {
        this.instrucoes.push([instrucao, atributo1]);
      }
    } else {
      if (instrucao === 'DALLOC') {
        const quantidade = this.alocacao.pop();
        this.instrucoes.push([instrucao, this.quantidadeAlocada - quantidade, quantidade]);
      } else {
        this.instrucoes.push([instrucao]);
      }
    }
  }
};
