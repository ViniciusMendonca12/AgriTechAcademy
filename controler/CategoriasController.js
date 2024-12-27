var Categorias = require("../models/CategoriasModel")

class CategoriasController{
    async todasCategorias(req, res){
        if(req.session.user != undefined){
            var categorias = await Categorias.todasCategorias()
            res.json(categorias)
          }else{
            res.status(403)
            res.send("O Usuário não esta logado")
        }
      
    }
    
}

module.exports = new CategoriasController()