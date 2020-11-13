/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
module.exports = class AnalisadorSemantico {
  constructor() {
    this._tabelaDeSimbolos = [];
    this._nivel = 0;
  }

  insereTabela(lexema, tipoLexema, rotulo = null) {
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
    const ultimoSimbolo = this._tabelaDeSimbolos.length - 1;
    if (tipo === 'sinteiro') {
      this._tabelaDeSimbolos[ultimoSimbolo].tipoLexema = 'funcao inteiro';
    } else {
      this._tabelaDeSimbolos[ultimoSimbolo].tipoLexema = 'funcao booleana';
    }
  }

  pesquisaFator(lexema) {
    const tabAux = this._tabelaDeSimbolos;
    let simboloEncontrado = {};
    tabAux.forEach((element) => {
      if (element.lexema === lexema && (element.tipoLexema === 'funcao inteiro' || element.tipoLexema === 'funcao booleana' || element.tipoLexema === 'inteiro' || element.tipoLexema === 'booleano')) {
        simboloEncontrado = element;
      }
    });

    return simboloEncontrado;
  }

  confereTipoFuncao(simbolo) {
    if (simbolo.tipoLexema === 'funcao inteiro' || simbolo.tipoLexema === 'funcao booleana') {
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
      } else if (element.nivel !== this._nivel && element.lexema === lexema && (element.tipoLexema === 'procedimento' || element.tipoLexema === 'funcao inteiro' || element.tipoLexema === 'funcao booleana' || element.tipoLexema === 'nomedeprograma')) {
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
      if (element.lexema === lexema && (element.tipoLexema === 'funcao inteiro' || element.tipoLexema === 'funcao booleana' || element.tipoLexema === 'inteiro' || element.tipoLexema === 'booleano')) {
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
      if (element.lexema === lexema && (element.tipoLexema === 'funcao inteiro' || element.tipoLexema === 'funcao booleana')) {
        teste = true;
      }
    });

    return teste;
  }

  desempilhaNivel() {
    // eslint-disable-next-line max-len
    this._tabelaDeSimbolos = this._tabelaDeSimbolos.filter((elemento) => elemento.nivel !== this._nivel || (elemento.tipoLexema !== 'inteiro' && elemento.tipoLexema !== 'booleano'));
    this._nivel -= 1;
    this._tabelaDeSimbolos[this._tabelaDeSimbolos.length - 1].nivel = this._nivel;
  }

  incrementaNivel() {
    this._nivel += 1;
  }
};
