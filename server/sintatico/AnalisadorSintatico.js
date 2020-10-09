module.exports = class AnalisadorSintatico {
  constructor(tratadorLexico) {
    this.tratadorLexico = tratadorLexico;
    this.tokenAtual = undefined;
  }

  analisarPrograma() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sprograma') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        this.lertoken();
        if (this.tokenAtual.simbolo === 'spontovirgula') {
          this.analisarBloco();
          if (this.tokenAtual.simbolo === 'sponto') {
            this.lertoken();
            if (this.tratadorLexico.tokenAtual === undefined) {
              console.log('Fim da execucao\n');
            } else {
              throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
            }
          } else {
            throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
          }
        } else {
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  lertoken() {
    this.tokenAtual = this.tratadorLexico.adquirirToken();
  }

  analisarAtribChprocedimento() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'satribuicao') {
      this.analisarAtribuicao();
    }
    // else {
    //   chamadaProcedimento();
    // }
  }

  analisarAtribuicao() {
    this.lertoken();
    this.analisarExpressaoSimples();
  }

  analisarChamadaDeFuncao() {
    this.lertoken();
  }

  analisarChamadaDeProcedimento() {
    this.lertoken();
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
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      }
      this.lertoken();
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
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
    if (this.tokenAtual.simbolo === 'sidentificador') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sdoispontos') {
        this.lertoken();
        if (this.tokenAtual.simbolo === 'sinteiro' || this.tokenAtual.simbolo === 'sbooleano') {
          this.lertoken();
          if (this.tokenAtual.simbolo === 'spontovirgula') {
            this.analisarBloco();
          }
        } else {
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarDeclaracaoProcedimento() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sidentificador') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'spontovirgula') {
        this.analisarBloco();
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarEnquanto() {
    this.lertoken();
    this.analisarExpressao();
    if (this.tokenAtual.simbolo === 'sfaca') {
      this.lertoken();
      this.analisarComandoSimples();
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarEscreva() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sabreparenteses') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        this.lertoken();
        if (this.tokenAtual.simbolo === 'sfechaparenteses') {
          this.lertoken();
        } else {
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
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
            throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
          }
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
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
      this.lertoken();
      // analisarChamadaFuncao();
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
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else if (this.tokenAtual.lexema === 'verdadeiro' || this.tokenAtual.lexema === 'falso') {
      this.lertoken();
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarLeia() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sabreparenteses') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        this.lertoken();
        if (this.tokenAtual.simbolo === 'sfechaparenteses') {
          this.lertoken();
        } else {
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
      }
    } else {
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
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
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
    }
  }

  analisarVariaveis() {
    do {
      if (this.tokenAtual.simbolo === 'sidentificador') {
        this.lertoken();
        if (this.tokenAtual.simbolo === 'svirgula' || this.tokenAtual.simbolo === 'sdoispontos') {
          if (this.tokenAtual.simbolo === 'svirgula') {
            this.lertoken();
            if (this.tokenAtual.simbolo === 'sdoispontos') {
              throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
            }
          }
        } else {
          throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
        }
      } else {
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
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
        throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
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
      throw new Error(`Token "${this.tokenAtual.lexema}" inesperado:${this.tokenAtual.linha}:${this.tokenAtual.coluna} `);
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
