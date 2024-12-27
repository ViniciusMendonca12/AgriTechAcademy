var express = require("express");
var app = express();
var router = express.Router();
const MeuAprendizadoController = require("../controler/MeuAprendizadoController");
const PerfilController = require("../controler/PerfilController");
const CategoriasController = require("../controler/CategoriasController");
const CursoController = require("../controler/CursoController");
const InstrutoresController = require("../controler/InstrutoresController");
const Middleware = require("../controler/Middleware");
const UsuariosController = require("../controler/UsuariosController");


// Rotas Cursos
router.get("/gerenciador/aulas/:tituloCurso", CursoController.paginaCadastrarAula)
router.get("/assistir/aula/:nomeCurso/:nomeAula", CursoController.assistirAula)
router.get("/assistir/curso/:nomeCurso/", CursoController.assistirCurso)
 
router.get("/cursos", CursoController.listaCursos)
router.get("/cadastro/curso/:idCurso?", Middleware.AutenticacaoInstrutor, CursoController.CadastroEEditaCurso)


//rota cadastro instrutor
router.get("/cadastro/instrutor", InstrutoresController.carregaPaginaCadastroInstrutores)

// rota cadastroUsuario
router.get("/cadastro", UsuariosController.carregaPaginaCadastroUsuario)


//rota login
router.get("/login", UsuariosController.carregaPaginaLoginUsuario)


// rota logout
router.get("/logout", UsuariosController.logoutUsuario)

//rota home

router.get("/", UsuariosController.carregaHome)


module.exports = router;