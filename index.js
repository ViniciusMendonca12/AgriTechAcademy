const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
var router = require("./routes/routes")


var PagesRouter = require("./routes/PagesRouter")

var UsuariosController = require("./controler/UsuariosController")


// view engine (para utilizar o ejs)

app.set("view engine", "ejs")


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//static(para usar arquivos estaticos fts, css)
app.use(express.static("public"))


app.use(session({
    secret: "fofinho", cookie: {maxAge: 100000000}
}))


app.use("/", router)
app.use("/", PagesRouter)

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const jQuery = require('jquery');

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <title>jQuery with Node.js</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <div id="content">This is some content</div>
</body>
</html>
`);

const $ = jQuery(dom.window);



app.get("/", UsuariosController.carregaHome)


app.listen(8080, () =>{
    console.log("O servidor foi executado")
})

