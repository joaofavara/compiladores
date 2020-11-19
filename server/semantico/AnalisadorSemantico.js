/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const precedenciaOPeradores = require('./PrecedenciaDeOperadores');
const operacoes = require('./Operacao');

module.exports = class AnalisadorSemantico {
  constructor(geradorCodigo) {
    this._tabelaDeSimbolos = [];
    this._nivel = 0;
    this._testeRetornoFunc = false;
    this._lista = [];
    this._pilha = [];
    this.geradorDeCodigo = geradorCodigo;
  }

  insereTabela(lexema, tipoLexema, rotulo = -1) {
    const simbolo = {
      lexema,
      tipoLexema,
      nivel: this._nivel,
      rotulo,
    };

    this._tabelaDeSimbolos.unshift(simbolo);
  }

  colocaTipoTabela(tipo) {
    this._tabelaDeSimbolos = this._tabelaDeSimbolos.map((elemento) => {
      if (elemento.tipoLexema === 'variavel') {
        // eslint-disable-next-line no-param-reassign
        elemento.tipoLexema = tipo;
      }

      return elemento;
    });
  }

  colocaTipoFuncao(tipo) {
    if (tipo === 'sinteiro') {
      this._tabelaDeSimbolos[0].tipoLexema = 'funcaoInteira';
    } else {
      this._tabelaDeSimbolos[0].tipoLexema = 'funcaoBooleana';
    }
  }

  pesquisaFator(lexema) {
    const tabAux = this._tabelaDeSimbolos;
    let simboloEncontrado = {};
    tabAux.forEach((element) => {
      if (element.lexema === lexema && (element.tipoLexema === 'funcaoInteira' || element.tipoLexema === 'funcaoBooleana' || element.tipoLexema === 'inteiro' || element.tipoLexema === 'booleano')) {
        simboloEncontrado = element;
      }
    });

    return simboloEncontrado;
  }

  confereTipoFuncao(simbolo) {
    if (simbolo.tipoLexema === 'funcaoInteira' || simbolo.tipoLexema === 'funcaoBooleana') {
      return true;
    }
    return false;
  }

  pesquisaDuplicVarTabela(lexema) {
    const tabAux = this._tabelaDeSimbolos;
    let teste = false;

    tabAux.forEach((element) => {
      if (element.nivel === this._nivel && element.lexema === lexema) {
        teste = true;
      } else if (element.nivel !== this._nivel && element.lexema === lexema && (element.tipoLexema === 'procedimento' || element.tipoLexema === 'funcaoInteira' || element.tipoLexema === 'funcaoBooleana' || element.tipoLexema === 'nomedeprograma')) {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclvarTabela(lexema) {
    const tabAux = this._tabelaDeSimbolos;
    let teste = false;

    tabAux.forEach((element) => {
      if (element.lexema === lexema && (element.tipoLexema === 'inteiro' || element.tipoLexema === 'booleano')) {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclvarfuncTabela(lexema) {
    const tabAux = this._tabelaDeSimbolos;
    let teste = false;

    tabAux.forEach((element) => {
      if (element.lexema === lexema && (element.tipoLexema === 'funcaoInteira' || element.tipoLexema === 'funcaoBooleana' || element.tipoLexema === 'inteiro' || element.tipoLexema === 'booleano')) {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclprocTabela(lexema) {
    const tabAux = this._tabelaDeSimbolos;
    let teste = false;

    tabAux.forEach((element) => {
      if (element.lexema === lexema && element.tipoLexema === 'procedimento') {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclfuncTabela(lexema) {
    const tabAux = this._tabelaDeSimbolos;
    let teste = false;

    tabAux.forEach((element) => {
      if (element.lexema === lexema && (element.tipoLexema === 'funcaoInteira' || element.tipoLexema === 'funcaoBooleana')) {
        teste = true;
      }
    });

    return teste;
  }

  desempilhaNivel() {
    for (let i = 0; i < this._tabelaDeSimbolos.length - 1; i += 1) {
      if (this._nivel > this._tabelaDeSimbolos[i + 1].nivel) {
        break;
      }
      this._tabelaDeSimbolos.shift();
      i -= 1;
    }
    this._nivel -= 1;
    this._tabelaDeSimbolos[0].nivel = this._nivel;
  }

  confirmarRetorno(validade) {
    if (validade === true) {
      console.log();
    }
    this._testeRetornoFunc = validade;
  }

  incrementaNivel() {
    this._nivel += 1;
  }

  colocaElementoLista(elemento, tipoElemento = undefined, rotulo = -1) {
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

    this._lista.push({ elemento, tipo, rotulo });
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
    this._lista = [];
    if ((tipoExpressao === 'inteiro' || tipoExpressao === 'funcaoInteira') && (tipo === 'inteiro' || tipo === 'funcaoInteira')) {
      return true;
    }

    if ((tipoExpressao === 'booleano' || tipoExpressao === 'funcaoBooleana') && (tipo === 'booleano' || tipo === 'funcaoBooleana')) {
      return true;
    }

    return false;
  }

  _desempilhaElementosPilha(prioridadeAtual) {
    let ultimoElemento = this._pilha[this._pilha.length - 1];
    while (ultimoElemento && ultimoElemento.operador !== '(' && ultimoElemento.prioridade >= prioridadeAtual) {
      this._pilha.pop();
      this.colocaElementoLista(ultimoElemento.operador);
      ultimoElemento = this._pilha[this._pilha.length - 1];
    }
  }

  _confereGeracaoElemento(lexema, tipo, rotulo) {
    if (['funcaoBooleana', 'funcaoInteira'].includes(tipo)) {
      this.geradorDeCodigo.gerarInstrucao('CALL', lexema);
    } else if (rotulo !== -1) {
      this.geradorDeCodigo.gerarInstrucao('LDV', rotulo);
    } else {
      this.geradorDeCodigo.gerarInstrucao('LDC', lexema);
    }
  }

  _confereGeracaoOperacao(operacao) {
    this.geradorDeCodigo.gerarInstrucao(operacoes[operacao]);
  }

  _conferirTipo() {
    const listaAux = this._lista.map((objeto) => ({ ...objeto }));

    for (let i = 0; i < listaAux.length; i += 1) {
      if (listaAux[i].tipo === 'operador') {
        if (listaAux[i].elemento === '-u' || listaAux[i].elemento === '+u') {
          if (!['funcaoInteira', 'inteiro'].includes(listaAux[i - 1].tipo)) {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            listaAux[i - 1].elemento = listaAux[i - 1].elemento + listaAux[i].elemento;
            this._confereGeracaoOperacao(listaAux[i].elemento);
            listaAux.splice(i, 1);
            i -= 1;
          }
        } else if (listaAux[i].elemento === 'not') {
          if (!['funcaoBooleana', 'booleano'].includes(listaAux[i - 1].tipo)) {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            listaAux[i - 1].elemento = listaAux[i - 1].elemento + listaAux[i].elemento;
            this._confereGeracaoOperacao(listaAux[i].elemento);
            listaAux.splice(i, 1);
            i -= 1;
          }
        } else if (listaAux[i].elemento === 'e' || listaAux[i].elemento === 'ou') {
          if (!['funcaoBooleana', 'booleano'].includes(listaAux[i - 1].tipo) && !['funcaoBooleana', 'booleano'].includes(listaAux[i - 2].tipo)) {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            listaAux[i - 2].elemento = listaAux[i - 2].elemento + listaAux[i - 1].elemento + listaAux[i].elemento;
            this._confereGeracaoOperacao(listaAux[i].elemento);
            listaAux.splice(i - 1, 2);
            i -= 2;
          }
        } else if (['+', '-', '*', 'div'].includes(listaAux[i].elemento)) {
          if (!['funcaoInteira', 'inteiro'].includes(listaAux[i - 1].tipo) && !['funcaoInteira', 'inteiro'].includes(listaAux[i - 2].tipo)) {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            listaAux[i - 2].elemento = listaAux[i - 2].elemento + listaAux[i - 1].elemento + listaAux[i].elemento;
            this._confereGeracaoOperacao(listaAux[i].elemento);
            listaAux.splice(i - 1, 2);
            i -= 2;
          }
        } else if (['>', '>=', '<', '<=', '=', '!='].includes(listaAux[i].elemento)) {
          if (!['funcaoInteira', 'inteiro'].includes(listaAux[i - 1].tipo) && !['funcaoInteira', 'inteiro'].includes(listaAux[i - 2].tipo)) {
            listaAux[0].tipo = 'erro';
            break;
          } else {
            listaAux[i - 2].elemento = listaAux[i - 2].elemento + listaAux[i - 1].elemento + listaAux[i].elemento;
            listaAux[i - 2].tipo = 'booleano';
            this._confereGeracaoOperacao(listaAux[i].elemento);
            listaAux.splice(i - 1, 2);
            i -= 2;
          }
        }
      } else {
        this._confereGeracaoElemento(listaAux[i].elemento, listaAux[i].tipoElemento, listaAux[i].rotulo);
      }
    }

    return listaAux[0].tipo;
  }
};
