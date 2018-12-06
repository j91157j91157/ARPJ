var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 3000;
server.listen (port, function() {
	console.log ('listening on port ' + port)
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index5.html');
});

var nID = 0;

io.on('connect', function(socket){

  //////////////////////////////////////////////////////////
  // things to do when a client connects
  console.log ('a user connected with socket ');

  // assign and return the ID of the new client
  console.log ('client ' + nID + ' login ...')
  socket.emit ('id_set', nID);

  // broadcast to all others of new client
  socket.broadcast.emit ('new_id', nID)

  ++nID;
  //////////////////////////////////////////////////////////
  /*socket.on('toggle', function(myID) {
  	console.log (myID + ': toggle turning');
  	// find myID in status
  	let i;
  	for (i = 0; i < status.length; i++) {
  		if (status[i].id === myID) break;
  	}
	 	status[i].turn = !status[i].turn;

	 	console.log (status);
	  io.emit ('update_status', status);
  });*/

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
