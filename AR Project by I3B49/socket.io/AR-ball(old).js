var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 3000;
server.listen (port, function() {
	console.log ('listening on port ' + port)
});

//向量
var v0, v1, v2;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/AR-ball.html');
	////////////
	if(req.query.v !== undefined){
		var vec = req.query.v;
		v0 = vec[0];
		v1 = vec[1];
		v2 = vec[2];
		console.log(req.query);
		//console.log(req.query.v);
	};
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

  status.push ({id: nID, turn: false, v0: v0, v1: v1, v2: v2});
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

	//向量傳送
	status[i].v0 = v0;
	status[i].v1 = v1;
	status[i].v2 = v2
	//socket.emit ('vectorX', v0, v1, v2);

 	console.log (status)
  	io.emit ('update_status', status);
  });
});
