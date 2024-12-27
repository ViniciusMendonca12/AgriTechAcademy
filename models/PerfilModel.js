var knex = require("../database/database")

class Perfil{

    async perfilUsuario(id){
        try{
            var perfil = 
            await knex.select("usuarios.nomeUsuario as nomeUsuario",
                              "usuarios.imagemUsuario as imagemUsuario",
                              "usuarios.email as emailUsuario",
                              "instrutores.nomeCompleto as nomeCompletoInstrutor",
                              "instrutores.dataDeNascimento as DataDeNascimentoInstrutor",
                              "instrutores.celular as celularInstrutor",
                              "instrutores.endereco",
                              "instrutores.cpf"
                            )
                .table("usuarios") 
                .leftJoin("instrutores","instrutores.idUsuario", "usuarios.id")
                .where("usuarios.id", id).first()

            return perfil
            
        }catch(err){
            console.log(err)
            return []
        }
    }

    async findPerfilUsuarioByID(id){
        try {
            var perfil = await knex.select("usuarios.*").table("usuarios").where("usuarios.id", id).first()
            return perfil
        } catch (err) {
            res.status(403)
            return [] 
        }
    }

    async findPerfilInstrutorByID(id){
        try {
            var perfil = await knex.select("instrutores.*").table("instrutores")
                        .where("instrutores.idUsuario", id).first()
            return perfil
        } catch (err) {
            res.status(403)
            return []
        }
    }

    async editarUsuarioPerfil(id, nomeUsuario, bibliografia, email, twitter, facebook, linkedin, github, profissao){
        
        var usuarioPerfil = await this.findPerfilUsuarioByID(id)

        if(usuarioPerfil != undefined){

            var editarUsuarioPerfil = {
                nomeUsuario: nomeUsuario,
                email: email,
                twitter: twitter,
                facebook: facebook,
                github: github,
                linkedin: linkedin,
                profissao: profissao,
                bibliografia: bibliografia

            }
            
            try {
                await knex.update(editarUsuarioPerfil).where({id:id}).table("usuarios")
                return {status: true}
            } catch (err) {
                return {status: true, err:err}

            }

        }else{
            return {status: false, err: "usuario nao existe"}

        }
    }

    async editarInstrutorPerfil(id, cpf, endereco, nomeCompleto, celular, dataDeNascimento){ 
        
        var instrutorPerfil = await this.findPerfilInstrutorByID(id)

        if(instrutorPerfil != undefined){

            var editarInstrutorPerfil = {
                cpf: cpf, 
                endereco: endereco,
                nomeCompleto: nomeCompleto,
                celular: celular,
                dataDeNascimento: dataDeNascimento
            }
            
            try {
                await knex.update(editarInstrutorPerfil).where({idUsuario:id}).table("instrutores")
                return {status: true}
            } catch (err) {
                return {status: true, err:err}

            }

        }else{
            res.json("Falha ao encontrar Instrutor")

        }


    }

    async editarImagemPerfil(idUsuario, imagemUsuario){ 
        
            try {
                await knex.update({imagemUsuario: imagemUsuario})
                .where("id", idUsuario)
                .table("usuarios")
                return {status: true}
            } catch (err) {
                return {status: true, err:err}
                
            }
    }




}

module.exports = new Perfil()