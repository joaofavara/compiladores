/* eslint-disable no-lonely-if */
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

  descarregaPilhaComparaTipo(tipo) {
    this._desempilhaElementosPilha(0);

    const tipoExpressao = this._conferirTipo();
    // console.log(this._lista);
    // console.log(`retorno: ${tipoExpressao} ${tipo}\n`);
    // console.log('----------------\n');
    this._lista = [];
    if (tipo !== tipoExpressao) {
      return false;
    }

    return true;
  }

  _desempilhaElementosPilha(prioridadeAtual) {
    let ultimoElemento = this._pilha[this._pilha.length - 1];
    while (ultimoElemento && ultimoElemento.operador !== '(' && ultimoElemento.prioridade >= prioridadeAtual) {
      this._pilha.pop();
      this.colocaElementoLista(ultimoElemento.operador);
      ultimoElemento = this._pilha[this._pilha.length - 1];
    }
  }

  _conferirTipo() {
    const listaAux = this._lista.map((objeto) => ({ ...objeto }));

    for (let i = 0; i < listaAux.length; i += 1) {
      if (listaAux[i].tipo === 'operador') {
        if (listaAux[i].elemento === '-u' || listaAux[i].elemento === '+u') {
          if (listaAux[i - 1].tipo !== 'inteiro') {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            listaAux[i - 1].elemento = listaAux[i - 1].elemento + listaAux[i].elemento;
            listaAux.splice(i, 1);
            i -= 1;
          }
        } else if (listaAux[i].elemento === 'not') {
          if (listaAux[i - 1].tipo !== 'booleano') {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            listaAux[i - 1].elemento = listaAux[i - 1].elemento + listaAux[i].elemento;
            listaAux.splice(i, 1);
            i -= 1;
          }
        } else if (listaAux[i].elemento === 'e' || listaAux[i].elemento === 'ou') {
          if (listaAux[i - 1].tipo !== 'booleano' && listaAux[i - 2].tipo !== 'booleano') {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            // eslint-disable-next-line max-len
            listaAux[i - 2].elemento = listaAux[i - 2].elemento + listaAux[i - 1].elemento + listaAux[i].elemento;
            listaAux.splice(i - 1, 2);
            i -= 2;
          }
        } else if (['+', '-', '*', 'div'].includes(listaAux[i].elemento)) {
          if (listaAux[i - 1].tipo !== 'inteiro' && listaAux[i - 2].tipo !== 'inteiro') {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            // eslint-disable-next-line max-len
            listaAux[i - 2].elemento = listaAux[i - 2].elemento + listaAux[i - 1].elemento + listaAux[i].elemento;
            listaAux.splice(i - 1, 2);
            i -= 2;
          }
        } else if (['>', '>=', '<', '<=', '=', '!='].includes(listaAux[i].elemento)) {
          if (listaAux[i - 1].tipo !== 'inteiro' && listaAux[i - 2].tipo !== 'inteiro') {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            // eslint-disable-next-line max-len
            listaAux[i - 2].elemento = listaAux[i - 2].elemento + listaAux[i - 1].elemento + listaAux[i].elemento;
            listaAux[i - 2].tipo = 'booleano';
            listaAux.splice(i - 1, 2);
            i -= 2;
          }
        }
      }
    }

    return listaAux[0].tipo;
  }
};
