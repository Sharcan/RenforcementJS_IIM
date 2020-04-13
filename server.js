//DÉFINITION DES PARAMETRES

//On appelle tous les modules dont on a besoin
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var cors = require('cors');
const cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

//On se conencte à la base de données
mongoose.connect('mongodb://localhost/RenforcementJS', { useNewUrlParser: true, useUnifiedTopology: true }, function(err){
if(err) {
    console.log(err)
} else {
    console.log('Connected to mongodb')
}
})

//On va cherche les models 
require('./models/user.model');
require('./models/chat.model');
require('./models/room.model');
var User = mongoose.model('user');
var Chat = mongoose.model('chat');
var Room = mongoose.model('room');

//On dit à notre application d'utiliser nos modules
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//On définit le dossier contenant notre CSS et JS
app.use(express.static(__dirname + '/public'));




// ÉCOUTE DES ROUTES

//POST
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
app.post('/createuser', (req, res, next) => {

    //On cherche dans mongo le user avec ce pseudo
    User.findOne({ pseudo: req.body.pseudo }, (err, user) => {
        //Si il existe, on connecte le user en mettant son pseudo dans les cookies
        if(user) {
            res.cookie('pseudo', user.pseudo)
            return res.status(200).json({ status: true })
        //Sinon on crée le user et on le connecte
        } else {
            var user = new User();
            user.pseudo = req.body.pseudo;
            user.save();

            res.cookie('pseudo', user.pseudo)
            return res.status(200).json({ status: true })
        }
    })
})

//GET
app.get('/', function(req, res) {
    res.render('index.ejs');
});
app.get('/chat', function(req, res) {
    if( req.cookies.statusCode === '200'){
        res.render('chat.ejs');
    }
    else{
        res.render('402.ejs');
    }
});

//404
app.use(function(req, res, next) {
    res.setHeader('Content-type', 'text/html');
    res.status(404).send('Page introuvable !');
});




// IO

var io = require('socket.io').listen(server);

// Lorsqu'une personne arrive sur le fichier chat.html, la fonction ci-dessous se lance
io.on('connection', (socket) => {
    
    // On recoit 'pseudo' du fichier html
    socket.on('pseudo', (pseudo) => {
        
        // On conserve le pseudo dans la variable socket qui est propre à chaque utilisateur
        socket.pseudo = pseudo;

        // On previent les autres
        socket.broadcast.emit('newUser', pseudo);
    });

    socket.on('channel', (channel) => {
        socket.join(channel);
        socket.channel = channel;

        Room.findOne({_id: socket.channel}, (err, channel) => {
            if(channel){
                Chat.find({_id_room: socket.channel}, (err, messages) => {
                    if(!messages){
                        return false;
                    }
                    else{
                        socket.emit('oldMessages', messages);
                    }
                })
            }
            else {

                var room = new Room();
                room._id = socket.channel;
                room.save();

                return true;
            }
        })
    });

    // Quand un user se déconnecte
    socket.on('disconnect', () => {
        socket.broadcast.emit('quitUser', socket.pseudo);
    });

    // Quand on recoit un nouveau message
    socket.on('newMessage', (message)=> {
        // socket.broadcast.emit('newMessageAll', {message: message, pseudo: socket.pseudo});
        socket.broadcast.to(socket.channel).emit('newMessageAll', {message: message, pseudo: socket.pseudo});

        var chat = new Chat();
        chat._id_room = socket.channel;
        chat.sender = socket.pseudo;
        chat.content = message;
        chat.save();


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