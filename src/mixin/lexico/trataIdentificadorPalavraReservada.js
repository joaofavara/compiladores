const teste = require('./lexema.json');

module.exports = (obj) => {

    const alfabeto = ['_','0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let id = obj.file[character];
    let token = {lexema:'', simbolo:''};

    obj.caracter += 1;

    while(obj.file[character] && alfabeto.includes( obj.file[character].toLowerCase() )){
        id = id + obj.file[character];
        obj.caracter += 1;
    }

    token.lexema = id;
    token.simbolo = teste[id] || "sidentificador";
    obj.lista.push(token);
};