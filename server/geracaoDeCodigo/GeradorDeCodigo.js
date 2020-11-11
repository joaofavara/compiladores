/* eslint-disable no-underscore-dangle */
const precedenciaOPeradores = require('./PrecedenciaDeOperadores');
const AnalisadorSem = require('../semantico/AnalisadorSemantico');

module.exports = class AnalisadorSemantico {
  constructor() {
    this._aSemantico = new AnalisadorSem();
    this._lista = [];
    this._pilha = [];
  }

  colocaElementoLista(elemento, tipoElemento = undefined) {
    let tipo = tipoElemento;

    if (!tipo) {
      if (/[0-9]/.test(elemento)) {
        tipo = 'inteiro';
      } else if (elemento === 'verdadeiro' || elemento === 'falso') {
        tipo = 'booleano';
      } else if (/[\W]|[nao]|[e]|[ou]|[div]|[-u]|[+u]/.test(elemento)) {
        tipo = 'operador';
      }
    }

    this._lista.push({ elemento, tipo });
  }

  colocaElementoPilha(novoElemento) {
    const ultimoElemento = this._pilha[this._pilha.length - 1];
    let prioridade;

    if (novoElemento !== '(' && novoElemento !== ')') {
      precedenciaOPeradores.every((precedencia) => {
        if (precedencia.operadores.includes(novoElemento)) {
          prioridade = precedencia.prioridade;
          if (ultimoElemento) {
            this._desempilhaElementosPilha(prioridade);
          } else {
            return false;
          }
        }
        return true;
      });
      this._pilha.push({
        operador: novoElemento,
        prioridade,
      });
    } else if (novoElemento === ')') {
      this._desempilhaElementosPilha(0);
      this._pilha.pop();
    } else {
      prioridade = 0;
      this._pilha.push({
        operador: novoElemento,
        prioridade,
      });
    }
  }

  descarregaPilha() {
    this._desempilhaElementosPilha(0);
    // console.log(this._lista);
    // console.log('----------------\n');
    this._lista = [];
  }

  _desempilhaElementosPilha(prioridade) {
    let ultimoElemento = this._pilha[this._pilha.length - 1];
    while (ultimoElemento && ultimoElemento.operador !== '(' && ultimoElemento.prioridade >= prioridade) {
      this._pilha.pop();
      this.colocaElementoLista(ultimoElemento.operador);
      ultimoElemento = this._pilha[this._pilha.length - 1];
    }
  }
};
