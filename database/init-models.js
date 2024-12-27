/* var DataTypes = require("sequelize").DataTypes;
var _certificados = require("./certificados");
var _cursos = require("./cursos");
var _instrutores = require("./instrutores");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var certificados = _certificados(sequelize, DataTypes);
  var cursos = _cursos(sequelize, DataTypes);
  var instrutores = _instrutores(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  certificados.belongsTo(cursos, { as: "idCurso_curso", foreignKey: "idCurso"});
  cursos.hasMany(certificados, { as: "certificados", foreignKey: "idCurso"});
  cursos.belongsTo(instrutores, { as: "idInstrutor_instrutore", foreignKey: "idInstrutor"});
  instrutores.hasMany(cursos, { as: "cursos", foreignKey: "idInstrutor"});
  certificados.belongsTo(usuarios, { as: "idUsuario_usuario", foreignKey: "idUsuario"});
  usuarios.hasMany(certificados, { as: "certificados", foreignKey: "idUsuario"});
  instrutores.belongsTo(usuarios, { as: "idUsuario_usuario", foreignKey: "idUsuario"});
  usuarios.hasMany(instrutores, { as: "instrutores", foreignKey: "idUsuario"});

  return {
    certificados,
    cursos,
    instrutores,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
 */