const listaSimbolos = require('./Token.json');

module.exports = class AnalisadorLexico {
  constructor(codigoPrograma) {
    this.codigo = codigoPrograma.replace(/(\t|\r)/gm, '').split('\n');
    this.linha = 0;
    this.coluna = 0;
    this.linhaAtual = this.codigo[this.linha];
  }

  adquirirToken() {
    this.consumirComentarios();
    const token = this.pegarToken();
    this.consumirEspacos();
    return token;
  }

  pegarToken() {
    if (this.linhaAtual === undefined) {
      return undefined;
    }

    if (/[0-9]/.test(this.linhaAtual[this.coluna])) {
      return this.tratarDigito();
    } if (/[a-zA-Z]/.test(this.linhaAtual[this.coluna])) {
      return this.tratarIdentificadorPalavraReservada();
    } if (this.linhaAtual[this.coluna] === ':') {
      return this.tratarAtribuicao();
    } if (['+', '-', '*'].includes(this.linhaAtual[this.coluna])) {
      return this.tratarOperadorAritmetico();
    } if (['<', '>', '=', '!'].includes(this.linhaAtual[this.coluna])) {
      return this.tratarOperadorRelacional();
    } if ([';', '(', ')', '.', ','].includes(this.linhaAtual[this.coluna])) {
      return this.tratarPontuacao();
    }

    throw new Error(`Caractere "${this.linhaAtual[this.coluna]}" nao reconhecido:${this.linha + 1}:${this.coluna}`);
  }

  tratarAtribuicao() {
    let dpontos = this.linhaAtual[this.coluna];
    const token = {
      lexema: '', simbolo: '', linha: this.linha + 1, coluna: this.coluna + 1,
    };
    this.coluna += 1;

    if (this.linhaAtual[this.coluna] === '=') {
      dpontos += this.linhaAtual[this.coluna];
      token.lexema = dpontos;
      token.simbolo = 'satribuicao';
      this.coluna += 1;
    } else {
      token.lexema = dpontos;
      token.simbolo = 'sdoispontos';
    }
    return token;
  }

  tratarDigito() {
    let num = this.linhaAtual[this.coluna];
    const token = {
      lexema: '', simbolo: '', linha: this.linha + 1, coluna: this.coluna + 1,
    };

    this.coluna += 1;
    while (/[0-9]/.test(this.linhaAtual[this.coluna])) {
      num += this.linhaAtual[this.coluna];
      this.coluna += 1;
    }

    token.lexema = num;
    token.simbolo = 'snumero';
    return token;
  }

  tratarIdentificadorPalavraReservada() {
    let id = this.linhaAtual[this.coluna];
    const token = {
      lexema: '', simbolo: '', linha: this.linha + 1, coluna: this.coluna + 1,
    };

    this.coluna += 1;

    while (this.linhaAtual[this.coluna] && /[_a-zA-Z0-9]/.test(this.linhaAtual[this.coluna])) {
      id += this.linhaAtual[this.coluna];
      this.coluna += 1;
    }

    token.lexema = id;
    token.simbolo = listaSimbolos[id] || 'sidentificador';
    return token;
  }

  tratarOperadorAritmetico() {
    const opAritmetico = this.linhaAtual[this.coluna];
    const token = {
      lexema: '', simbolo: '', linha: this.linha + 1, coluna: this.coluna + 1,
    };
    this.coluna += 1;

    token.lexema = opAritmetico;
    token.simbolo = listaSimbolos[opAritmetico];
    return token;
  }

  tratarOperadorRelacional() {
    let opRelacional = this.linhaAtual[this.coluna];
    const token = {
      lexema: '', simbolo: '', linha: this.linha + 1, coluna: this.coluna + 1,
    };
    this.coluna += 1;

    if (opRelacional === '!') {
      if (this.linhaAtual[this.coluna] === '=') {
        opRelacional += this.linhaAtual[this.coluna];
        token.lexema = opRelacional;
        token.simbolo = listaSimbolos[opRelacional];
        this.coluna += 1;
        return token;
      }
      throw new Error(`Caractere "${opRelacional}" nao reconhecido:${this.linha + 1}:${this.coluna}`);
    } if (opRelacional === '>' || opRelacional === '<') {
      if (this.linhaAtual[this.coluna] === '=') {
        opRelacional += this.linhaAtual[this.coluna];
        token.lexema = opRelacional;
        token.simbolo = listaSimbolos[opRelacional];
        this.coluna += 1;
        return token;
      }
      token.lexema = opRelacional;
      token.simbolo = listaSimbolos[opRelacional];
      return token;
    } if (opRelacional === '=') {
      token.lexema = opRelacional;
      token.simbolo = listaSimbolos[opRelacional];
      this.coluna += 1;
      return token;
    }
    return true;
  }

  tratarPontuacao() {
    const pont = this.linhaAtual[this.coluna];
    const token = {
      lexema: '', simbolo: '', linha: this.linha + 1, coluna: this.coluna + 1,
    };
    this.coluna += 1;
    token.lexema = pont;
    token.simbolo = listaSimbolos[pont];
    return token;
  }

  consumirComentarios() {
    while (this.linhaAtual !== undefined && (this.linhaAtual[this.coluna] === '/' || this.linhaAtual[this.coluna] === ' ' || this.linhaAtual === '' || this.linhaAtual[this.coluna] === '' || this.linhaAtual[this.coluna] === '{')) {
      this.consumirComentarioChave();
      this.consumirComentarioBarra();
      this.consumirEspacos();
    }
  }

  consumirComentarioChave() {
    while (this.linhaAtual && (this.linhaAtual[this.coluna] === '{' || this.linhaAtual[this.coluna] === ' ')) {
      if (this.linhaAtual[this.coluna] === '{') {
        const inicioComentario = { linha: this.linha + 1, coluna: this.coluna };
        while (this.linhaAtual !== undefined && this.linhaAtual[this.coluna] !== '}') {
          this.coluna += 1;
          this.checarNovaLinha();
          if (this.linhaAtual === undefined) {
            throw new Error(`Comentario nunca encerrado:${inicioComentario.linha}:${inicioComentario.coluna}`);
          }
        }
        this.coluna += 1;
      }
      this.consumirEspacos();
    }
  }

  consumirComentarioBarra() {
    if (this.linhaAtual && this.linhaAtual[this.coluna] === '/') {
      this.coluna += 1;
      if (this.linhaAtual && this.linhaAtual[this.coluna] === '*') {
        const inicioComentario = { linha: this.linha + 1, coluna: this.coluna };
        this.coluna += 1;
        while (this.linhaAtual !== undefined && this.linhaAtual[this.coluna] !== '*') {
          this.coluna += 1;
          this.checarNovaLinha();
          if (this.linhaAtual === undefined) {
            throw new Error(`Comentario nunca encerrado:${inicioComentario.linha}:${inicioComentario.coluna}`);
          }
          if (this.linhaAtual[this.coluna] === '*') {
            this.coluna += 1;
            if (this.linhaAtual[this.coluna] === '/') {
              this.coluna += 1;
              break;
            }
          }
        }
        this.consumirEspacos();
      } else {
        throw new Error(`Caractere "${this.linhaAtual[this.coluna - 1]}" nao reconhecido:${this.linha + 1}:${this.coluna}`);
      }
    }
  }

  checarNovaLinha() {
    if (this.linhaAtual !== undefined && !this.linhaAtual[this.coluna]) {
      this.linha += 1;
      this.coluna = 0;
      this.linhaAtual = this.codigo[this.linha];
    }
  }

  consumirEspacos() {
    this.checarNovaLinha();
    while (this.linhaAtual !== undefined && (this.linhaAtual[this.coluna] === ' ' || this.linhaAtual === '') && this.linhaAtual[this.coluna]) {
      this.coluna += 1;
      this.checarNovaLinha();
    }
  }
};
