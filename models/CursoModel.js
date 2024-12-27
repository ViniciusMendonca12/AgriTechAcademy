var knex = require("../database/database")

class Curso{
    async informacoesCurso(id, tituloCurso){
        try {
            var result = knex.select(
                "cursos.*",
                "cursos.id",  
                "cursos.titulo",
                "instrutores.nomeCompleto",
                knex.raw('(SELECT SUM(aulas.duracaoAula) FROM aulas WHERE aulas.idCurso = cursos.id) AS duracaoTotalCurso'), 
                knex.raw('COUNT(aulas.id) AS totalAulasCurso'),
                knex.raw('(SELECT COUNT(DISTINCT cursos_usuarios.idUsuario) FROM cursos_usuarios WHERE cursos_usuarios.idCurso = cursos.id) AS quantidadeAlunos'),
                knex.raw('COALESCE((SELECT MAX(aulas.dataCriacao) FROM aulas WHERE aulas.idCurso = cursos.id), cursos.dataCriacaoCurso) AS ultimaAtualizacao'),
                knex.raw("(SELECT CEIL(AVG(avaliacoes_curso.avaliacao)) FROM avaliacoes_curso WHERE avaliacoes_curso.idCurso = cursos.id) as mediaAvaliacoes"),
                knex.raw('(SELECT COUNT(*) FROM avaliacoes_curso WHERE avaliacoes_curso.idCurso = cursos.id) AS totalAvaliacoes')


            )
            .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
            .leftJoin("aulas", "aulas.idCurso", "cursos.id")
            .table("cursos").where("cursos.id", id)

            if(tituloCurso == 0 && id){
                result.where("cursos.id", id).first()
            }
            if(tituloCurso && id == 0){
                result.where("cursos.titulo", tituloCurso).first()

            }

            const query = await result
            return query 
        } catch (error) {
            console.log(error)
            return []
            
        }
    }

    async cadastrarCurso(tituloCurso, categoriaCurso, instrutorCurso, imagemCurso, descricaoCurso,
        requisitosCursos,conteudoCurso, miniDescricaoCurso, linkCurso, dataCriacaoCurso){
        try {
           await knex.insert({
                titulo: tituloCurso,
                idCategoria: categoriaCurso,
                descricao: descricaoCurso,
                idInstrutor: instrutorCurso,
                imagemCurso: imagemCurso,
                linkCurso: linkCurso,
                dataCriacaoCurso: dataCriacaoCurso,
                descricaoMini:miniDescricaoCurso,
                requisitos:requisitosCursos,
                conteudoAprendizado:conteudoCurso
            }).table("cursos")
    
                return {status: true}
                
        } catch (error) {
            return {status: false, err:error} 
        }
    }

    async verificaCursoExistente(tituloCurso){
        try {
            var result = knex("cursos")
            .select("cursos.titulo")
            .count("* as cursosContagem")
            .where("cursos.titulo", tituloCurso)
            .first();
            return result
            
        } catch (error) {
            console.log(error)
            return[]
        }
    }

    async cursosInstrutorGerenciar(id, tipoOrdenacao, categoria){
        
        try {
            var result =  
                knex.select("cursos.*",
                              "instrutores.nomeCompleto as nomeInstrutor",
                              "cursos.idCategoria",
                              "cursos.idInstrutor",
                              "cursos.titulo",
                              knex.raw("(SELECT AVG(avaliacoes_curso.avaliacao) FROM avaliacoes_curso WHERE avaliacoes_curso.idCurso = cursos.id) as mediaAvaliacoes")

                              
                              
             ).table("cursos")
            .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor" )
            .where("cursos.idInstrutor",id)

            if (categoria && categoria != 0) {
                result = result.andWhere("cursos.idCategoria", categoria);
            }

            if(tipoOrdenacao == 2){
                result = result.orderBy("cursos.titulo", "asc")

            }
            if(tipoOrdenacao == 3){
                result = result.orderBy("cursos.titulo", "desc")

            }

            const query = await result
            return query
         } catch (err) {
           console.log(err)  
           return []
         }
    }

