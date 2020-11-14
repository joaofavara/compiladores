/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
module.exports = class AnalisadorSemantico {
  constructor() {
    this._tabelaDeSimbolos = [];
    this._nivel = 0;
    this._testeRetornoFunc = false;
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
    // eslint-disable-next-line max-len
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
};
