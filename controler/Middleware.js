var Curso = require("../models/CursoModel")

class Middleware{

    async AutenticacaoLogin(req, res, next) {
        if (!req.session.user) {
          return res.render("erro.ejs", { mensagem: "Você deve estar logado para acessar essa página" });
        }
        next();
    }
    
    async AutenticacaoInstrutor(req, res, next) {
        if (!req.session.user) {
          return res.render("erro.ejs", { mensagem: "Você deve estar logado para acessar essa página" });
        }
        var idUsuarioLogado = req.session.user.id
        var instrutor = await Curso.instrutor(idUsuarioLogado)
        if(instrutor == undefined){
            return res.render("erro.ejs", { mensagem: "Você deve ser um instrutor" });

        }
        next();
    }



}

module.exports = new Middleware()