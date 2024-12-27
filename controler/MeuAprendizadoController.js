var MeuAprendizado = require("../models/MeuAprendizadoModel")
var Curso = require("../models/CursoModel")
var Perfil = require("../models/PerfilModel")


class MeuAprendizadoController{
    
      async adicionaCursoMeuAprendizado(req, res) {
        var idCurso = req.body.idCurso;
        var dataAquisicao = req.body.dataAquisicao;
        var ultimoAcesso = req.body.ultimoAcesso;
        
        if (req.session.user == undefined) {
            res.status(403).send("O Usuário não está logado");
            return;
        }
        
        var idUsuario = req.session.user.id;
    
        if (idCurso == undefined) {
            res.status(403).json({ err: "o idCurso não pode ser nulo" });
            return;
        }
    
        if (dataAquisicao == undefined) {
            res.status(403).json({ err: "o dataAquisicao não pode ser nula" });
            return;
        }
    
        async function verificaSeJaPossuiCurso(idUsuario, idCurso) {
            try {
                var result = await MeuAprendizado.validaSeUsuarioJaPossuiCurso(idUsuario, idCurso); 

                if (result == undefined) {
                    return { status: true };

                } else {
                    return { status: false, mensagem: "Não é possível adquirir novamente este curso!!" };
                }
                
            } catch (error) {
                return { status: false, mensagem: error.message };
            }
        }
    
       
    
        try {
          const cursosAdquirido = await verificaSeJaPossuiCurso(idUsuario, idCurso);
    
          console.log(cursosAdquirido);
      
          if (!cursosAdquirido.status) {
              return res.status(400).send(cursosAdquirido.mensagem);
          }
          
            await MeuAprendizado.adquireCurso(idCurso, idUsuario, dataAquisicao, ultimoAcesso);
            res.status(200).send("Tudo ok");
        } catch (error) {
            res.status(500).send("Erro ao adquirir o curso: " + error.message);
        }
    }

    async listaTodosCursos(req, res){
      var parametro = req.params.filtro
      console.log(parametro)
      if(req.session.user != undefined){
        var id = req.session.user.id
        var cursos = await MeuAprendizado.cursos(id)
        res.json(parametro)
      }else{
        res.status(403)
        res.send("O Usuário não esta logado")
      }
  }

  async listaTodosInstrutoresCursos(req, res){
    if(req.session.user != undefined){
      var id = req.session.user.id
      var InstrutoresCursos = await MeuAprendizado.listaInstrutoresCursosUsuarios(id)
      res.json(InstrutoresCursos)


    }else{
      res.status(403)
      res.send("O Usuário não esta logado")
    }
  }

  async exibeMeuAprendizado(req, res) {
    var id = req.session.user.id
    var cursos = await MeuAprendizado.cursos(id)
    var instrutor = await Curso.instrutor(id)
    var usuario = await Perfil.findPerfilUsuarioByID(id)

      res.render("curso/meuAprendizado.ejs", { cursos: cursos, instrutor:instrutor, usuario:usuario });
        
    
    
  }

  async exibeMeuAprendizadoFiltro(req, res) {
    var id = req.session.user.id
    var tipoOrdenacao = req.query.tipoOrdenacao || null;
    var categoria = req.query.categoria || null;
    var instrutor = req.query.instrutor || null;
    var progresso = req.query.progresso || null;


    var cursos = await MeuAprendizado.cursos(id, tipoOrdenacao, categoria, instrutor, progresso)
      
    res.json(cursos)
  }

 





}

module.exports = new MeuAprendizadoController()