    async instrutor(idUsuario){
        try {
            var result = knex.table("instrutores").select("instrutores.id", "instrutores.nomeCompleto")
            .where("instrutores.idUsuario", idUsuario).first()
            
            return result

        } catch (error) {
            console.log(error)
            return[]
        }

    }

    async aulasCurso(idCurso){
        try{
            var result = knex.table("aulas").select("aulas.idCurso","aulas.*")
            .where("aulas.idCurso", idCurso)

            return result

        }catch(error){
            console.log(error)
            return[]
        }

    }

    async informacoesCursoUnico(id, tituloCurso){
        try {
            var query =  knex.table("cursos").select("cursos.*", "cursos.titulo", "cursos.id")

            if(id == 0){
                query = query.where("cursos.titulo",tituloCurso).first()
            }

            if(tituloCurso == 0 ){
                query = query.where("cursos.id", id).first()

            }
            const result = await query
            return result

        } catch (error) {
            console.log(error)
            return[]
            
        }
    }
    
    async informacoesCursoUnicoPorAula(idAula){
        try {
            var result = knex.table('aulas')
            .select('aulas.id', 'cursos.idInstrutor', 'cursos.id as idCurso', 'cursos.titulo')
            .innerJoin('cursos', 'aulas.idCurso', 'cursos.id')
            .where('aulas.id', idAula)
            .first();

            return result

        } catch (error) {
            console.log(error)
            return[]
            
        }
    }

    async deletarAula(idAula){
        try {
            await knex.delete().table("aulas").where("id", idAula)
            return {status: true}
        } catch (error) {
            return {status: false, err:error}
        }
    }

    async cadastrarAula(idCurso, tituloAula, descricaoAula, linkAula, dataCriacao, duracaoAula){
        try {
            await knex.insert({
                idCurso: idCurso,
                tituloAula: tituloAula,
                descricaoAula: descricaoAula,
                linkAula: linkAula,
                dataCriacao: dataCriacao, 
                duracaoAula: duracaoAula
            }).table("aulas")

            return {status:true}
        } catch (error) {
            return{status:true, err:error}
            
        }
    }


    async editarAula(idAula, idCurso, tituloAula, descricaoAula, linkAula, dataCriacao, duracaoAula){
        try {
            await knex.update({
                idCurso: idCurso,
                tituloAula: tituloAula,
                descricaoAula: descricaoAula,
                linkAula: linkAula,
                dataCriacao: dataCriacao, 
                duracaoAula: duracaoAula
            }).table("aulas").where({id: idAula})

            return {status:true}
        } catch (error) {
            return{status:true, err:error}
            
        }
    }

    async aulaUnica(idAula){
        try {
            var result = await knex.select("aulas.*").table("aulas").where({id:idAula}).first()
            return result
        } catch (error) {
            console.log(error)
            return []
            
        }
    }

    async excluirCurso(idCurso){
        try {
            var result = await knex.delete().table("cursos").where("id", idCurso)
            return {status: true}
            
        } catch (error) {
            console.log(error)
            return{status: false, err: error}
            
        }
    }


    async editarCurso(tituloCurso, categoriaCurso, instrutorCurso, imagemCurso, descricaoCurso,
        requisitosCursos,conteudoCurso, miniDescricaoCurso, linkCurso, dataCriacaoCurso, idCurso){
        try {
           await knex.update({
                titulo: tituloCurso,
                idCategoria: categoriaCurso,
                descricao: descricaoCurso,
                idInstrutor: instrutorCurso,
                imagemCurso: imagemCurso,
                linkCurso: linkCurso,
                dataCriacaoCurso: dataCriacaoCurso,
                descricaoMini:miniDescricaoCurso,
                requisitos:requisitosCursos,
                conteudoAprendizado:conteudoCurso
            }).table("cursos").where("cursos.id", idCurso)
                return {status: true}

        } catch (error) {
            return {status: false, err:error} 
        }
    }

