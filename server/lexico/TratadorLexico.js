/* eslint-disable no-underscore-dangle */
const listaSimbolos = require('./Token.json');

module.exports = class AnalisadorLexico {
  constructor(codigoPrograma) {
    this._codigo = codigoPrograma.replace(/(\t|\r)/gm, '').split('\n');
    this._linha = 0;
    this._coluna = 0;
    this._linhaAtual = this._codigo[this._linha];
  }

  adquirirToken() {
    this._consumirComentarios();
    const token = this._pegarToken();
    this._consumirEspacos();
    return token;
  }

  _pegarToken() {
    if (this._linhaAtual === undefined) {
      return undefined;
    }

    if (/[0-9]/.test(this._linhaAtual[this._coluna])) {
      return this._tratarDigito();
    } if (/[a-zA-Z]/.test(this._linhaAtual[this._coluna])) {
      return this._tratarIdentificadorPalavraReservada();
    } if (this._linhaAtual[this._coluna] === ':') {
      return this._tratarAtribuicao();
    } if (['+', '-', '*'].includes(this._linhaAtual[this._coluna])) {
      return this._tratarOperadorAritmetico();
    } if (['<', '>', '=', '!'].includes(this._linhaAtual[this._coluna])) {
      return this._tratarOperadorRelacional();
    } if ([';', '(', ')', '.', ','].includes(this._linhaAtual[this._coluna])) {
      return this._tratarPontuacao();
    }

    throw new Error(`Caractere "${this._linhaAtual[this._coluna]}" nao reconhecido:${this._linha + 1}:${this._coluna}`);
  }

  _tratarAtribuicao() {
    let dpontos = this._linhaAtual[this._coluna];
    const token = {
      lexema: '', simbolo: '', linha: this._linha + 1, coluna: this._coluna + 1,
    };
    this._coluna += 1;

    if (this._linhaAtual[this._coluna] === '=') {
      dpontos += this._linhaAtual[this._coluna];
      token.lexema = dpontos;
      token.simbolo = 'satribuicao';
      this._coluna += 1;
    } else {
      token.lexema = dpontos;
      token.simbolo = 'sdoispontos';
    }
    return token;
  }

  _tratarDigito() {
    let num = this._linhaAtual[this._coluna];
    const token = {
      lexema: '', simbolo: '', linha: this._linha + 1, coluna: this._coluna + 1,
    };

    this._coluna += 1;
    while (/[0-9]/.test(this._linhaAtual[this._coluna])) {
      num += this._linhaAtual[this._coluna];
      this._coluna += 1;
    }

    token.lexema = num;
    token.simbolo = 'snumero';
    return token;
  }

  _tratarIdentificadorPalavraReservada() {
    let id = this._linhaAtual[this._coluna];
    const token = {
      lexema: '', simbolo: '', linha: this._linha + 1, coluna: this._coluna + 1,
    };

    this._coluna += 1;

    while (this._linhaAtual[this._coluna] && /[_a-zA-Z0-9]/.test(this._linhaAtual[this._coluna])) {
      id += this._linhaAtual[this._coluna];
      this._coluna += 1;
    }

    token.lexema = id;
    token.simbolo = listaSimbolos[id] || 'sidentificador';
    return token;
  }

  _tratarOperadorAritmetico() {
    const opAritmetico = this._linhaAtual[this._coluna];
    const token = {
      lexema: '', simbolo: '', linha: this._linha + 1, coluna: this._coluna + 1,
    };
    this._coluna += 1;

    token.lexema = opAritmetico;
    token.simbolo = listaSimbolos[opAritmetico];
    return token;
  }

  _tratarOperadorRelacional() {
    let opRelacional = this._linhaAtual[this._coluna];
    const token = {
      lexema: '', simbolo: '', linha: this._linha + 1, coluna: this._coluna + 1,
    };
    this._coluna += 1;

    if (opRelacional === '!') {
      if (this._linhaAtual[this._coluna] === '=') {
        opRelacional += this._linhaAtual[this._coluna];
        token.lexema = opRelacional;
        token.simbolo = listaSimbolos[opRelacional];
        this._coluna += 1;
        return token;
      }
      throw new Error(`Caractere "${opRelacional}" nao reconhecido:${this._linha + 1}:${this._coluna}`);
    } if (opRelacional === '>' || opRelacional === '<') {
      if (this._linhaAtual[this._coluna] === '=') {
        opRelacional += this._linhaAtual[this._coluna];
        token.lexema = opRelacional;
        token.simbolo = listaSimbolos[opRelacional];
        this._coluna += 1;
        return token;
      }
      token.lexema = opRelacional;
      token.simbolo = listaSimbolos[opRelacional];
      return token;
    } if (opRelacional === '=') {
      token.lexema = opRelacional;
      token.simbolo = listaSimbolos[opRelacional];
      return token;
    }
    return true;
  }

  _tratarPontuacao() {
    const pont = this._linhaAtual[this._coluna];
    const token = {
      lexema: '', simbolo: '', linha: this._linha + 1, coluna: this._coluna + 1,
    };
    this._coluna += 1;
    token.lexema = pont;
    token.simbolo = listaSimbolos[pont];
    return token;
  }

  _consumirComentarios() {
    while (this._linhaAtual !== undefined && (this._linhaAtual[this._coluna] === '/' || this._linhaAtual[this._coluna] === ' ' || this._linhaAtual === '' || this._linhaAtual[this._coluna] === '' || this._linhaAtual[this._coluna] === '{')) {
      this._consumirComentarioChave();
      this._consumirComentarioBarra();
      this._consumirEspacos();
    }
  }

  _consumirComentarioChave() {
    while (this._linhaAtual && (this._linhaAtual[this._coluna] === '{' || this._linhaAtual[this._coluna] === ' ')) {
      if (this._linhaAtual[this._coluna] === '{') {
        const inicioComentario = { linha: this._linha + 1, coluna: this._coluna };
        while (this._linhaAtual !== undefined && this._linhaAtual[this._coluna] !== '}') {
          this._coluna += 1;
          this._checarNovaLinha();
          if (this._linhaAtual === undefined) {
            throw new Error(`Comentario nunca encerrado:${inicioComentario.linha}:${inicioComentario.coluna}`);
          }
        }
        this._coluna += 1;
      }
      this._consumirEspacos();
    }
  }

  _consumirComentarioBarra() {
    if (this._linhaAtual && this._linhaAtual[this._coluna] === '/') {
      this._coluna += 1;
      if (this._linhaAtual && this._linhaAtual[this._coluna] === '*') {
        const inicioComentario = { linha: this._linha + 1, coluna: this._coluna };
        this._coluna += 1;
        while (this._linhaAtual !== undefined && this._linhaAtual[this._coluna] !== '*') {
          this._coluna += 1;
          this._checarNovaLinha();
          if (this._linhaAtual === undefined) {
            throw new Error(`Comentario nunca encerrado:${inicioComentario.linha}:${inicioComentario.coluna}`);
          }
          if (this._linhaAtual[this._coluna] === '*') {
            this._coluna += 1;
            if (this._linhaAtual[this._coluna] === '/') {
              this._coluna += 1;
              break;
            }
          }
        }
        this._consumirEspacos();
      } else {
        throw new Error(`Caractere "${this._linhaAtual[this._coluna - 1]}" nao reconhecido:${this._linha + 1}:${this._coluna}`);
      }
    }
  }

  _checarNovaLinha() {
    if (this._linhaAtual !== undefined && !this._linhaAtual[this._coluna]) {
      this._linha += 1;
      this._coluna = 0;
      this._linhaAtual = this._codigo[this._linha];
    }
  }

  _consumirEspacos() {
    this._checarNovaLinha();

    while (this._linhaAtual !== undefined && (this._linhaAtual[this._coluna] === ' ' || this._linhaAtual === '') && this._linhaAtual[this._coluna]) {
      this._coluna += 1;
      this._checarNovaLinha();
    }
  }
};
