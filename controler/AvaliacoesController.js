var Avaliacoes = require("../models/AvaliacoesModel")

class AvaliacoesController{
   
    async cadastrarEditarAvaliacao(req, res){
            if(!req.session.user){
                return res.status(403).send("É necessário estar logado para fazer uma avaliação");

            }
            var idUsuario = req.session.user.id
            var {idCurso, avaliacao, comentarioAvaliacao, dataAvaliacao, statusAvaliacao } = req.body

            var avaliacaoCursoUsuario = await Avaliacoes.pegaAvaliacaoExisteUsuarioCurso(idCurso, idUsuario);
            
            if(avaliacaoCursoUsuario.length > 0){
                var result = await Avaliacoes.editarAvaliacao(idUsuario, idCurso, avaliacao, 
                    comentarioAvaliacao, dataAvaliacao, statusAvaliacao )
                if(result.status){
                    return res.status(200).send("Tudo ok");
    
                }else{
                    console.log(result.err)
                    return res.status(403).send("Houve um erro ao tentar editar essa avaliação");
    
                }
            }else{
                var result = await Avaliacoes.cadastrarAvaliacao(idUsuario, idCurso, avaliacao, 
                    comentarioAvaliacao, dataAvaliacao, statusAvaliacao )
                if(result.status){
                    return res.status(200).send("Tudo ok");
    
                }else{
                    console.log(result.err)
                    return res.status(403).send("Houve um erro ao tentar cadastrar essa avaliação");
    
                }
            }
    }

    async pegaAvaliacaoExisteUsuarioCurso(req, res) {
      
        if (!req.session.user) {
            return res.status(403).send("É necessário estar logado para fazer uma avaliação");
        }
    
        var idUsuario = req.session.user.id;
        var idCurso = req.params.idCurso;

        if (!idCurso) {
            return res.status(400).send("ID do curso é necessário");
        }
    
        try {
            var avaliacaoCursoUsuario = await Avaliacoes.pegaAvaliacaoExisteUsuarioCurso(idCurso, idUsuario);
    
            if (avaliacaoCursoUsuario === undefined) {
                return res.status(403).send("Erro ao buscar por avaliação para esse usuário.");
            } else {
                return res.json(avaliacaoCursoUsuario);
            }
        } catch (error) {
            return res.status(500).send("Erro ao buscar avaliação: " + error.message);
        }
    }
    
    async estatisticasAvaliacoesCurso(req, res){
        if (!req.session.user) {
            return res.status(403).send("É necessário estar logado para fazer uma avaliação");
        }
    
        var idCurso = req.params.idCurso;

        try {
            var estatisticasAvaliacoesCurso = await Avaliacoes.estatisticasAvaliacoesCurso(idCurso);
    
            if (estatisticasAvaliacoesCurso === undefined) {
                return res.status(403).send("Erro ao buscar por estatisticas para essa avaliação.");
            } else {
                return res.json(estatisticasAvaliacoesCurso);
            }
        } catch (error) {
            return res.status(500).send("Erro ao buscar estatistica dessa avaliação: " + error.message);
        }

    }
    
}

module.exports = new AvaliacoesController()