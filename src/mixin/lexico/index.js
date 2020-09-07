const fs = require('fs');
const pegaToken = require('./pegaToken');

async function teste() {
  let file = fs.readFileSync('final.txt', 'utf8');
  file = file.replace(/(\r\n|\n|\r)/gm, '');
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
      console.log('obj: ', obj);
    }
  } while (obj.file[obj.caracter]);
}

teste();
