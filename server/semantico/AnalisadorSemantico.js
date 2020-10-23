const { app } = require('electron');

module.exports = class AnalisadorSemantico {
  constructor() {
    this.tabelaDeSimbolos = [];
    this.nivel = 0;
  }

  /*
    –Token. Lexema = lexema do token
    –tipo do lexema = nome de programa, variável, procedimento, função inteiro, função boolean.
    –Nível: L: marca ou novo galho
    –Rótulo: Para geração de código
  */

  insere_tabela(lexema, tipoLexema, nivel, rotulo) {
    const obj = {
      lexema,
      tipoLexema,
      nivel,
      rotulo,
    };

    this.tabelaDeSimbolos.push(obj);
  }

  coloca_tipo_tabela(lexema) {

  }

  pesquisaDuplicVarTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos;
    let declarado = tabAux.pop();

    while (declarado && declarado.nivel === this.nivel) {
      if (declarado.lexema === lexema) {
        return false;
      }
      declarado = tabAux.pop();
    }

    while (declarado) {
      if ((declarado.tipoLexema === 'procedimento' || declarado.tipoLexema === 'funcao' || declarado.tipoLexema === 'nome_de_programa') && declarado.lexema === lexema) {
        return false;
      }
      declarado = tabAux.pop();
    }

    return true;
  }

  pesquisaDeclvarTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos.invert();
    let teste = false;

    tabAux.forEach((element) => {
      if (element.tipoLexema === 'variavel' && element.lexema === lexema) {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclvarfuncTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos.invert();
    let teste = false;

    tabAux.forEach((element) => {
      if ((element.tipoLexema === 'funcao' || element.tipoLexema === 'variavel') && element.lexema === lexema) {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclprocTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos.invert();
    let teste = false;

    tabAux.forEach((element) => {
      if (element.tipoLexema === 'procedimento' && element.lexema === lexema) {
        teste = true;
      }
    });

    return teste;
  }

  pesquisaDeclfuncTabela(lexema) {
    const tabAux = this.tabelaDeSimbolos.invert();
    let teste = false;

    tabAux.forEach((element) => {
      if (element.tipoLexema === 'funcao' && element.lexema === lexema) {
        teste = true;
      }
    });

    return teste;
  }

  desempilhaNivel() {
    this.tabelaDeSimbolos = this.tabelaDeSimbolos.map((elemento) => {
      if (elemento.nivel !== this.nivel) {
        return elemento;
      }
    });

    this.nivel -= 1;
  }
};
