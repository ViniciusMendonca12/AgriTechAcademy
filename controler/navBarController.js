const pages = require('../models/navbarController');


async function renderPage(req, res) {
    const tela = req.params.tela || 'default';
    const navItems = pages[tela] || pages.default;

    res.render('partials/navbarMeuAprendizado.ejs', {
        tela: tela,
        navItems: navItems
    });
}

module.exports = { renderPage };