    async listaTodasAulasCursos(idCurso){
        try {
            var result = await knex.select("aulas.*", "aulas.id as idAula")
            .table("aulas")
            .innerJoin("cursos", "cursos.id", "aulas.idCurso")
            .where("aulas.idCurso", idCurso)

            return result

        } catch (error) {
            console.log(error)
            return []
        }
    }

      async buscaCursoCompletoAssistir(nomeCurso){
        try {
            var curso =
            await knex.select(["cursos.*","cursos.id as idDoCurso", "instrutores.*", "usuarios.*", "categorias.*" ])
            .table("cursos")
            .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
            .innerJoin("usuarios", "usuarios.id", "instrutores.idUsuario")
            .innerJoin("categorias", "categorias.id", "cursos.idCategoria")
            .where("cursos.titulo", nomeCurso)
            .first()

            return curso

        } catch (error) {
            console.log(error)
            return []
        }
       
    } 

    async aulasCursoAssistir(nomeCurso){
        try {
            const curso = await this.buscaCursoCompletoAssistir(nomeCurso)

            if (curso) {
                var aulas = await knex
                    .select(["aulas.*",
                             "aulas.id as idAula",
                             "aulas_concluidas.id as idAulaConcluida",
                             "aulas_concluidas.concluida",
                             "cursos.titulo as tituloCurso "
                            ])
                    .table("aulas")
                    .leftJoin("cursos", "cursos.id", "aulas.idCurso")
                    .leftJoin("aulas_concluidas", "aulas_concluidas.idAula", "aulas.id")
                    .where("aulas.idCurso", curso.idDoCurso);
    
                return aulas;
            } else {
                console.log("Curso não encontrado.");
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
       
    }


    async progressoCursoAssistir(nomeCurso) {
        try {
            const curso = await this.buscaCursoCompletoAssistir(nomeCurso);
            if (!curso) {
                throw new Error("Curso não encontrado");
            }

            const queryProgresso = `
                SELECT 
                    total_aulas.total_aulas,
                    aulas_assistidas.aulas_assistidas,
                    (aulas_assistidas.aulas_assistidas / total_aulas.total_aulas) * 100 AS porcentagem_assistida,
                    duracao_total.duracao_total,
                    duracao_assistida.duracao_assistida
                FROM 
                    (SELECT COUNT(*) AS total_aulas FROM aulas WHERE idCurso = ?) AS total_aulas,
                    (SELECT COUNT(*) AS aulas_assistidas FROM aulas_concluidas WHERE idCurso = ?) AS aulas_assistidas,
                    (SELECT SUM(duracaoAula) AS duracao_total FROM aulas WHERE idCurso = ?) AS duracao_total,
                    (SELECT SUM(aulas.duracaoAula) AS duracao_assistida 
                     FROM aulas_concluidas 
                     INNER JOIN aulas ON aulas_concluidas.idAula = aulas.id 
                     WHERE aulas_concluidas.idCurso = ?) AS duracao_assistida
            `;

            const results = await knex.raw(queryProgresso, [curso.idDoCurso, curso.idDoCurso, curso.idDoCurso, curso.idDoCurso]);
            const progresso = results[0][0]; // Acesse a primeira linha dos resultados

            return {
                total_aulas: progresso.total_aulas,
                aulas_assistidas: progresso.aulas_assistidas,
                porcentagem_assistida: progresso.porcentagem_assistida,
                duracao_total: progresso.duracao_total,
                duracao_assistida: progresso.duracao_assistida
            };
        } catch (error) {
            console.log(error);
            return null;
        }
    }


    async buscaAulaCompletaAssistir(tituloAula, tituloCurso){
        try {
            var aula =
            await knex.select(["cursos.*","cursos.id as idDoCurso", "instrutores.*", "usuarios.*", "categorias.*","aulas.*", "aulas.id as idDaAula" ])
            .table("aulas")
            .innerJoin("cursos", "cursos.id", "aulas.idCurso")
            .innerJoin("instrutores", "instrutores.id", "cursos.idInstrutor")
            .innerJoin("usuarios", "usuarios.id", "instrutores.idUsuario")
            .innerJoin("categorias", "categorias.id", "cursos.idCategoria")
            .where(function() {
                this.where("aulas.tituloAula", "LIKE", `%${tituloAula}%`)
                    .andWhere("cursos.titulo", "LIKE", `%${tituloCurso}%`);
            })
            .first()
            return aula

        } catch (error) {
            console.log(error)
            return []
        }
       
    } 


    async perguntasCursoAssistir(tituloAula, tituloCurso){
        try {
            const aula = await this.buscaAulaCompletaAssistir(tituloAula, tituloCurso);

            var perguntas = 
            await knex.select(["perguntas.*", "usuarios.*"]).table("perguntas")
            .innerJoin("cursos", "cursos.id", "perguntas.idCurso")
            .innerJoin("usuarios", "usuarios.id", "perguntas.idUsuario")
            .where("perguntas.idAula", aula.idDaAula )

            return perguntas 

        } catch (error) {
            console.log(error)
            return []
        }
       
    }

    async listaCursos(){
        try {
            var cursos = 
            await knex.select("cursos.*",
                "instrutores.nomeCompleto",
                knex.raw("(SELECT CEIL(AVG(avaliacoes_curso.avaliacao)) FROM avaliacoes_curso WHERE avaliacoes_curso.idCurso = cursos.id) as mediaAvaliacoes")
            )
            .table("cursos")
            .innerJoin("instrutores" ,"cursos.idInstrutor", "instrutores.id")

            return cursos
        } catch (error) {
            console.log(error)
            return []
            
        }
    }

    async pegaUsuario(idUsuario){
        try {
            var usuario = 
            await knex.select().table("usuarios")
            .where("id", idUsuario)
            .first()

            return usuario
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async perguntarAulaModel(idCurso, idAula, idUsuarioLogado, tituloPergunta, descricaoPergunta, dataPergunta){
        try {
            await knex.insert({
                idCurso: idCurso,
                idAula: idAula,
                idUsuario: idUsuarioLogado,
                tituloPergunta: tituloPergunta,
                descricaoPergunta: descricaoPergunta,
                dataPergunta: dataPergunta
            }).table("perguntas")

            return {status: true}

        } catch (error) {
            console.log("erro interno")
            return {status: false}
        }
    }

    async deletaVideoAssistido(idAulaConcluida){
        try {
            await knex.table("aulas_concluidas")
            .where('id', idAulaConcluida)
            .delete()

            return {status: true}
        } catch (error) {
            console.log(error)
            return {status: false}
            
        }
    }

    async adicionarVideoAssistido(idUsuario, idAula, idCurso, concluida, dataConclusao){
        try {
            await knex.insert({
                idUsuario: idUsuario,
                idAula: idAula,
                idCurso: idCurso,
                concluida: concluida,
                dataConclusao: dataConclusao
            }).table("aulas_concluidas")

            return {status: true}
            
        } catch (error) {
            console.log(error)
            return {status: false}
            
        }
    }

    async instrutorNomeUsuario(idUsuarioSession){
        try {
            const instrutor =
            await knex.select(["usuarios.nomeUsuario as nomeUsuario",
                               "instrutores.id as idInstrutor",
                               "usuarios.id as idUsuario" ])
            .table("usuarios")
            .innerJoin("instrutores", "instrutores.idUsuario", "usuarios.id")
            .where("usuarios.id", idUsuarioSession)
            .first()
            return instrutor
        } catch (error) {
            console.log(error)
            return []
        }
          
    }

  

}


    

 
    


module.exports = new Curso()