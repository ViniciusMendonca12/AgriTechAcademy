const pages = {
    cadastrarCurso: [
        { href: "/cursos", label: "Todos cursos", authRequired: false },
        { href: "/meu-aprendizado", label: "Meu Aprendizado", authRequired: true }
    ],
    meuAprendizado: [
        { href: "/cadastro/curso", label: "Cadastrar Curso", authRequired: true },
        { href: "/cadastro/instrutor", label: "Tornar-se Instrutor", authRequired: true },
        { href: "/cursos", label: "Todos cursos", authRequired: false }
    ],
    cursos: [
        { href: "/gerenciar/cursos", label: "Gerenciar meus cursos",authRequired: true },
        { href: "/perfil/usuario", label: "Pefil",authRequired: true },
        { href: "/meu-aprendizado", label: "Meu aprendizado",authRequired: true },


    ]
};

module.exports = pages;
