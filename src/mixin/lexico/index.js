const pegaToken = require('./pegaToken');

function codeAnalizer(file) {
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

      // eslint-disable-next-line max-len
      if (!obj.file[obj.caracter] && (countLine === file.length) && (comentEncontradoChave || comentEncontradoBarra)) {
        lista = lista.concat({
          type: 'error - comentario infinito',
          line,
          column: obj.caracter + 1,
          row: countLine,
          caracter: '{',
        });
        return false;
      }
    } while (obj.file[obj.caracter]);

    return true;
  });

  return lista.reverse();
}

module.exports = async (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file);

  const codeLines = await new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result.split('\n'));
    };
  });

  const result = codeAnalizer(codeLines);
  return result;
};
