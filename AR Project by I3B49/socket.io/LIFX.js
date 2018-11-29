var express = require('express');
var app = express();

app.get ('/', function (req, res) {
	console.log ('client connected')
	res.sendFile(__dirname + '/LIFX.html');
	//res.send ('hello world');
});

app.get ('/turnOff', function (req, res) {
		var outputStr;
		client.lights().forEach(function(light) {
		  light.off(0, function(err) {
		    if (err)
		      outputStr = 'Turning light ' + light.id + ' off failed';
		  })
		  outputStr = 'Turned light ' + light.id + ' off';
		})
		console.log (outputStr)

		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Content-Type"
		});
		res.write(JSON.stringify (outputStr));
		res.end();
});

app.get ('/turnOn', function (req, res) {
		var outputStr;

		client.lights().forEach(function(light) {
		  light.on(0, function(err) {
		    if (err)
		      outputStr = 'Turning light ' + light.id + ' on failed';
		  })
		  outputStr = 'Turned light ' + light.id + ' on';
		})
		console.log (outputStr)

		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Content-Type"
		});
		res.write(JSON.stringify(outputStr));
		res.end();
});

/*app.get ('/red', function (req, res) {
		var outputStr;

		client.lights().forEach(function(light) {
		  light.color(0, 100, 100, 3500, 0, function(err) {
		    if (err) {
		      outputStr = 'Turning light ' + light.id + ' red failed';
		    }
		   });
		   outputStr = 'Turned light ' + light.id + ' red';
		});
		console.log (outputStr)

		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Content-Type"
		});
		res.write(JSON.stringify(outputStr));
		res.end();
});*/

app.get ('/hud', function (req, res) {

				var vec = req.query.color;
				var hue = parseFloat(vec[0]);
				var sat = parseFloat(vec[1]);
				if(sat < 0) sat = 0;
				else if (sat > 1) sat = 1;
				console.log(req.query);
				//console.log(req.query.v);

				var outputStr;

				client.lights().forEach(function(light) {
				   light.color(hue*360, sat*100, 100, 3500, 0, function(err) { //three.js的HSL要轉成LIFX專用的HSL
				    if (err) {
				      outputStr = 'Turning light ' + light.id + ' hud failed';
				    }
				   });
				   outputStr = 'Turned light ' + light.id + ' hud';
				});
				console.log (outputStr)

				res.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Content-Type"
				});
				res.write(JSON.stringify(outputStr));
				res.end();
});

app.listen (3000, function () {
	console.log ('server started on port 3000');
}) ;

/////////////////////////////////////////////////////////

//var LifxClient = require('../lib/lifx').Client;
var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

client.on('light-new', function(light) {
  console.log('New light found.');
  console.log('ID: ' + light.id);
  console.log('IP: ' + light.address + ':' + light.port);
  light.getState(function(err, info) {
    if (err) {
      console.log(err);
    }
    console.log('Label: ' + info.label);
    console.log('Power:', (info.power === 1) ? 'on' : 'off');
    console.log('Color:', info.color);
  });

  light.getHardwareVersion(function(err, info) {
    if (err) {
      console.log(err);
    }
    console.log('Device Info: ' + info.vendorName + ' - ' + info.productName);
    console.log('Features: ', info.productFeatures, '\n');
  });
});

client.on('light-online', function(light) {
  console.log('Light back online. ID:' + light.id + ', IP:' + light.address + ':' + light.port + '\n');
});

client.on('light-offline', function(light) {
  console.log('Light offline. ID:' + light.id + ', IP:' + light.address + ':' + light.port + '\n');
});

client.on('listening', function() {
  var address = client.address();
  console.log(
    'Started LIFX listening on ' +
    address.address + ':' + address.port + '\n'
  );
});

client.init();
/*
console.log('Keys:');
console.log('Press 1 to turn the lights on');
console.log('Press 2 to turn the lights off');
console.log('Press 3 to turn the lights red');
console.log('Press 4 to turn the lights green');
console.log('Press 5 to turn the lights blue');
console.log('Press 6 to turn the lights a bright bluish white');
console.log('Press 7 to turn the lights a bright reddish white');
console.log('Press 8 to show debug messages including network traffic');
console.log('Press 9 to hide debug messages including network traffic');
console.log('Press 0 to exit\n');
*/

/*
process.stdin.setEncoding('utf8');
process.stdin.setRawMode(true);

process.stdin.on('data', function(key) {
  if (key === '1') {
    client.lights().forEach(function(light) {
      light.on(0, function(err) {
        if (err) {
          console.log('Turning light ' + light.id + ' on failed');
        }
        console.log('Turned light ' + light.id + ' on');
      });
    });
  } else if (key === '2') {
    client.lights().forEach(function(light) {
      light.off(0, function(err) {
        if (err) {
          console.log('Turning light ' + light.id + ' off failed');
        }
        console.log('Turned light ' + light.id + ' off');
      });
    });
  } else if (key === '3') {
    client.lights().forEach(function(light) {
      light.color(0, 100, 100, 3500, 0, function(err) {
        if (err) {
          console.log('Turning light ' + light.id + ' red failed');
        }
        console.log('Turned light ' + light.id + ' red');
      });
    });
  } else if (key === '4') {
    client.lights().forEach(function(light) {
      light.color(120, 100, 100, 3500, 0, function(err) {
        if (err) {
          console.log('Turning light ' + light.id + ' green failed');
        }
        console.log('Turned light ' + light.id + ' green');
      });
    });
  } else if (key === '5') {
    client.lights().forEach(function(light) {
      light.color(240, 100, 100, 3500, 0, function(err) {
        if (err) {
          console.log('Turning light ' + light.id + ' blue failed');
        }
        console.log('Turned light ' + light.id + ' blue');
      });
    });
  } else if (key === '6') {
    client.lights().forEach(function(light) {
      light.color(0, 0, 100, 9000, 0, function(err) {
        if (err) {
          console.log('Turning light ' + light.id + ' bright bluish white failed');
        }
        console.log('Turned light ' + light.id + ' bright bluish white');
      });
    });
  } else if (key === '7') {
    client.lights().forEach(function(light) {
      light.color(0, 0, 100, 2500, 0, function(err) {
        if (err) {
          console.log('Turning light ' + light.id + ' bright reddish white failed');
        }
        console.log('Turned light ' + light.id + ' bright reddish white');
      });
    });
  } else if (key === '8') {
    client.setDebug(true);
    console.log('Debug messages are shown');
  } else if (key === '9') {
    client.setDebug(false);
    console.log('Debug messages are hidden');
  } else if (key === '\u0003' || key === '0') { // Ctrl + C
    client.destroy();
    process.exit(); // eslint-disable-line no-process-exit
  }
});
*/
