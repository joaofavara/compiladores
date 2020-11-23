/* eslint-disable max-len */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-underscore-dangle */
module.exports = class AnalisadorSintatico {
  constructor(tratadorLexico, analisadorSemantico, geradorDeCodigo) {
    this._tratadorLexico = tratadorLexico;
    this._analisadorSemantico = analisadorSemantico;
    this._geradorCodigo = geradorDeCodigo;
    this._tokenAnterior = undefined;
    this._tokenAtual = undefined;
  }

  analisarPrograma() {
    this._lertoken();
    if (this._tokenAtual.simbolo === 'sprograma') {
      this._lertoken();
      if (this._tokenAtual.simbolo === 'sidentificador') {
        this._analisadorSemantico.insereTabela(this._tokenAtual.lexema, 'nomedeprograma', null);
        this._lertoken();
        if (this._tokenAtual.simbolo === 'spontovirgula') {
          this._geradorCodigo.gerarInstrucao('START');
          this._geradorCodigo.gerarAlocacaoDesalocacao('ALLOC', 1);
          this._analisarBloco();
          if (this._tokenAtual && this._tokenAtual.simbolo === 'sponto') {
            this._lertoken();
            if (this._tokenAtual === undefined) {
              this._geradorCodigo.gerarAlocacaoDesalocacao('DALLOC', 1);
              this._geradorCodigo.gerarInstrucao('HLT');

              console.log('\n\nFim da execucao\n');
              return this._geradorCodigo.gerarArquivo();
            }
            throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. O programa deve encerrar com ".":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
          } else {
            if (!this._tokenAtual) {
              throw new Error('Token "." esperado no fim do programa');
            }
            throw new Error(`Token "${this._tokenAtual.lexema}" inesperado:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. O programa deve iniciar com "programa":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
  }

  _lertoken() {
    this._tokenAnterior = this._tokenAtual;
    this._tokenAtual = this._tratadorLexico.adquirirToken();
  }

  _analisarAtribChprocedimento(nomeFuncao) {
    this._lertoken();
    if (this._tokenAtual.simbolo === 'satribuicao') {
      this._analisarAtribuicao(nomeFuncao);
    } else {
      this._analisarChamadaDeProcedimento();
    }
  }

  _analisarAtribuicao(nomeFuncao) {
    const linhaInicial = this._tokenAtual.linha;
    const colunaInicial = this._tokenAtual.coluna;
    const tokenVariavel = this._tokenAnterior;

    this._lertoken();
    this._analisarExpressaoSimples();

    const simbolo = this._analisadorSemantico.pesquisaFator(tokenVariavel.lexema);
    if (!this._analisadorSemantico.descarregaPilhaComparaTipo(simbolo.tipoLexema)) {
      throw new Error(`Expressão invalida. Os tipos são incompativeis:${linhaInicial}:${colunaInicial} `);
    }

    if (simbolo.rotulo >= 0) {
      this._geradorCodigo.gerarInstrucao('STR', simbolo.rotulo);
    }

    if (simbolo.lexema === nomeFuncao) {
      this._geradorCodigo.gerarInstrucao('STR', 0);
      this._analisadorSemantico.confirmarRetorno(true);
    }
  }

  _analisarChamadaDeFuncao() {
    this._lertoken();
  }

  _analisarChamadaDeProcedimento() {
    if (!this._analisadorSemantico.pesquisaDeclprocTabela(this._tokenAnterior.lexema)) {
      throw new Error(`Procedimento "${this._tokenAnterior.lexema}" nao declarado:${this._tokenAnterior.linha}:${this._tokenAnterior.coluna} `);
    } else {
      this._geradorCodigo.gerarInstrucao('CALL', this._tokenAnterior.lexema);
    }
  }

  _analisarBloco(nomeFuncao = null) {
    this._lertoken();
    const quantidadeAlocada = this._analisarEtVariaveis();
    this._analisarSubrotinas();
    this._analisarComandos(nomeFuncao);
    if (quantidadeAlocada > 0) {
      this._geradorCodigo.gerarAlocacaoDesalocacao('DALLOC', quantidadeAlocada);
    }
  }

  _analisarComandos(nomeFuncao) {
    if (this._tokenAtual.simbolo === 'sinicio') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._lertoken();
      this._analisarComandoSimples(nomeFuncao);
      while (this._tokenAtual.simbolo !== 'sfim') {
        if (this._tokenAtual.simbolo === 'spontovirgula') {
          this._lertoken();
          if (this._tokenAtual.simbolo !== 'sfim') {
            this._analisarComandoSimples(nomeFuncao);
          }
        } else {
          throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
        }
      }
      this._lertoken();
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "inicio":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
  }

  _analisarComandoSimples(nomeFuncao) {
    if (this._tokenAtual.simbolo === 'sidentificador') {
      this._analisadorSemantico.confirmarRetorno(false);
      if (this._analisadorSemantico.pesquisaDeclprocTabela(this._tokenAtual.lexema) || this._analisadorSemantico.pesquisaDeclvarTabela(this._tokenAtual.lexema) || (this._tokenAtual.lexema === nomeFuncao)) {
        this._analisarAtribChprocedimento(nomeFuncao);
      } else {
        console.log('CARLOS');
        throw new Error(`Procedimento ou variavel "${this._tokenAtual.lexema}" nao declarada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else if (this._tokenAtual.simbolo === 'sse') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._analisarSe(nomeFuncao);
    } else if (this._tokenAtual.simbolo === 'senquanto') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._analisarEnquanto(nomeFuncao);
    } else if (this._tokenAtual.simbolo === 'sleia') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._analisarLeia();
    } else if (this._tokenAtual.simbolo === 'sescreva') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._analisarEscreva();
    } else {
      this._analisarComandos(nomeFuncao);
    }
  }

  _analisarDeclaracaoFuncao() {
    this._lertoken();
    this._analisadorSemantico.incrementaNivel();
    if (this._tokenAtual.simbolo === 'sidentificador') {
      if (!this._analisadorSemantico.pesquisaDeclvarfuncTabela(this._tokenAtual.lexema)) {
        this._analisadorSemantico.insereTabela(this._tokenAtual.lexema, '');
        const nomeFuncao = this._tokenAtual.lexema;
        this._geradorCodigo.inserirLabel(this._tokenAtual.lexema);
        this._lertoken();
        if (this._tokenAtual.simbolo === 'sdoispontos') {
          this._lertoken();
          if (this._tokenAtual.simbolo === 'sinteiro' || this._tokenAtual.simbolo === 'sbooleano') {
            this._analisadorSemantico.colocaTipoFuncao(this._tokenAtual.simbolo);
            this._lertoken();
            if (this._tokenAtual.simbolo === 'spontovirgula') {
              this._analisarBloco(nomeFuncao);
              if (!this._analisadorSemantico._testeRetornoFunc) {
                throw new Error(`Não existe retorno alcancavel para a funcao: "${nomeFuncao}": ${this._tokenAtual.linha} ${this._tokenAtual.coluna}"`);
              }
            }
          } else {
            throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "inteiro" ou "booleano":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ":":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Redeclaracao de funcao ou variavel "${this._tokenAtual.lexema}":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
    this._analisadorSemantico.desempilhaNivel();
  }

  _analisarDeclaracaoProcedimento() {
    this._lertoken();
    this._analisadorSemantico.incrementaNivel();
    if (this._tokenAtual.simbolo === 'sidentificador') {
      if (!this._analisadorSemantico.pesquisaDeclprocTabela(this._tokenAtual.lexema)) {
        this._analisadorSemantico.insereTabela(this._tokenAtual.lexema, 'procedimento');
        this._geradorCodigo.inserirLabel(this._tokenAtual.lexema);
        this._lertoken();
        if (this._tokenAtual.simbolo === 'spontovirgula') {
          this._analisarBloco();
        } else {
          throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Redeclaracao de procedimento "${this._tokenAtual.lexema}":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
    this._analisadorSemantico.desempilhaNivel();
  }

  _analisarEnquanto(nomeFuncao = null) {
    const linhaInicial = this._tokenAtual.linha;
    const colunaInicial = this._tokenAtual.coluna;

    const labelAux = this._geradorCodigo.gerarLabel('ENQUANTO');
    this._geradorCodigo.inserirLabel(labelAux);
    this._lertoken();
    this._analisarExpressao();

    if (this._analisadorSemantico.descarregaPilhaComparaTipo('booleano')) {
      const labelAux1 = this._geradorCodigo.gerarLabel('ENQUANTO');
      this._geradorCodigo.gerarJump('JMPF', labelAux1);
      if (this._tokenAtual.simbolo === 'sfaca') {
        this._lertoken();
        this._analisarComandoSimples(nomeFuncao);
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "faca":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
      this._geradorCodigo.gerarJump('JMP', labelAux);
      this._geradorCodigo.inserirLabel(labelAux1);
    } else {
      throw new Error(`Expressão invalida. A Expressao deve retornar um booleano:${linhaInicial}:${colunaInicial} `);
    }
  }

  _analisarEscreva() {
    this._lertoken();
    if (this._tokenAtual.simbolo === 'sabreparenteses') {
      this._lertoken();
      if (this._tokenAtual.simbolo === 'sidentificador') {
        const simboloEncontrado = this._analisadorSemantico.pesquisaFator(this._tokenAtual.lexema);
        if (!(Object.keys(simboloEncontrado).length === 0 && simboloEncontrado.constructor === Object)) {
          if (['funcaoBooleana', 'funcaoInteira'].includes(simboloEncontrado.tipoLexema)) {
            this._geradorCodigo.gerarInstrucao('CALL', simboloEncontrado.lexema);
            this._geradorCodigo.gerarInstrucao('LDV', 0);
          } else if (simboloEncontrado.rotulo !== -1) {
            this._geradorCodigo.gerarInstrucao('LDV', simboloEncontrado.rotulo);
          } else {
            this._geradorCodigo.gerarInstrucao('LDC', simboloEncontrado.elemento);
          }
          this._geradorCodigo.gerarInstrucao('PRN');
          this._lertoken();
          if (this._tokenAtual.simbolo === 'sfechaparenteses') {
            this._lertoken();
          } else {
            throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ")":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Funcao ou variavel "${this._tokenAtual.lexema}" nao declarada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "(":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
  }

  _analisarEtVariaveis() {
    let quantidadeAlocada = 0;
    if (this._tokenAtual.simbolo === 'svar') {
      this._lertoken();
      if (this._tokenAtual.simbolo === 'sidentificador') {
        while (this._tokenAtual.simbolo === 'sidentificador') {
          quantidadeAlocada += this._analisarVariaveis();
          if (this._tokenAtual.simbolo === 'spontovirgula') {
            this._lertoken();
          } else {
            throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
          }
        }
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    }
    return quantidadeAlocada;
  }

  _analisarExpressao() {
    this._analisarExpressaoSimples();
    while (['smaior', 'smaiorig', 'sig', 'smenor', 'smenorig', 'sdif'].includes(this._tokenAtual.simbolo)) {
      this._analisadorSemantico.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarExpressaoSimples();
    }
  }

  _analisarExpressaoSimples() {
    if (this._tokenAtual.simbolo === 'smais' || this._tokenAtual.simbolo === 'smenos') {
      this._analisadorSemantico.colocaElementoPilha(`${this._tokenAtual.lexema}u`);
      this._lertoken();
    }
    this._analisarTermo();
    while (this._tokenAtual.simbolo === 'smais' || this._tokenAtual.simbolo === 'smenos' || this._tokenAtual.simbolo === 'sou') {
      this._analisadorSemantico.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarTermo();
    }
  }

  _analisarChamadaFuncao() {
    this._lertoken();
  }

  _analisarFator() {
    if (this._tokenAtual.simbolo === 'sidentificador') {
      const simboloEncontrado = this._analisadorSemantico.pesquisaFator(this._tokenAtual.lexema);
      if (!(Object.keys(simboloEncontrado).length === 0 && simboloEncontrado.constructor === Object)) {
        if (this._analisadorSemantico.confereTipoFuncao(simboloEncontrado)) {
          this._analisadorSemantico.colocaElementoLista(this._tokenAtual.lexema, simboloEncontrado.tipoLexema);
          this._analisarChamadaFuncao();
        } else {
          this._analisadorSemantico.colocaElementoLista(this._tokenAtual.lexema, simboloEncontrado.tipoLexema, simboloEncontrado.rotulo);
          this._lertoken();
        }
      } else {
        throw new Error(`Variavel ou funcao "${this._tokenAtual.lexema}" nao declarada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else if (this._tokenAtual.simbolo === 'snumero') {
      this._analisadorSemantico.colocaElementoLista(this._tokenAtual.lexema);
      this._lertoken();
    } else if (this._tokenAtual.simbolo === 'snao') {
      this._analisadorSemantico.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarFator();
    } else if (this._tokenAtual.simbolo === 'sabreparenteses') {
      this._analisadorSemantico.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarExpressao();
      if (this._tokenAtual.simbolo === 'sfechaparenteses') {
        this._analisadorSemantico.colocaElementoPilha(this._tokenAtual.lexema);
        this._lertoken();
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ")":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else if (this._tokenAtual.lexema === 'verdadeiro' || this._tokenAtual.lexema === 'falso') {
      this._analisadorSemantico.colocaElementoLista(this._tokenAtual.lexema);
      this._lertoken();
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "(":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
  }

  _analisarLeia() {
    this._geradorCodigo.gerarInstrucao('RD');
    this._lertoken();
    if (this._tokenAtual.simbolo === 'sabreparenteses') {
      this._lertoken();
      if (this._tokenAtual.simbolo === 'sidentificador') {
        const simboloEncontrado = this._analisadorSemantico.pesquisaFator(this._tokenAtual.lexema);
        if (!(Object.keys(simboloEncontrado).length === 0 && simboloEncontrado.constructor === Object)) {
          this._geradorCodigo.gerarInstrucao('STR', simboloEncontrado.rotulo);
          this._lertoken();
          if (this._tokenAtual.simbolo === 'sfechaparenteses') {
            this._lertoken();
          } else {
            throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ")":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Variavel "${this._tokenAtual.lexema}" nao declarada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "(":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
  }

  _analisarSe(nomeFuncao = null) {
    const linhaInicial = this._tokenAtual.linha;
    const colunaInicial = this._tokenAtual.coluna;

    this._lertoken();
    this._analisarExpressao();
    if (this._analisadorSemantico.descarregaPilhaComparaTipo('booleano')) {
      if (this._tokenAtual.simbolo === 'sentao') {
        const labelAux = this._geradorCodigo.gerarLabel('SESENAO');
        this._geradorCodigo.gerarJump('JMPF', labelAux);
        this._lertoken();
        this._analisarComandoSimples(nomeFuncao);
        const labelAux1 = this._geradorCodigo.gerarLabel('SESENAO');
        if (this._tokenAtual.simbolo === 'ssenao') {
          const retornoAux = this._analisadorSemantico._testeRetornoFunc;
          this._geradorCodigo.gerarJump('JMP', labelAux1);
          this._geradorCodigo.inserirLabel(labelAux);
          this._lertoken();
          this._analisarComandoSimples(nomeFuncao);
          if (nomeFuncao && retornoAux) {
            this._analisadorSemantico.confirmarRetorno(true);
          } else {
            this._analisadorSemantico.confirmarRetorno(false);
          }
        } else {
          if (nomeFuncao) {
            this._analisadorSemantico.confirmarRetorno(false);
          }
          this._geradorCodigo.inserirLabel(labelAux);
        }
        this._geradorCodigo.inserirLabel(labelAux1);
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "entao":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Expressão invalida. A Expressao deve retornar um booleano:${linhaInicial}:${colunaInicial} `);
    }
  }

  _analisarVariaveis() {
    let cont = 0;
    do {
      if (this._tokenAtual.simbolo === 'sidentificador') {
        if (!this._analisadorSemantico.pesquisaDuplicVarTabela(this._tokenAtual.lexema)) {
          this._analisadorSemantico.insereTabela(this._tokenAtual.lexema, 'variavel', this._geradorCodigo.quantidadeAlocada + cont);
          this._lertoken();
          if (this._tokenAtual.simbolo === 'svirgula' || this._tokenAtual.simbolo === 'sdoispontos') {
            if (this._tokenAtual.simbolo === 'svirgula') {
              this._lertoken();
              if (this._tokenAtual.simbolo === 'sdoispontos') {
                throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ":":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
              }
            }
          } else {
            throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ":":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Redeclaracao de variavel "${this._tokenAtual.lexema}":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
      cont += 1;
    } while (this._tokenAtual.simbolo !== 'sdoispontos');
    this._lertoken();
    this._analisarTipo();
    this._geradorCodigo.gerarAlocacaoDesalocacao('ALLOC', cont);
    return cont;
  }

  _analisarSubrotinas() {
    let labelAux;
    let flag = 0;

    if (this._tokenAtual.simbolo === 'sprocedimento' || this._tokenAtual.simbolo === 'sfuncao') {
      labelAux = this._geradorCodigo.gerarLabel('SUBROTINA');
      this._geradorCodigo.gerarJump('JMP', labelAux);
      flag = 1;
    }

    while (this._tokenAtual.simbolo === 'sprocedimento' || this._tokenAtual.simbolo === 'sfuncao') {
      if (this._tokenAtual.simbolo === 'sprocedimento') {
        this._analisarDeclaracaoProcedimento();
      } else {
        this._analisarDeclaracaoFuncao();
      }
      if (this._tokenAtual.simbolo === 'spontovirgula') {
        this._lertoken();
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    }
    if (flag === 1) {
      this._geradorCodigo.gerarInstrucao('RETURN');
      this._geradorCodigo.inserirLabel(labelAux);
    }
  }

  _analisartermo() {
    this._analisarFator();
    while (this._tokenAtual.simbolo === 'smult' || this._tokenAtual.simbolo === 'sdiv' || this._tokenAtual.simbolo === 'se') {
      this._lertoken();
      this._analisarFator();
    }
  }

  _analisarTipo() {
    if (this._tokenAtual.simbolo !== 'sinteiro' && this._tokenAtual.simbolo !== 'sbooleano') {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "inteiro" ou "booleano":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    } else {
      this._analisadorSemantico.colocaTipoTabela(this._tokenAtual.lexema);
    }
    this._lertoken();
  }

  _analisarTermo() {
    this._analisarFator();
    while (this._tokenAtual.simbolo === 'smult' || this._tokenAtual.simbolo === 'sdiv' || this._tokenAtual.simbolo === 'se') {
      this._analisadorSemantico.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarFator();
    }
  }
};
