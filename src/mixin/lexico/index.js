const pegaToken = require('./pegaToken');

async function codeAnalizer(file) {
  let lista = [];
  let countLine = 0;
  let result = 0;

  // eslint-disable-next-line prefer-arrow-callback
  file.every((line) => {
    countLine += 1;
    const obj = {
      file: line.split('\n')[0],
      caracter: 0,
      lista: {},
      countLine,
    };

    do {
      while ((obj.file[obj.caracter] === '{' || obj.file[obj.caracter] === ' ') && obj.file[obj.caracter]) {
        if (obj.file[obj.caracter] === '{') {
          while (obj.file[obj.caracter] !== '}' && obj.file[obj.caracter]) {
            obj.caracter += 1;
          }
          obj.caracter += 1;
        }
        while (obj.file[obj.caracter] === ' ' && obj.file[obj.caracter]) {
          obj.caracter += 1;
        }
      }
      if (obj.file[obj.caracter]) {
        result = pegaToken(obj);
        if (result !== -1) {
          lista = lista.concat(obj.lista);
        } else {
          lista = lista.concat({
            type: 'error',
            line,
            column: obj.caracter + 1,
            row: countLine,
            caracter: obj.file[obj.caracter],
          });
          return false;
        }
      }
    } while (obj.file[obj.caracter]);

    return true;
  });
  lista.forEach((token) => {
    console.log(token);
  });
}

const mixin = {
  data() {
    return {
      codeLines: '',
    };
  },
  methods: {
    async fileReader(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      await reader.readAsText(file);

      reader.onloadend = async () => {
        this.codeLines = await reader.result;
        const codeLines = this.codeLines.split('\n');
        await codeAnalizer(codeLines);
      };
    },
  },
};

module.exports = mixin;
