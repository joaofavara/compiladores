const { app } = require("electron");

module.exports = class AnalisadorSintatico {
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

    insere_tabela(lexema, tipoLexema , nivel, rotulo) {
        const obj = {
            lexema,
            tipoLexema,
            nivel,
            rotulo
        };

        this.tabelaDeSimbolos.push(obj);
    }

    coloca_tipo_tabela(lexema) {

    }

    pesquisa_duplic_var_tabela(token.lexema) {

    }
    pesquisa_declvar_tabela(token.lexema)
    pesquisa_declvarfunc_tabela(token.lexema)
    pesquisa_declproc_tabela(token.lexema)
    pesquisa_declfunc_tabela(token.lexema)
};

