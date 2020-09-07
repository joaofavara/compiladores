const fs = require('fs');
const pegaToken = require('./pegaToken');

async function teste() {
  const file = fs.readFileSync('final.txt', 'utf8');
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
      while ((obj.file[obj.caracter] === ' ' || obj.file[obj.caracter] === '\n') && obj.file[obj.caracter]) {
        obj.caracter += 1;
      }
    }
    if (obj.file[obj.caracter]) {
      console.log(obj.file[obj.caracter]);
      pegaToken(obj);
      console.log('obj: ', obj);
      obj.caracter += 1;
    }
  } while (obj.file[obj.caracter]);
}

teste();
