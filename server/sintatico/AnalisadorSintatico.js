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
          this._analisarBloco();
          if (this._tokenAtual && this._tokenAtual.simbolo === 'sponto') {
            this._lertoken();
            if (this._tokenAtual === undefined) {
              console.log('Fim da execucao\n');
            } else {
              throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. O programa deve encerrar com ".":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
            }
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

  _analisarAtribChprocedimento() {
    this._lertoken();
    if (this._tokenAtual.simbolo === 'satribuicao') {
      this._analisarAtribuicao();
    } else {
      this._analisarChamadaDeProcedimento();
    }
  }

  _analisarAtribuicao() {
    this._lertoken();
    this._analisarExpressaoSimples();
    this._geradorCodigo.descarregaPilha();
  }

  _analisarChamadaDeFuncao() {
    this._lertoken();
  }

  _analisarChamadaDeProcedimento() {
    if (!this._analisadorSemantico.pesquisaDeclprocTabela(this._tokenAnterior.lexema)) {
      throw new Error(`Procedimento "${this._tokenAnterior.lexema}" nao declarado:${this._tokenAnterior.linha}:${this._tokenAnterior.coluna} `);
    }
  }

  _analisarBloco() {
    this._lertoken();
    this._analisarEtVariaveis();
    this._analisarSubrotinas();
    this._analisarComandos();
  }

  _analisarComandos() {
    if (this._tokenAtual.simbolo === 'sinicio') {
      this._lertoken();
      this._analisarComandoSimples();
      while (this._tokenAtual.simbolo !== 'sfim') {
        if (this._tokenAtual.simbolo === 'spontovirgula') {
          this._lertoken();
          if (this._tokenAtual.simbolo !== 'sfim') {
            this._analisarComandoSimples();
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

  _analisarComandoSimples() {
    if (this._tokenAtual.simbolo === 'sidentificador') {
      this._analisarAtribChprocedimento();
    } else if (this._tokenAtual.simbolo === 'sse') {
      this._analisarSe();
    } else if (this._tokenAtual.simbolo === 'senquanto') {
      this._analisarEnquanto();
    } else if (this._tokenAtual.simbolo === 'sleia') {
      this._analisarLeia();
    } else if (this._tokenAtual.simbolo === 'sescreva') {
      this._analisarEscreva();
    } else {
      this._analisarComandos();
    }
  }

  _analisarDeclaracaoFuncao() {
    this._lertoken();
    this._analisadorSemantico.incrementaNivel();
    if (this._tokenAtual.simbolo === 'sidentificador') {
      if (!this._analisadorSemantico.pesquisaDeclvarfuncTabela(this._tokenAtual.lexema)) {
        this._analisadorSemantico.insereTabela(this._tokenAtual.lexema, '');
        this._lertoken();
        if (this._tokenAtual.simbolo === 'sdoispontos') {
          this._lertoken();
          if (this._tokenAtual.simbolo === 'sinteiro' || this._tokenAtual.simbolo === 'sbooleano') {
            this._analisadorSemantico.colocaTipoFuncao(this._tokenAtual.simbolo);
            this._lertoken();
            if (this._tokenAtual.simbolo === 'spontovirgula') {
              this._analisarBloco();
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

  _analisarEnquanto() {
    this._lertoken();
    this._analisarExpressao();
    this._geradorCodigo.descarregaPilha();
    if (this._tokenAtual.simbolo === 'sfaca') {
      this._lertoken();
      this._analisarComandoSimples();
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "faca":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
  }

  _analisarEscreva() {
    this._lertoken();
    if (this._tokenAtual.simbolo === 'sabreparenteses') {
      this._lertoken();
      if (this._tokenAtual.simbolo === 'sidentificador') {
        if (this._analisadorSemantico.pesquisaDeclvarfuncTabela(this._tokenAtual.lexema)) {
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
    if (this._tokenAtual.simbolo === 'svar') {
      this._lertoken();
      if (this._tokenAtual.simbolo === 'sidentificador') {
        while (this._tokenAtual.simbolo === 'sidentificador') {
          this._analisarVariaveis();
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
  }

  _analisarExpressao() {
    this._analisarExpressaoSimples();
    while (['smaior', 'smaiorig', 'sig', 'smenor', 'smenorig', 'sdif'].includes(this._tokenAtual.simbolo)) {
      this._geradorCodigo.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarExpressaoSimples();
    }
  }

  _analisarExpressaoSimples() {
    if (this._tokenAtual.simbolo === 'smais' || this._tokenAtual.simbolo === 'smenos') {
      this._geradorCodigo.colocaElementoPilha(`${this._tokenAtual.lexema}u`);
      this._lertoken();
    }
    this._analisarTermo();
    while (this._tokenAtual.simbolo === 'smais' || this._tokenAtual.simbolo === 'smenos' || this._tokenAtual.simbolo === 'sou') {
      this._geradorCodigo.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarTermo();
    }
  }

  _analisarFator() {
    if (this._tokenAtual.simbolo === 'sidentificador') {
      const simboloEncontrado = this._analisadorSemantico.pesquisaFator(this._tokenAtual.lexema);
      // eslint-disable-next-line max-len
      if (!(Object.keys(simboloEncontrado).length === 0 && simboloEncontrado.constructor === Object)) {
        if (this._analisadorSemantico.confereTipoFuncao(simboloEncontrado)) {
          // analisarChamadaFuncao();
          // eslint-disable-next-line max-len
          this._geradorCodigo.colocaElementoLista(this._tokenAtual.lexema, simboloEncontrado.tipoLexema);
        } else {
          // eslint-disable-next-line max-len
          this._geradorCodigo.colocaElementoLista(this._tokenAtual.lexema, simboloEncontrado.tipoLexema);
          this._lertoken();
        }
      } else {
        throw new Error(`Variavel ou funcao "${this._tokenAtual.lexema}" nao declarada:${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else if (this._tokenAtual.simbolo === 'snumero') {
      this._geradorCodigo.colocaElementoLista(this._tokenAtual.lexema);
      this._lertoken();
    } else if (this._tokenAtual.simbolo === 'snao') {
      this._geradorCodigo.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarFator();
    } else if (this._tokenAtual.simbolo === 'sabreparenteses') {
      this._geradorCodigo.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarExpressao();
      if (this._tokenAtual.simbolo === 'sfechaparenteses') {
        this._geradorCodigo.colocaElementoPilha(this._tokenAtual.lexema);
        this._lertoken();
      } else {
        throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se ")":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
      }
    } else if (this._tokenAtual.lexema === 'verdadeiro' || this._tokenAtual.lexema === 'falso') {
      this._geradorCodigo.colocaElementoLista(this._tokenAtual.lexema);
      this._lertoken();
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "(":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
  }

  _analisarLeia() {
    this._lertoken();
    if (this._tokenAtual.simbolo === 'sabreparenteses') {
      this._lertoken();
      if (this._tokenAtual.simbolo === 'sidentificador') {
        if (this._analisadorSemantico.pesquisaDeclvarTabela(this._tokenAtual.lexema)) {
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

  _analisarSe() {
    this._lertoken();
    this._analisarExpressao();
    this._geradorCodigo.descarregaPilha();
    if (this._tokenAtual.simbolo === 'sentao') {
      this._lertoken();
      this._analisarComandoSimples();
      if (this._tokenAtual.simbolo === 'ssenao') {
        this._lertoken();
        this._analisarComandoSimples();
      }
    } else {
      throw new Error(`Token "${this._tokenAtual.lexema}" inesperado. Espera-se "entao":${this._tokenAtual.linha}:${this._tokenAtual.coluna} `);
    }
  }

  _analisarVariaveis() {
    do {
      if (this._tokenAtual.simbolo === 'sidentificador') {
        if (!this._analisadorSemantico.pesquisaDuplicVarTabela(this._tokenAtual.lexema)) {
          this._analisadorSemantico.insereTabela(this._tokenAtual.lexema, 'variavel');
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
    } while (this._tokenAtual.simbolo !== 'sdoispontos');
    this._lertoken();
    this._analisarTipo();
  }

  _analisarSubrotinas() {
    // flag = 0;
    if (this._tokenAtual.simbolo === 'sprocedimento' || this._tokenAtual.simbolo === 'sfuncao');

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
  // flag = 1;
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
      this._geradorCodigo.colocaElementoPilha(this._tokenAtual.lexema);
      this._lertoken();
      this._analisarFator();
    }
  }
};
