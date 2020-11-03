module.exports = class AnalisadorSintatico {
  constructor(tratadorLexico, analisadorSemantico) {
    this.tratadorLexico = tratadorLexico;
    this.analisadorSemantico = analisadorSemantico;
    this.tokenAnterior = undefined;
    this.tokenAtual = undefined;
  }

  analisarPrograma() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sprograma') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        this.analisadorSemantico.insereTabela(this.tokenAtual.lexema, 'nomedeprograma', null);
        this.lertoken();
        if (this.tokenAtual.simbolo === 'spontovirgula') {
          this.analisarBloco();
          if (this.tokenAtual && this.tokenAtual.simbolo === 'sponto') {
            this.lertoken();
            if (this.tokenAtual === undefined) {
              console.log(this.analisadorSemantico.tabelaDeSimbolos);
              console.log('Fim da execucao\n');
            } else {
              throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. O programa deve encerrar com ".":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
            }
          } else {
            if (!this.tokenAtual) {
              throw new Error(`Token "." esperado no fim do programa:${this.tratadorLexico.linha}:${this.tratadorLexico.coluna} `);
            }
            throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ";":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. O programa deve iniciar com "programa":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  lertoken() {
    this.tokenAnterior = this.tokenAtual;
    this.tokenAtual = this.tratadorLexico.adquirirToken();
  }

  analisarAtribChprocedimento() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'satribuicao') {
      this.analisarAtribuicao();
    } else {
      this.analisarChamadaDeProcedimento();
    }
  }

  analisarAtribuicao() {
    this.lertoken();
    this.analisarExpressaoSimples();
  }

  analisarChamadaDeFuncao() {
    this.lertoken();
  }

  analisarChamadaDeProcedimento() {
    if (!this.analisadorSemantico.pesquisaDeclprocTabela(this.tokenAnterior.lexema)) {
      throw new Error(`Procedimento "${this.tokenAnterior.lexema}" nao declarado:${this.tokenAnterior.linha}:${this.tokenAnterior.coluna} `);
    }
  }

  analisarBloco() {
    this.lertoken();
    this.analisarEtVariaveis();
    this.analisarSubrotinas();
    this.analisarComandos();
  }

  analisarComandos() {
    if (this.tokenAtual.simbolo === 'sinicio') {
      this.lertoken();
      this.analisarComandoSimples();
      while (this.tokenAtual.simbolo !== 'sfim') {
        if (this.tokenAtual.simbolo === 'spontovirgula') {
          this.lertoken();
          if (this.tokenAtual.simbolo !== 'sfim') {
            this.analisarComandoSimples();
          }
        } else {
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ";":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      }
      this.lertoken();
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se "inicio":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarComandoSimples() {
    if (this.tokenAtual.simbolo === 'sidentificador') {
      this.analisarAtribChprocedimento();
    } else if (this.tokenAtual.simbolo === 'sse') {
      this.analisarSe();
    } else if (this.tokenAtual.simbolo === 'senquanto') {
      this.analisarEnquanto();
    } else if (this.tokenAtual.simbolo === 'sleia') {
      this.analisarLeia();
    } else if (this.tokenAtual.simbolo === 'sescreva') {
      this.analisarEscreva();
    } else {
      this.analisarComandos();
    }
  }

  analisarDeclaracaoFuncao() {
    this.lertoken();
    this.analisadorSemantico.incrementaNivel();
    if (this.tokenAtual.simbolo === 'sidentificador') {
      if (!this.analisadorSemantico.pesquisaDeclvarfuncTabela(this.tokenAtual.lexema)) {
        this.analisadorSemantico.insereTabela(this.tokenAtual.lexema, '');
        this.lertoken();
        if (this.tokenAtual.simbolo === 'sdoispontos') {
          this.lertoken();
          if (this.tokenAtual.simbolo === 'sinteiro' || this.tokenAtual.simbolo === 'sbooleano') {
            this.analisadorSemantico.colocaTipoFuncao(this.tokenAtual.simbolo);
            this.lertoken();
            if (this.tokenAtual.simbolo === 'spontovirgula') {
              this.analisarBloco();
            }
          } else {
            throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se "inteiro" ou "booleano":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ":":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Redeclaracao de funcao ou variavel "${this.tokenAtual.lexema}":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
    this.analisadorSemantico.desempilhaNivel();
  }

  analisarDeclaracaoProcedimento() {
    this.lertoken();
    this.analisadorSemantico.incrementaNivel();
    if (this.tokenAtual.simbolo === 'sidentificador') {
      if (!this.analisadorSemantico.pesquisaDeclprocTabela(this.tokenAtual.lexema)) {
        this.analisadorSemantico.insereTabela(this.tokenAtual.lexema, 'procedimento');
        this.lertoken();
        if (this.tokenAtual.simbolo === 'spontovirgula') {
          this.analisarBloco();
        } else {
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ";":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Redeclaracao de procedimento "${this.tokenAtual.lexema}":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
    this.analisadorSemantico.desempilhaNivel();
  }

  analisarEnquanto() {
    this.lertoken();
    this.analisarExpressao();
    if (this.tokenAtual.simbolo === 'sfaca') {
      this.lertoken();
      this.analisarComandoSimples();
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se "faca":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarEscreva() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sabreparenteses') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        if (this.analisadorSemantico.pesquisaDeclvarfuncTabela(this.tokenAtual.lexema)) {
          this.lertoken();
          if (this.tokenAtual.simbolo === 'sfechaparenteses') {
            this.lertoken();
          } else {
            throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ")":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Funcao ou variavel "${this.tokenAtual.lexema}" nao declarada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se "(":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarEtVariaveis() {
    if (this.tokenAtual.simbolo === 'svar') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        while (this.tokenAtual.simbolo === 'sidentificador') {
          this.analisarVariaveis();
          if (this.tokenAtual.simbolo === 'spontovirgula') {
            this.lertoken();
          } else {
            throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ";":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
          }
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    }
  }

  analisarExpressao() {
    this.analisarExpressaoSimples();
    if (['smaior', 'smaiorig', 'sig', 'smenor', 'smenorig', 'sdif'].includes(this.tokenAtual.simbolo)) {
      this.lertoken();
      this.analisarExpressaoSimples();
    }
  }

  analisarExpressaoSimples() {
    if (this.tokenAtual.simbolo === 'smais' || this.tokenAtual.simbolo === 'smenos') {
      this.lertoken();
    }
    this.analisarTermo();
    while (this.tokenAtual.simbolo === 'smais' || this.tokenAtual.simbolo === 'smenos' || this.tokenAtual.simbolo === 'sou') {
      this.lertoken();
      this.analisarTermo();
    }
  }

  analisarFator() {
    if (this.tokenAtual.simbolo === 'sidentificador') {
      const simboloEncontrado = this.analisadorSemantico.pesquisaTabela(this.tokenAtual.lexema);
      // eslint-disable-next-line max-len
      if (!(Object.keys(simboloEncontrado).length === 0 && simboloEncontrado.constructor === Object)) {
        if (this.analisadorSemantico.confereTipoSimbolo(simboloEncontrado)) {
          // analisarChamadaFuncao();
        } else {
          this.lertoken();
        }
      } else {
        throw new Error(`Variavel ou funcao "${this.tokenAtual.lexema}" nao declarada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else if (this.tokenAtual.simbolo === 'snumero') {
      this.lertoken();
    } else if (this.tokenAtual.simbolo === 'snao') {
      this.lertoken();
      this.analisarFator();
    } else if (this.tokenAtual.simbolo === 'sabreparenteses') {
      this.lertoken();
      this.analisarExpressao();
      if (this.tokenAtual.simbolo === 'sfechaparenteses') {
        this.lertoken();
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ")":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else if (this.tokenAtual.lexema === 'verdadeiro' || this.tokenAtual.lexema === 'falso') {
      this.lertoken();
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se "(":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarLeia() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sabreparenteses') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        if (this.analisadorSemantico.pesquisaDeclvarTabela(this.tokenAtual.lexema)) {
          this.lertoken();
          if (this.tokenAtual.simbolo === 'sfechaparenteses') {
            this.lertoken();
          } else {
            throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ")":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Variavel "${this.tokenAtual.lexema}" nao declarada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se "(":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarSe() {
    this.lertoken();
    this.analisarExpressao();
    if (this.tokenAtual.simbolo === 'sentao') {
      this.lertoken();
      this.analisarComandoSimples();
      if (this.tokenAtual.simbolo === 'ssenao') {
        this.lertoken();
        this.analisarComandoSimples();
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se "entao":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarVariaveis() {
    do {
      if (this.tokenAtual.simbolo === 'sidentificador') {
        if (!this.analisadorSemantico.pesquisaDuplicVarTabela(this.tokenAtual.lexema)) {
          this.analisadorSemantico.insereTabela(this.tokenAtual.lexema, 'variavel');
          this.lertoken();
          if (this.tokenAtual.simbolo === 'svirgula' || this.tokenAtual.simbolo === 'sdoispontos') {
            if (this.tokenAtual.simbolo === 'svirgula') {
              this.lertoken();
              if (this.tokenAtual.simbolo === 'sdoispontos') {
                throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ":":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
              }
            }
          } else {
            throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ":":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Redeclaracao de variavel "${this.tokenAtual.lexema}":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se uma palavra nao reservada:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } while (this.tokenAtual.simbolo !== 'sdoispontos');
    this.lertoken();
    this.analisarTipo();
  }

  analisarSubrotinas() {
    // flag = 0;
    if (this.tokenAtual.simbolo === 'sprocedimento' || this.tokenAtual.simbolo === 'sfuncao');

    while (this.tokenAtual.simbolo === 'sprocedimento' || this.tokenAtual.simbolo === 'sfuncao') {
      if (this.tokenAtual.simbolo === 'sprocedimento') {
        this.analisarDeclaracaoProcedimento();
      } else {
        this.analisarDeclaracaoFuncao();
      }
      if (this.tokenAtual.simbolo === 'spontovirgula') {
        this.lertoken();
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se ";":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    }
  // flag = 1;
  }

  analisartermo() {
    this.analisarFator();
    while (this.tokenAtual.simbolo === 'smult' || this.tokenAtual.simbolo === 'sdiv' || this.tokenAtual.simbolo === 'se') {
      this.lertoken();
      this.analisarFator();
    }
  }

  analisarTipo() {
    if (this.tokenAtual.simbolo !== 'sinteiro' && this.tokenAtual.simbolo !== 'sbooleano') {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado. Espera-se "inteiro" ou "booleano":${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    } else {
      this.analisadorSemantico.colocaTipoTabela(this.tokenAtual.lexema);
    }
    this.lertoken();
  }

  analisarTermo() {
    this.analisarFator();
    while (this.tokenAtual.simbolo === 'smult' || this.tokenAtual.simbolo === 'sdiv' || this.tokenAtual.simbolo === 'se') {
      this.lertoken();
      this.analisarFator();
    }
  }
};
