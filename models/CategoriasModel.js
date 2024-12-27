var knex = require("../database/database")

class Categorias{

    async todasCategorias(){
        try {
            var result =  knex.select("categorias.*").table("categorias")
            return result 
        } catch (error) {
            console.log(error)
            return []
        }

       

    }
  

}

module.exports = new Categorias()