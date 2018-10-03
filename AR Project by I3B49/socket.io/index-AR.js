var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 3000;
server.listen (port, function() {
	console.log ('listening on port ' + port)
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index-AR.html');
});

var nID = 0;

// two-client turning status
var status = [];

io.on('connect', function(socket){

  //////////////////////////////////////////////////////////
  // things to do when a client connects
  console.log ('a user connected with socket ');

  // assign and return the ID of the new client
  console.log ('client ' + nID + ' login ...')
  socket.emit ('id_set', nID);

  // broadcast to all others of new client
  socket.broadcast.emit ('new_id', nID)

  // inform the status of all other clients ...
  // new kid needs to learn about old fellows

  status.push ({id: nID, turn: false});
  console.log (status);
  io.emit ('update_status', status)

  // this must be the LAST thing to do
  ++nID;

  //////////////////////////////////////////////////////////
  socket.on('toggle', function(myID) {
  	console.log (myID + ': toggle turning');
  	// find myID in status
  	let i;
  	for (i = 0; i < status.length; i++) {
  		if (status[i].id === myID) break;
  	}
 	status[i].turn = !status[i].turn;

 	console.log (status)
  	io.emit ('update_status', status);
  });


});
