/* eslint-disable class-methods-use-this */
module.exports = class AnalisadorSemantico {
  constructor() {
    this.tabelaDeSimbolos = [];
    this.nivel = 0;
  }

  insereTabela(lexema, tipoLexema, rotulo = null) {
    const obj = {
      lexema,
      tipoLexema,
      nivel: this.nivel,
      rotulo,
    };

    this.tabelaDeSimbolos.unshift(obj);
  }

  colocaTipoTabela(tipo) {
    this.tabelaDeSimbolos = this.tabelaDeSimbolos.map((elemento) => {
      if (elemento.tipoLexema === 'variavel') {
        // eslint-disable-next-line no-param-reassign
        elemento.tipoLexema = tipo;
      }

      return elemento;
    });
  }

  colocaTipoFuncao(tipo) {
    const ultimoSimbolo = this.tabelaDeSimbolos.length - 1;
    if (tipo === 'sinteiro') {
      this.tabelaDeSimbolos[ultimoSimbolo].tipoLexema = 'funcao inteiro';
    } else {
      this.tabelaDeSimbolos[ultimoSimbolo].tipoLexema = 'funcao booleana';
    }
  }

  pesquisaTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos;
    let simboloEncontrado = {};

    tabAux.forEach((element) => {
      if (element.lexema === lexema && (element.tipoLexema === 'funcao inteiro' || element.tipoLexema === 'funcao booleana' || element.tipoLexema === 'inteiro' || element.tipoLexema === 'booleano')) {
        simboloEncontrado = element;
      }
    });

    return simboloEncontrado;
  }

  confereTipoSimbolo(simbolo) {
    if (simbolo.tipoLexema === 'funcao inteiro' || simbolo.tipoLexema === 'funcao booleana') {
      return true;
    }
    return false;
  }

  pesquisaDuplicVarTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos;
    let teste = false;

    tabAux.forEach((element) => {
      if (element.nivel === this.nivel && element.lexema === lexema) {
        teste = true;
      } else if (element.nivel !== this.nivel && element.lexema === lexema && (element.tipoLexema === 'procedimento' || element.tipoLexema === 'funcao inteiro' || element.tipoLexema === 'funcao booleana' || element.tipoLexema === 'nomedeprograma')) {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclvarTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos;
    let teste = false;

    tabAux.forEach((element) => {
      if (element.lexema === lexema && (element.tipoLexema === 'inteiro' || element.tipoLexema === 'booleano')) {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclvarfuncTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos;
    let teste = false;

    tabAux.forEach((element) => {
      if (element.lexema === lexema && (element.tipoLexema === 'funcao inteiro' || element.tipoLexema === 'funcao booleana' || element.tipoLexema === 'inteiro' || element.tipoLexema === 'booleano')) {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclprocTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos;
    let teste = false;

    tabAux.forEach((element) => {
      if (element.lexema === lexema && element.tipoLexema === 'procedimento') {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclfuncTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos;
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
    this.tabelaDeSimbolos = this.tabelaDeSimbolos.filter((elemento) => elemento.nivel !== this.nivel || (elemento.tipoLexema !== 'inteiro' && elemento.tipoLexema !== 'booleano'));
    this.nivel -= 1;
    this.tabelaDeSimbolos[this.tabelaDeSimbolos.length - 1].nivel = this.nivel;
  }

  incrementaNivel() {
    this.nivel += 1;
  }
};
