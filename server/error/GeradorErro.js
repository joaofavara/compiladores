module.exports = class GeradorErro extends Error {
  constructor(msgErro, linhaErro) {
    super(msgErro);
    this.linhaErro = linhaErro;
  }
};
