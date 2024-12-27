var Perfil = require("../models/PerfilModel")
var Curso = require("../models/CursoModel")


class PerfilController{
    
    async perfilUsuario(req, res){
      var id = req.session.user.id 
      if(req.session.user != undefined){
        var perfil = await Perfil.perfilUsuario(id)
        res.json(perfil)
      }else{
        res.status(403) 
        res.json({err: "Usuário fora de Sessão"})
        return
      }
    }

    async perfilUsuarioByID(req, res){

      if(req.session.user != undefined){
        
        var id = req.session.user.id
        var perfilUsuario = await Perfil.findPerfilUsuarioByID(id)
        res.json(perfilUsuario)

      }else{
        res.status(403) 
        res.json({err: "Usuário fora de Sessão"})
        return
      }
    }

    async perfilInstrutorByID(req, res){

      if(req.session.user != undefined){
        
        var id = req.session.user.id
        var perfilInstrutor = await Perfil.findPerfilInstrutorByID(id)
        if (!perfilInstrutor || (Array.isArray(perfilInstrutor) && perfilInstrutor.length === 0)) {
          res.status(404);
          res.send("usuario nao é instrutor");
        }else {
          res.json(perfilInstrutor);
        }

        

      }else{
        res.status(403) 
        res.json({err: "Usuário fora de Sessão"})
        return
      }
    }

    async editarUsuarioPerfil(req, res){

      if(req.session.user != undefined){

        var id = req.session.user.id
        var {nomeUsuario, email, bibliografia, twitter, facebook, linkedin, github, profissao} = req.body
        var result = await Perfil.editarUsuarioPerfil(id, nomeUsuario, bibliografia, email, twitter, facebook, linkedin, github, profissao) //retorna o json


        if(result != undefined){
            if(result.status){ //le o json true(deu certo)
                res.status(200)
                res.send("tudo ok")
            }else{
                res.status(406)
                res.send("falha na operação")
            }
        }else{
            res.status(406)
            res.send("usuario nao encontrado")
            
        }  
      }else{
        res.status(403)
        res.send("Usuário não logado")
      }
    }

    async editarInstrutorPerfil(req, res){
      if(req.session.user != undefined){

      var id = req.session.user.id
      var {cpf, endereco, nomeCompleto, celular, dataDeNascimento} = req.body
      var result = await Perfil.editarInstrutorPerfil(id, cpf, endereco, nomeCompleto, celular, dataDeNascimento) //retorna o json
        console.log(result)

      if(result != undefined){
          if(result.status){ //le o json true(deu certo)
              res.status(200)
              res.send("tudo ok")
          }else{
              res.status(406)
              res.send("falha na operação")
          }
      }else{
          res.status(406)
              res.send("instrutor nao encontrado")
          
      }
    }else{
      res.status(403)
      res.send("Usuário não logado")
    }
  }


  async editarImagemPerfil(req, res){

    if(req.session.user != undefined){

      var idUsuario = req.session.user.id
      var imagemUsuario = req.body.imagemUsuario
      var result = await Perfil.editarImagemPerfil(idUsuario, imagemUsuario) 


      if(result != undefined){
          if(result.status){ 
            res.status(200).send("Imagem de perfil alterada com sucesso.");
          }else{













          }
      }else{
        res.status(406).send("Houve um erro ao alterar a imagem de perfil. Usuário não encontrado");

          
      }  
    }else{
      res.status(403)
      res.send("Usuário não logado")
    }
  }




async perfilUsuario(req,res){
  if(req.session.user == undefined){
    res.status(403).send("Você deve estar logado para acessar o perfil");

  }
  var idUsuario = req.session.user.id
  var usuario = await Perfil.findPerfilUsuarioByID(idUsuario)


  var instrutor = await Curso.instrutor(idUsuario)
  var ehInstrutor
  if(instrutor != undefined){
      ehInstrutor = 1
  }else{
      ehInstrutor = 0
  }

  res.render("perfil/perfil.ejs", {usuario: usuario, ehInstrutor})
}



}

module.exports = new PerfilController()