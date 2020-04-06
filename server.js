var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var ent = require('ent')
var bodyParser = require('body-parser')
var cors = require('cors');

app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors());

app.post('/login', (req, res, next) => {
    console.log(req.body.pincode)
})

app.get('/login', (req, res) => {
    res.setHeader('Content-type', 'text/html')
    res.send("Salut")
})

app.use(function(req, res, next) {
    res.setHeader('Content-type', 'text/html')
    res.status(404).send('Page introuvable !')
})

server.listen(8080, () => console.log('Server started at port : 8080'))