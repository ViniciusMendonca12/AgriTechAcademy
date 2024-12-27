var knex = require("../database/database")

class Usuarios{

    async pegaInformacoesUsuario(idUsuarioSession){
        try {
            var usuario =
            await knex.select("usuarios.*").where("usuarios.id", idUsuarioSession)
            .table("usuarios").first()
    
            return usuario 

        } catch (error) {
            console.log(error)
            return []
        }
        
    }

    async validacaoEmail(emailUsuario){
        try {
            var email = 
            await knex.select("usuarios.*").where("usuarios.email", emailUsuario)
            .table("usuarios")
            .first()

            return email

        } catch (error) {
            console.log(error)
            return []
            
        }
    }

    async cadastraUsuario(nomeUsuario, emailUsuario, hash){
        try {
            await knex.insert({
                nomeUsuario: nomeUsuario,
                email: emailUsuario,
                senha: hash,
                imagemUsuario: "../img/icons/avatar.png"
            }).into("usuarios")

            return {status:true}

        } catch (error) {
            console.log(error +" erro ao cadastrar Usuario")
            return {status:false}

        }
    }


   
  

}

module.exports = new Usuarios()