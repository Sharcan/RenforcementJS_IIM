//On appelle tous les modules dont on a besoin
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var ent = require('ent');
var bodyParser = require('body-parser');
var cors = require('cors');
const cookieParser = require('cookie-parser');

//On dit à notre application d'utiliser nos modules
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//On définit le dossier contenant notre CSS et JS
app.use(express.static(__dirname + '/public'));

//On écoute l'URL '/login'. Si on y reçoit un post, on lance la fonction
app.post('/login', (req, res, next) => {

    //Si le pincode (contenu dans le body) est '1234' on retourne le status 200 (ok)
    if (req.body.pincode == "1234") {
        res.cookie('statusCode', 200);
        return res.status(200).json({ status: true });
        
    //Sinon, on retourne le status 402 (pas ok)
} else {
    return res.status(402).json({ status: false });
}
})

//On définit nos routes
app.get('/', function(req, res) {
    res.render('index.ejs');
});
app.get('/chat', function(req, res) {
    console.log(req.cookies);
    if( req.cookies.statusCode === '200'){
        res.render('chat.ejs');
    }
    else{
        res.render('402.ejs');
    }
});

//Si on va sur une page non définie sur le port de node, on écrit "Page introuvable"
app.use(function(req, res, next) {
    res.setHeader('Content-type', 'text/html');
    res.status(404).send('Page introuvable !');
});





// IO

var io = require('socket.io').listen(server);

// Lorsqu'une personne arrive sur le fichier chat.html, la fonction ci-dessous se lance
io.on('connection', (socket) => {

    // On recoit 'pseudo' du fichier html
    socket.on('pseudo', (pseudo)=>{
        
        // On conserve le pseudo dans la variable socket qui est propre à chaque utilisateur
        socket.pseudo = pseudo;

        // On previent les autres
        socket.broadcast.emit('newUser', pseudo);
    });

    // Quand un user se déconnecte
    socket.on('disconnect', () => {
        socket.broadcast.emit('quitUser', socket.pseudo);
    });

    // Quand on recoit un nouveau message
    socket.on('newMessage', (message)=> {
        socket.broadcast.emit('newMessageAll', {message: message, pseudo: socket.pseudo});
    });

    socket.on('writting', (pseudo) => {
        socket.broadcast.emit('writting', pseudo);
    });

    socket.on('notWritting', (pseudo) => {
        socket.broadcast.emit('notWritting', pseudo);
    });

});



//On dit à Node de se lancer sur le port 8080
server.listen(8080, () => console.log('Server started at port : 8080'));