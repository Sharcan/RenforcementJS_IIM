//On appelle tous les modules dont on a besoin
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var ent = require('ent')
var bodyParser = require('body-parser')
var cors = require('cors');

//On dit à notre application d'utiliser nos modules
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors());

//On définit le dossier contenant notre CSS et JS
app.use(express.static(__dirname + '/public'));

//On écoute l'URL '/login'. Si on y reçoit un post, on lance la fonction
app.post('/login', (req, res, next) => {

    //Si le pincode (contenu dans le body) est '1234' on retourne le status 200 (ok)
    if (req.body.pincode == "1234") {
        return res.status(200).json({ status: true })

    //Sinon, on retourne le status 404 (pas ok)
    } else {
        return res.status(404).json({ status: false })
    }
})

//On définit nos routes
app.get('/', function(req, res) {
    res.render('index.ejs')
})
app.get('/chat', function(req, res) {
    res.render('chat.ejs')
})

//Si on va sur une page non définie sur le port de node, on écrit "Page introuvable"
app.use(function(req, res, next) {
    res.setHeader('Content-type', 'text/html')
    res.status(404).send('Page introuvable !')
})

//On dit à Node de se lancer sur le port 8080
server.listen(8080, () => console.log('Server started at port : 8080'))