// const pegaToken = require('./pegaToken');
const fs = require('fs');

async function teste() {
  const file = fs.readFileSync('final.txt', 'utf8');
  let caracter = 0;

  do {
    while ((file[caracter] === '{' || file[caracter] === ' ') && file[caracter]) {
      if (file[caracter] === '{') {
        while (file[caracter] !== '}' && file[caracter]) {
          caracter += 1;
        }
        caracter += 1;
      }
      while ((file[caracter] === ' ' || file[caracter] === '\n') && file[caracter]) {
        caracter += 1;
      }
    }
    if (file[caracter]) {
      console.log(file[caracter]);
      caracter += 1;
    }
  } while (file[caracter]);
}

teste();
