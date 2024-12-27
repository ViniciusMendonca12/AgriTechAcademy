var express = require("express");
var app = express();
var router = express.Router();
const MeuAprendizadoController = require("../controler/MeuAprendizadoController");
const PerfilController = require("../controler/PerfilController");
const CategoriasController = require("../controler/CategoriasController");
const CursoController = require("../controler/CursoController");
const Avaliacoes = require("../controler/AvaliacoesController");

const Middleware = require("../controler/Middleware");
const InstrutoresController = require("../controler/InstrutoresController");
const UsuariosController = require("../controler/UsuariosController");


/* rotas meu aprendizado */
router.get("/meuAprendizado/filtro", MeuAprendizadoController.exibeMeuAprendizadoFiltro)
router.get("/meu-aprendizado", Middleware.AutenticacaoLogin, MeuAprendizadoController.exibeMeuAprendizado)
router.post("/obter-curso", MeuAprendizadoController.adicionaCursoMeuAprendizado)
router.get("/meuAprendizado/instrutores", MeuAprendizadoController.listaTodosInstrutoresCursos)


/* rotas Perfil */
router.get("/perfil", PerfilController.perfilUsuario)
router.get("/perfilUsuario", PerfilController.perfilUsuarioByID)
router.get("/perfilInstrutor", PerfilController.perfilInstrutorByID)
router.put("/perfilUsuario", PerfilController.editarUsuarioPerfil)
router.put("/perfilInstrutor", PerfilController.editarInstrutorPerfil)
router.put("/perfilImagem", PerfilController.editarImagemPerfil)

router.get("/perfil/usuario", PerfilController.perfilUsuario)

/* rotas Categorias */
router.get("/categorias", CategoriasController.todasCategorias)


/* rotas cursos */
router.get("/informacoes-curso/:idCurso", CursoController.informacoesCurso)
router.post("/cadastrar/curso", CursoController.cadastrarCurso)
router.get("/gerenciar/cursos", CursoController.exibirGerenciarMeusCursos)
router.get("/gerenciar/cursos/filtro", CursoController.exibirGerenciarMeusCursosFiltro)
router.post("/cadastrar/aula", CursoController.cadastrarAula)
router.put("/editar/aula/:idAula", CursoController.editarAula)
router.delete("/deletar/aula/:idAula", CursoController.deletarAula)

router.get("/aula/unica/:idAula", CursoController.recuperaAulaUnica)

router.delete("/curso/:idCurso", CursoController.deletarCurso)

router.get("/curso/:idCurso", CursoController.pegarInformacoesCursoUnico)
router.put("/curso/:idCurso", CursoController.editarCurso)

router.get("/curso/aulas/:idCurso", CursoController.listaTodasAulasCursos)

router.get("/assistir/curso/:nomeCurso", CursoController.assistirCurso)

router.post("/perguntarAulaCurso", CursoController.perguntarAula)

router.post("/removeVideoAssistido", CursoController.deletaVideoAssistido)
 
router.post("/salvaVideoAssistido", CursoController.adicionaVideoAssistido)

/* rotas avaliações */

router.post("/curso/avaliacao", Avaliacoes.cadastrarEditarAvaliacao)
router.get("/curso/avaliacao/usuario/:idCurso", Avaliacoes.pegaAvaliacaoExisteUsuarioCurso)
router.get("/avaliacao/estatisticas/:idCurso", Avaliacoes.estatisticasAvaliacoesCurso)

// rotas instrutores
router.post("/cadastrarInstrutor",InstrutoresController.cadastrarInstrutor)


//rotas usuarios
router.post("/cadastrar/usuario", UsuariosController.cadastrarUsuario)
router.post("/autenticarLogin", UsuariosController.autenticarLogin)

module.exports = router;