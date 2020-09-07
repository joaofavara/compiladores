const teste = require("./lexema.json");

module.exports = (obj) =>{
    let opAritmetico = obj.file[obj.caracter];
    let token = {lexema:'',simbolo:''};
    obj.caracter += 1;

    token.lexema = opAritmetico;
    token.simbolo = teste[opAritmetico];
    obj.lista.push(token);
}