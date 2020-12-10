/* eslint-disable max-len */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-underscore-dangle */
const Erro = require('../error/GeradorErro');

module.exports = class AnalisadorSintatico {
  constructor(tratadorLexico, analisadorSemantico, geradorDeCodigo) {
    this._tratadorLexico = tratadorLexico;
    this._analisadorSemantico = analisadorSemantico;
    this._geradorCodigo = geradorDeCodigo;
    this._tokenAnterior = undefined;
    this._tokenAtual = undefined;
    this._flagdesalocacao = 1;
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
          this._analisarBloco(null, true);
          if (this._tokenAtual && this._tokenAtual.simbolo === 'sponto') {
            this._lertoken();
            if (this._tokenAtual === undefined) {
              this._geradorCodigo.gerarAlocacaoDesalocacao('DALLOC', 1);
              this._geradorCodigo.gerarInstrucao('HLT');
              console.log('\nFim da execucao\n');
              return this._geradorCodigo.gerarArquivo();
            }
            throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. O programa deve encerrar com ".":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
          } else {
            if (!this._tokenAtual) {
              throw new Erro('Token "." esperado no fim do programa');
            }
            throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
          }
        } else {
          throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
        }
      } else {
        throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
    } else {
      throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. O programa deve iniciar com "programa":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
    }
  }

  _lertoken() {
    this._tokenAnterior = this._tokenAtual;
    this._tokenAtual = this._tratadorLexico.adquirirToken();
  }

  _analisarAtribChprocedimento(nomeFuncao, quantidadeAlocada) {
    this._lertoken();
    if (this._tokenAtual.simbolo === 'satribuicao') {
      this._analisarAtribuicao(nomeFuncao, quantidadeAlocada);
    } else {
      this._analisarChamadaDeProcedimento();
    }
  }

  _analisarAtribuicao(nomeFuncao, quantidadeAlocada) {
    const linhaInicial = this._tokenAtual.linha;
    const colunaInicial = this._tokenAtual.coluna;
    const tokenVariavel = this._tokenAnterior;

    this._lertoken();
    this._analisarExpressaoSimples();

    const simbolo = this._analisadorSemantico.pesquisaFator(tokenVariavel.lexema);
    if (!this._analisadorSemantico.descarregaPilhaComparaTipo(simbolo.tipoLexema)) {
      throw new Erro(`Expressão invalida. Os tipos são incompativeis:${linhaInicial}:${colunaInicial} `, this._tokenAtual.linha);
    }

    if (simbolo.rotulo >= 0) {
      this._geradorCodigo.gerarInstrucao('STR', simbolo.rotulo);
    }

    if (simbolo.lexema === nomeFuncao) {
      this._geradorCodigo.gerarInstrucao('STR', 0);
      if (quantidadeAlocada > 0) {
        this._geradorCodigo.gerarAlocacaoDesalocacao('DALLOC', quantidadeAlocada);
        this._flagdesalocacao = 0;
      }
      this._geradorCodigo.gerarInstrucao('RETURN');
      this._analisadorSemantico.confirmarRetorno(true);
    } else {
      this._analisadorSemantico.confirmarRetorno(false);
    }
  }

  _analisarChamadaDeFuncao() {
    this._lertoken();
  }

  _analisarChamadaDeProcedimento() {
    if (!this._analisadorSemantico.pesquisaDeclprocTabela(this._tokenAnterior.lexema)) {
      throw new Erro(`Procedimento "${this._tokenAnterior.lexema}" nao declarado:${this._tokenAnterior.linha}:${this._tokenAnterior.coluna} `, this._tokenAtual.linha);
    } else {
      this._geradorCodigo.gerarInstrucao('CALL', this._tokenAnterior.lexema);
    }
  }

  _analisarBloco(nomeFuncao = null, rotina = false) {
    this._lertoken();
    this._flagdesalocacao = 1;
    const quantidadeAlocada = this._analisarEtVariaveis();
    if (quantidadeAlocada > 0) {
      this._geradorCodigo.gerarAlocacaoDesalocacao('ALLOC', quantidadeAlocada);
    }
    this._analisarSubrotinas(quantidadeAlocada);
    this._analisarComandos(nomeFuncao, rotina, quantidadeAlocada);
    if (quantidadeAlocada > 0 && this._flagdesalocacao === 1) {
      this._geradorCodigo.gerarAlocacaoDesalocacao('DALLOC', quantidadeAlocada);
    }

    this._geradorCodigo.desalocarMemoria(quantidadeAlocada);
    this._flagdesalocacao = 1;
  }

  _analisarComandos(nomeFuncao, rotina = false, quantidadeAlocada = 0) {
    if (this._tokenAtual.simbolo === 'sinicio') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._lertoken();
      this._analisarComandoSimples(nomeFuncao, quantidadeAlocada);
      while (this._tokenAtual.simbolo !== 'sfim') {
        if (this._tokenAtual.simbolo === 'spontovirgula') {
          this._lertoken();
          if (this._tokenAtual.simbolo !== 'sfim') {
            this._analisarComandoSimples(nomeFuncao, quantidadeAlocada);
          }
        } else {
          throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
        }
      }
      this._lertoken();
    } else if (rotina) {
      throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "inicio" ou declaracao (variavel, procedimento ou funcao):${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
    } else {
      throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "inicio" ou comando:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
    }
  }

  _analisarComandoSimples(nomeFuncao, quantidadeAlocada) {
    if (this._tokenAtual.simbolo === 'sidentificador') {
      this._analisadorSemantico.confirmarRetorno(false);
      if (this._analisadorSemantico.pesquisaDeclprocTabela(this._tokenAtual.lexema) || this._analisadorSemantico.pesquisaDeclvarTabela(this._tokenAtual.lexema) || (this._tokenAtual.lexema === nomeFuncao)) {
        this._analisarAtribChprocedimento(nomeFuncao, quantidadeAlocada);
      } else {
        throw new Erro(`Procedimento ou variavel "${this._tokenAtual.lexema}" nao declarada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
    } else if (this._tokenAtual.simbolo === 'sse') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._analisarSe(nomeFuncao, quantidadeAlocada);
    } else if (this._tokenAtual.simbolo === 'senquanto') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._analisarEnquanto(nomeFuncao, quantidadeAlocada);
    } else if (this._tokenAtual.simbolo === 'sleia') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._analisarLeia();
    } else if (this._tokenAtual.simbolo === 'sescreva') {
      this._analisadorSemantico.confirmarRetorno(false);
      this._analisarEscreva();
    } else {
      this._analisarComandos(nomeFuncao, false, quantidadeAlocada);
    }
  }

  _analisarDeclaracaoFuncao(quantidadeAlocada) {
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
              this._analisarBloco(nomeFuncao, true, quantidadeAlocada);
              if (!this._analisadorSemantico._testeRetornoFunc) {
                throw new Erro(`Não existe retorno alcancavel para a funcao: "${nomeFuncao}": ${this._tokenAtual.linha} ${this._tokenAtual.coluna}"`, this._tokenAtual.linha);
              }
            }
          } else {
            throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "inteiro" ou "booleano":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
          }
        } else {
          throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ":":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
        }
      } else {
        throw new Erro(`Redeclaracao de funcao ou variavel "${this._tokenAtual.lexema}":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
    } else {
      throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
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
          this._analisarBloco(null, true);
          this._geradorCodigo.gerarInstrucao('RETURN');
        } else {
          throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
        }
      } else {
        throw new Erro(`Redeclaracao de procedimento "${this._tokenAtual.lexema}":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
    } else {
      throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
    }
    this._analisadorSemantico.desempilhaNivel();
  }

  _analisarEnquanto(nomeFuncao = null, quantidadeAlocada) {
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
        this._analisarComandoSimples(nomeFuncao, quantidadeAlocada);
        this._analisadorSemantico.confirmarRetorno(false);
      } else {
        throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "faca":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
      this._geradorCodigo.gerarJump('JMP', labelAux);
      this._geradorCodigo.inserirLabel(labelAux1);
    } else {
      throw new Erro(`Expressão invalida. A Expressao deve retornar um booleano:${linhaInicial}:${colunaInicial} `, this._tokenAtual.linha);
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
            throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ")":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
          }
        } else {
          throw new Erro(`Funcao ou variavel "${this._tokenAtual.lexema}" nao declarada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
        }
      } else {
        throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
    } else {
      throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "(":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
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
            throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
          }
        }
      } else {
        throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
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

  _analisarFator() {
    if (this._tokenAtual.simbolo === 'sidentificador') {
      const simboloEncontrado = this._analisadorSemantico.pesquisaFator(this._tokenAtual.lexema);
      if (!(Object.keys(simboloEncontrado).length === 0 && simboloEncontrado.constructor === Object)) {
        if (this._analisadorSemantico.confereTipoFuncao(simboloEncontrado)) {
          this._analisadorSemantico.colocaElementoLista(this._tokenAtual.lexema, simboloEncontrado.tipoLexema);
          this._analisarChamadaDeFuncao();
        } else {
          this._analisadorSemantico.colocaElementoLista(this._tokenAtual.lexema, simboloEncontrado.tipoLexema, simboloEncontrado.rotulo);
          this._lertoken();
        }
      } else {
        throw new Erro(`Variavel ou funcao "${this._tokenAtual.lexema}" nao declarada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
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
        throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Parenteses sem fechamento:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
    } else if (this._tokenAtual.lexema === 'verdadeiro' || this._tokenAtual.lexema === 'falso') {
      this._analisadorSemantico.colocaElementoLista(this._tokenAtual.lexema);
      this._lertoken();
    } else {
      throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "(", expressao ou valor:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
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
            throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ")":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
          }
        } else {
          throw new Erro(`Variavel "${this._tokenAtual.lexema}" nao declarada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
        }
      } else {
        throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
    } else {
      throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "(":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
    }
  }

  _analisarSe(nomeFuncao = null, quantidadeAlocada) {
    const linhaInicial = this._tokenAtual.linha;
    const colunaInicial = this._tokenAtual.coluna;

    this._lertoken();
    this._analisarExpressao();
    if (this._analisadorSemantico.descarregaPilhaComparaTipo('booleano')) {
      if (this._tokenAtual.simbolo === 'sentao') {
        const labelAux = this._geradorCodigo.gerarLabel('SESENAO');
        this._geradorCodigo.gerarJump('JMPF', labelAux);
        this._lertoken();
        this._analisarComandoSimples(nomeFuncao, quantidadeAlocada);
        const labelAux1 = this._geradorCodigo.gerarLabel('SESENAO');
        if (this._tokenAtual.simbolo === 'ssenao') {
          const retornoAux = this._analisadorSemantico._testeRetornoFunc;
          this._geradorCodigo.gerarJump('JMP', labelAux1);
          this._geradorCodigo.inserirLabel(labelAux);
          this._lertoken();
          this._analisarComandoSimples(nomeFuncao, quantidadeAlocada);
          if (!(nomeFuncao && retornoAux) && this._analisadorSemantico._testeRetornoFunc) {
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
        throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "entao":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
    } else {
      throw new Erro(`Expressão invalida. A Expressao deve retornar um booleano:${linhaInicial}:${colunaInicial} `, this._tokenAtual.linha);
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
                throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se identificador nao reservado de variavel:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
              }
            }
          } else {
            throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ":" ou ",":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
          }
        } else {
          throw new Erro(`Redeclaracao de variavel "${this._tokenAtual.lexema}":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
        }
      } else {
        throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se identificador nao reservado de variavel:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
      cont += 1;
    } while (this._tokenAtual.simbolo !== 'sdoispontos');
    this._lertoken();
    this._analisarTipo();
    return cont;
  }

  _analisarSubrotinas(quantidadeAlocada = 0) {
    let labelAux;
    let flag = 0;

    if (this._tokenAtual.simbolo === 'sprocedimento' || this._tokenAtual.simbolo === 'sfuncao') {
      labelAux = this._geradorCodigo.gerarLabel('SUBROTINA');
      this._geradorCodigo.gerarJump('JMP', labelAux);
      flag = 1;
    }

    while (this._tokenAtual.simbolo === 'sprocedimento' || this._tokenAtual.simbolo === 'sfuncao') {
      if (this._tokenAtual.simbolo === 'sprocedimento') {
        this._analisarDeclaracaoProcedimento(quantidadeAlocada);
      } else {
        this._analisarDeclaracaoFuncao(quantidadeAlocada);
      }
      if (this._tokenAtual.simbolo === 'spontovirgula') {
        this._lertoken();
      } else {
        throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ";":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
      }
    }

    if (flag === 1) {
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
      throw new Erro(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "inteiro" ou "booleano":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `, this._tokenAtual.linha);
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
