const teste = require("./lexema.json");

module.exports = (obj) =>{
    let pont = obj.file[obj.caracter];
    let token = {lexema:'',simbolo:''};
    obj.caracter += 1;

    token.lexema = pont;
    token.simbolo = teste[pont];
    obj.lista.push(token);
}