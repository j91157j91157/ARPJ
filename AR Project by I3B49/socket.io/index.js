var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log ('a user connected with socket ');
  
  socket.on('chat', function(msg){
  	console.log ('chat: ' + msg);
    io.emit('chat', msg);
  });
  
  socket.on('toggle message', function(msg) {
  	console.log ('move ' + msg);
  	io.emit ('toggle message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

