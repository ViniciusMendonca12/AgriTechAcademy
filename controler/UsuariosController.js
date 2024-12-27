var Usuarios = require("../models/UsuariosModel")
const bcrypt = require("bcryptjs")
var Curso = require("../models/CursoModel")


class UsuariosController{
    async carregaPaginaCadastroUsuario(req, res){
        try {
            res.render("login/cadastro.ejs")

        } catch (error) {
            console.log(error)
            return
        }
    }

    async carregaPaginaLoginUsuario(req, res){
        try {
            res.render("login/login.ejs")

        } catch (error) {
            console.log(error)
            return
        }
    }

    async logoutUsuario(req, res){
        try {
            req.session.user = undefined
            res.redirect("/")
        } catch (error) {
            console.log(error)
            return
        }
    }

    async cadastrarUsuario(req, res){
        try {
            var nomeUsuario = req.body.nomeUsuario;
            var emailUsuario = req.body.emailUsuario;
            var senhaUsuario = req.body.senhaUsuario;

            var validaEmail = await Usuarios.validacaoEmail(emailUsuario)
            console.log(validaEmail)

            if(validaEmail != undefined){
                res.send("Email já cadastrado");
            }else{

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(senhaUsuario, salt);

                var cadastraUsuario = await Usuarios.cadastraUsuario(nomeUsuario, emailUsuario, hash)

                if(!cadastraUsuario.status){    
                    console.log("erro no cadastro")
                }

                var novoUsuario = await Usuarios.validacaoEmail(emailUsuario)
                console.log(nomeUsuario)

                var validacaoDeSenha = bcrypt.compareSync(senhaUsuario, novoUsuario.senha);

                if (validacaoDeSenha) {
                    req.session.user = {
                        id: novoUsuario.id,
                        email: novoUsuario.email,
                        nome: novoUsuario.nomeUsuario
                    };
                    res.redirect("/");
                } else {
                    res.send("Senha errada");
                }
            }

        } catch (error) {
            console.log(error)
            return 
        }
    }

    async autenticarLogin(req, res){
        try {
            var emailLogin = req.body.emailLogin
            var senhaLogin = req.body.senhaLogin
            
            var usuario = await Usuarios.validacaoEmail(emailLogin)

            if(usuario){
                var validacaoDeSenha = bcrypt.compareSync(senhaLogin, usuario.senha)
    
                if(validacaoDeSenha){
                        req.session.user = {
                        id: usuario.id,
                        emai: usuario.email,
                        nome: usuario.nomeUsuario
                    }
    
                    res.redirect("/")
                
                }else{
                    res.send("senha errada")
                }
            }else{
                res.send("email nao cadastrado")
            }
            
        } catch (error) {
            console.log(error+" erro interno de servidor")
            return
        }
    } 
    
    async carregaHome(req, res){
        try {
             /* req.session.user = {
                id: 1,
                email: "vivicogamerbr2@gmail.com",
                nome: "Gazeta"
            }       */     
            const sessao = req.session.user
            var sessao1
            if(sessao == undefined){
                sessao1 = 0 
                res.render("home.ejs", {sessao1:sessao1})
        
            }else if(sessao != undefined){
                var usuario = await Curso.pegaUsuario(req.session.user.id)

                sessao1 = 1
                res.render("home.ejs", {usuario: usuario, sessao1:sessao1})
        
            }
        } catch (error) {
            console.log(error)
            return
        }
    }
}

module.exports = new UsuariosController()