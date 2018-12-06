var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 3000;
server.listen (port, function() {
	console.log ('listening on port ' + port)
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index4.html');
});

var nID = 0;

//////////////////////////////////////////////////////////
// things to do when a client connects
io.on('connect', function(socket){

  console.log ('a user connected with socket ');

  console.log ('client ' + nID + ' login ...')

  // assign and return its ID to the new client
  // inform the connecting client its ID
  socket.emit ('id_set', nID);

  // broadcast to all others of new client
  socket.broadcast.emit ('new_id', nID)

  // ready for next connecting client
  ++nID;

  //////////////////////////////////////////////////////////
  // handler for messages coming from clients
  //
  socket.on ('vel', function (vecStr) {

	// 解開，瞧瞧...  (不做任何事)
  	var vv = JSON.parse (vecStr)
    // vecStr has this info: { me: myID, v:[x0, x1, x2] };
  	console.log (vv);

	// 直接把vecStr傳給其他clients
  	console.log ('send to all others')
  	socket.broadcast.emit ('velOther', vecStr)
  });
});
