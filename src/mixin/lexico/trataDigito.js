module.exports = (obj) => {
    let num = obj.file[obj.caracter];
    let token = {lexema:'', simbolo:''}
    
    obj.caracter += 1;

    while (!isNaN(obj.file[obj.caracter])){
        num = num + obj.file[obj.caracter];
        obj.caracter += 1;
    }

    token.lexema = num;
    token.simbolo = 'snumero';
    obj.lista.push(token);
}