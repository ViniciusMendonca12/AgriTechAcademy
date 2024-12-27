var Instrutores = require("../models/InstrutoresModel")
var Usuarios = require("../models/UsuariosModel")

class InstrutoresController{
    
    async carregaPaginaCadastroInstrutores(req, res){

        if(req.session.user == undefined){
            console.log("É necessario estar logado")
        }

        const idUsuarioSession = req.session.user.id

        const usuario = await Usuarios.pegaInformacoesUsuario(idUsuarioSession)
        console.log(usuario)
        res.render("instrutores/cadastroInstrutor.ejs", {usuario: usuario})

    }

    async cadastrarInstrutor(req, res){
        var idUsuario = req.body.idUsuario
        var nomeInstrutor = req.body.nomeInstrutor
        var cpfInstrutor = req.body.cpfInstrutor
        var enderecoInstrutor = req.body.enderecoInstrutor 
        var contatoInstrutor = req.body.contatoInstrutor
        var dataNascimentoInstrutor = req.body.dataNascimentoInstrutor

        var cadastroInstrutores =
        await Instrutores.cadastrarInstrutores(idUsuario, cpfInstrutor, enderecoInstrutor,
        nomeInstrutor, contatoInstrutor, dataNascimentoInstrutor)

        if(cadastroInstrutores.status){
            console.log("deucerto")
            res.redirect("/cursos")
            req.session.authenticate


        }else{
            console.log("deu ruim")
        }


    }
    
}

module.exports = new InstrutoresController()