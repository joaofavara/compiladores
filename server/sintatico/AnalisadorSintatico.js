module.exports = class AnalisadorSintatico {
  constructor(lista) {
    this.listaTokens = lista;
    this.tokenAtual = '';
  }

  lertoken() {
    this.tokenAtual = this.listaTokens.pop();
  }

  analisaAtribChprocedimento() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'satribuicao') {
      this.analisaAtribuicao();
    }
    // else {
    //   chamadaProcedimento();
    // }
  }

  analisaAtribuicao() {
    this.lertoken();
    this.analisaExpressaoSimples();
  }

  analisaChamadaDeFuncao() {
    this.lertoken();
  }

  analisaChamadaDeProcedimento() {
    this.lertoken();
  }

  analisaBloco() {
    this.lertoken();
    this.analisaEtVariaveis();
    this.analisaSubrotinas();
    this.analisaComandos();
  }

  analisaComandos() {
    if (this.tokenAtual.simbolo === 'sinicio') {
      this.lertoken();
      this.analisaComandoSimples();
      while (this.tokenAtual.simbolo !== 'sfim') {
        if (this.tokenAtual.simbolo === 'spontovirgula') {
          this.lertoken();
          if (this.tokenAtual.simbolo !== 'sfim') {
            this.analisaComandoSimples();
          }
        } else {
          throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
        }
      }
      this.lertoken();
    } else {
      throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
    }
  }

  analisaComandoSimples() {
    if (this.tokenAtual.simbolo === 'sidentificador') {
      this.analisaAtribChprocedimento();
    } else if (this.tokenAtual.simbolo === 'sse') {
      this.analisaSe();
    } else if (this.tokenAtual.simbolo === 'senquanto') {
      this.analisaEnquanto();
    } else if (this.tokenAtual.simbolo === 'sleia') {
      this.analisaLeia();
    } else if (this.tokenAtual.simbolo === 'sescreva') {
      this.analisaEscreva();
    } else {
      this.analisaComandos();
    }
  }

  analisaDeclaracaoFuncao() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sidentificador') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sdoispontos') {
        this.lertoken();
        if (this.tokenAtual.simbolo === 'sinteiro' || this.tokenAtual.simbolo === 'sbooleano') {
          this.lertoken();
          if (this.tokenAtual.simbolo === 'spontovirgula') {
            this.analisaBloco();
          }
        } else {
          throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
        }
      } else {
        throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
      }
    } else {
      throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
    }
  }

  analisaDeclaracaoProcedimento() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sidentificador') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'spontovirgula') {
        this.analisaBloco();
      } else {
        throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
      }
    } else {
      throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
    }
  }

  analisaEnquanto() {
    this.lertoken();
    this.analisaExpressao();
    if (this.tokenAtual.simbolo === 'sfaca') {
      this.lertoken();
      this.analisaComandoSimples();
    } else {
      throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
    }
  }

  analisaEscreva() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sabreparenteses') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        this.lertoken();
        if (this.tokenAtual.simbolo === 'sfechaparenteses') {
          this.lertoken();
        } else {
          throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
        }
      } else {
        throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
      }
    } else {
      throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
    }
  }

  analisaEtVariaveis() {
    if (this.tokenAtual.simbolo === 'svar') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        while (this.tokenAtual.simbolo === 'sidentificador') {
          this.analisaVariaveis();
          if (this.tokenAtual.simbolo === 'spontovirgula') {
            this.lertoken();
          } else {
            throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
          }
        }
      } else {
        throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
      }
    }
  }

  analisaExpressao() {
    this.analisaExpressaoSimples();
    if (['smaior', 'smaiorig', 'sig', 'smenor', 'smenorig', 'sdif'].includes(this.tokenAtual.simbolo)) {
      this.lertoken();
      this.analisaExpressaoSimples();
    }
  }

  analisaExpressaoSimples() {
    if (this.tokenAtual.simbolo === 'smais' || this.tokenAtual.simbolo === 'smenos') {
      this.lertoken();
    }
    this.analisaTermo();
    while (this.tokenAtual.simbolo === 'smais' || this.tokenAtual.simbolo === 'smenos' || this.tokenAtual.simbolo === 'sou') {
      this.lertoken();
      this.analisaTermo();
    }
  }

  analisaFator() {
    if (this.tokenAtual.simbolo === 'sidentificador') {
      // analisaChamadaFuncao();
      this.lertoken();
    } else if (this.tokenAtual.simbolo === 'snumero') {
      this.lertoken();
    } else if (this.tokenAtual.simbolo === 'snao') {
      this.lertoken();
      // eslint-disable-next-line no-undef
      analisaFator();
    } else if (this.tokenAtual.simbolo === 'sabreparenteses') {
      this.lertoken();
      this.analisaExpressao();
      if (this.tokenAtual.simbolo === 'sfechaparenteses') {
        this.lertoken();
      } else {
        throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
      }
    } else if (this.tokenAtual.lexema === 'verdadeiro' || this.tokenAtual.lexema === 'falso') {
      this.lertoken();
    } else {
      throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
    }
  }

  analisaLeia() {
    this.lertoken();
    if (this.tokenAtual.simbolo === 'sabreparenteses') {
      this.lertoken();
      if (this.tokenAtual.simbolo === 'sidentificador') {
        this.lertoken();
        if (this.tokenAtual.simbolo === 'sfechaparenteses') {
          this.lertoken();
        } else {
          throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
        }
      } else {
        throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
      }
    } else {
      throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
    }
  }

  analisaSe() {
    this.lertoken();
    this.analisaExpressao();
    if (this.tokenAtual.simbolo === 'sentao') {
      this.lertoken();
      this.analisaComandoSimples();
      if (this.tokenAtual.simbolo === 'ssenao') {
        this.lertoken();
        this.analisaComandoSimples();
      }
    } else {
      throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
    }
  }

  analisaVariaveis() {
    do {
      if (this.tokenAtual.simbolo === 'sidentificador') {
        this.lertoken();
        if (this.tokenAtual.simbolo === 'svirgula' || this.tokenAtual.simbolo === 'sdoispontos') {
          if (this.tokenAtual.simbolo === 'svirgula') {
            this.lertoken();
            if (this.tokenAtual.simbolo === 'sdoispontos') {
              throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
            }
          }
        } else {
          throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
        }
      } else {
        throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
      }
    } while (this.tokenAtual.simbolo !== 'sdoispontos');
    this.lertoken();
    this.analisaTipo();
  }

  analisaSubrotinas() {
    // flag = 0;
    if (this.tokenAtual.simbolo === 'sprocedimento' || this.tokenAtual.simbolo === 'sfuncao');

    while (this.tokenAtual.simbolo === 'sprocedimento' || this.tokenAtual.simbolo === 'sfuncao') {
      if (this.tokenAtual.simbolo === 'sprocedimento') {
        this.analisaDeclaracaoProcedimento();
      } else {
        this.analisaDeclaracaoFuncao();
      }
      if (this.tokenAtual.simbolo === 'spontovirgula') {
        this.lertoken();
      } else {
        throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
      }
    }
  // flag = 1;
  }

  analisatermo() {
    this.analisaFator();
    while (this.tokenAtual.simbolo === 'smult' || this.tokenAtual.simbolo === 'sdiv' || this.tokenAtual.simbolo === 'se') {
      this.lertoken();
      this.analisaFator();
    }
  }

  analisaTipo() {
    if (this.tokenAtual.simbolo !== 'sinteiro' && this.tokenAtual.simbolo !== 'sbooleano') {
      throw new Error(`Error: ${this.tokenAtual.lexema} - ${this.tokenAtual.simbolo}`);
    }
    this.lertoken();
  }

  analisaTermo() {
    this.analisaFator();
    while (this.tokenAtual.simbolo === 'smult' || this.tokenAtual.simbolo === 'sdiv' || this.tokenAtual.simbolo === 'se') {
      this.lertoken();
      this.analisaFator();
    }
  }
};
