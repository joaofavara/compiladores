const pegaToken = require('./pegaToken');

async function codeAnalizer(file) {
  const obj = {
    file,
    caracter: 0,
    lista: [],
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
      pegaToken(obj);
    }
  } while (obj.file[obj.caracter]);

  return obj.lista;
}

module.exports = async (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  await reader.readAsText(file);

  reader.onloadend = async () => {
    const commands = await reader.result.replace(/(\r\n|\n|\r)/gm, '');
    const listaTokens = await codeAnalizer(commands);
    console.log(listaTokens);
  };
};
