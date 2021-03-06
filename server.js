var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function(inSocket){
    inSocket.on('draw', function(inPosition){
        inSocket.broadcast.emit('draw', inPosition);
    });
    inSocket.on('guess', function(inGuess){
        inSocket.broadcast.emit('guess', inGuess);
    });
});

server.listen(80);