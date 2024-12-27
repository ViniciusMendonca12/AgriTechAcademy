var knex = require("../database/database")

class Avaliacoes{

   async cadastrarAvaliacao(idUsuario, idCurso, avaliacao, 
        comentarioAvaliacao, dataAvaliacao, statusAvaliacao){
        try {
            var result = await knex.insert(  {idUsuario: idUsuario,
                                       idCurso: idCurso,
                                       avaliacao: avaliacao,
                                       comentarioAvaliacao: comentarioAvaliacao,
                                       dataAvaliacao: dataAvaliacao,
                                       statusAvaliacao: statusAvaliacao}
            ).table("avaliacoes_curso")
            return {status:true}
        } catch (error) {
            return{status: false, err: error}
        }
    }

    async pegaAvaliacaoExisteUsuarioCurso(idCurso, idUsuario){// pega a avaliação de um usuario em um determinado curso
        try {
            var result = knex.select("avaliacoes_curso.*").table("avaliacoes_curso")
            .where("avaliacoes_curso.idUsuario", idUsuario)
            .andWhere("avaliacoes_curso.idCurso", idCurso)

            return result

        } catch (error) {
            console.log(error)
            return []

            
        }
    }

    async editarAvaliacao(idUsuario, idCurso, avaliacao, 
        comentarioAvaliacao, dataAvaliacao, statusAvaliacao){
        try {
            var result = await knex.update( {idUsuario: idUsuario,
                                       idCurso: idCurso,
                                       avaliacao: avaliacao,
                                       comentarioAvaliacao: comentarioAvaliacao,
                                       dataAvaliacao: dataAvaliacao,
                                       statusAvaliacao: statusAvaliacao}
            ).table("avaliacoes_curso")
            .where("avaliacoes_curso.idUsuario", idUsuario)
            .andWhere("avaliacoes_curso.idCurso", idCurso)
            return {status:true}
        } catch (error) {
            return{status: false, err: error}
        }
    }
  

    async estatisticasAvaliacoesCurso(idCurso){ /* obter estatísticas da avaliação do curso */
        try {
            var result =  await knex('avaliacoes_curso')
            .where({ idCurso: idCurso })
            .select(
              knex.raw('COUNT(*) as totalAvaliacoes'), 
              knex.raw('SUM(avaliacoes_curso.avaliacao) as somaNotas'), 
              knex.raw('AVG(avaliacoes_curso.avaliacao) as mediaNotas') 
            )
            .first(); 
            return result 
        } catch (error) {
            console.error('Erro ao obter estatísticas da avaliação do curso:', error);

        }
    }
}




module.exports = new Avaliacoes()