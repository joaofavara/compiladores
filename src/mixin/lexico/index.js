const pegaToken = require('./pegaToken');

async function codeAnalizer(file) {
  let lista = [];
  let countLine = 0;
  let result = 0;
  let comentEncontradoChave = false;
  let comentEncontradoBarra = false;

  // eslint-disable-next-line prefer-arrow-callback
  file.every((line) => {
    countLine += 1;
    const obj = {
      file: line.split('\n')[0].replace(/(\t|\r)/gm, ''),
      caracter: 0,
      countLine,
    };

    do {
      while (!comentEncontradoBarra && (comentEncontradoChave || obj.file[obj.caracter] === '{' || obj.file[obj.caracter] === ' ') && obj.file[obj.caracter]) {
        if (comentEncontradoChave || obj.file[obj.caracter] === '{') {
          comentEncontradoChave = true;
          while (obj.file[obj.caracter] !== '}' && obj.file[obj.caracter]) {
            obj.caracter += 1;
          }
          if (obj.file[obj.caracter] === '}') {
            comentEncontradoChave = false;
          }
          obj.caracter += 1;
        }
        while ((obj.file[obj.caracter] === ' ' || obj.file[obj.caracter] === '') && obj.file[obj.caracter]) {
          obj.caracter += 1;
        }
      }

      while (!comentEncontradoChave && (comentEncontradoBarra || obj.file[obj.caracter] === '/' || obj.file[obj.caracter] === ' ') && obj.file[obj.caracter]) {
        if (comentEncontradoBarra || obj.file[obj.caracter] === '/') {
          obj.caracter += 1;
          if (comentEncontradoBarra || obj.file[obj.caracter] === '*') {
            obj.caracter += 1;
            comentEncontradoBarra = true;
            while (obj.file[obj.caracter] !== '*' && obj.file[obj.caracter]) {
              obj.caracter += 1;
            }
            if (obj.file[obj.caracter] === '*') {
              obj.caracter += 1;
              if (obj.file[obj.caracter] === '/') {
                obj.caracter += 1;
                comentEncontradoBarra = false;
              }
            }
            while ((obj.file[obj.caracter] === ' ' || obj.file[obj.caracter] === '') && obj.file[obj.caracter]) {
              obj.caracter += 1;
            }
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
      }

      if (obj.file[obj.caracter]) {
        result = pegaToken(obj);
        if (result !== -1) {
          lista = lista.concat(result);
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

module.exports = async (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  await reader.readAsText(file);

  reader.onloadend = async () => {
    const codeLines = await reader.result.split('\n');
    await codeAnalizer(codeLines);
  };
};
