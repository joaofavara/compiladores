/* eslint-disable no-underscore-dangle */
const precedenciaOPeradores = require('./PrecedenciaDeOperadores');

module.exports = class AnalisadorSemantico {
  constructor() {
    this._lista = [];
    this._pilha = [];
  }

  _colocaElementoLista(elemento) {
    this._lista.push(elemento);
  }

  _colocaElementoPilha(elemento) {
    let ultimoElemento = this._pilha[this._pilha.length - 1];
    let prioridade;

    precedenciaOPeradores.forEach((precedencia) => {
      // eslint-disable-next-line max-len
      if (precedencia.operadores.includes(elemento)) {
        prioridade = precedencia.prioridade;
        if (ultimoElemento.prioridade > precedencia.prioridade) {
          this._lista.push(ultimoElemento);
          this._desemplinhaElementoPilha();
          ultimoElemento = this._pilha[this._pilha.length - 1];
        }
      }
    });

    this._pilha.push({
      operador: elemento,
      prioridade,
    });
  }

  _desemplinhaElementoPilha() {
    this._pilha.pop();
  }
};
