var express = require('express')
var app = express()
var server = require('http').createServer(app)
var router = express.Router()
var io = require('socket.io').listen(server)
var ent = require('ent')
var mongoose = require('mongoose')

app.use(function(req, res, next) {
    res.setHeader('Content-type', 'text/html')
    res.status(404).send('Page introuvable !')
})

router.post('/login', () => {
    console.log('requête')
})

server.listen(8080, () => console.log('Server started at port : 8080'))